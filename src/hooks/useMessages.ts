import { useReducer, useEffect, useState } from 'react';
import {
  getMessages,
  updateMessage,
  deleteMessage,
} from '@/services/apiService';
import { webSocketService } from '@/services/wsService';
import { MessageType } from '@/types/chat';

interface ApiResponse {
  messages: MessageType[];
  total: number;
  page: number;
  size: number;
}

// Define action types for the reducer
type MessageAction =
  | { type: 'INITIALIZE_MESSAGES'; payload: MessageType[] }
  | { type: 'ADD_MESSAGES'; payload: MessageType[] }
  | { type: 'ADD_MESSAGE'; payload: MessageType }
  | { type: 'UPDATE_MESSAGE'; payload: MessageType }
  | { type: 'DELETE_MESSAGE'; payload: string };

// Reducer function to manage the state of messages
const messagesReducer = (
  state: MessageType[],
  action: MessageAction,
): MessageType[] => {
  switch (action.type) {
    case 'INITIALIZE_MESSAGES':
      // Initialize or reset the message list
      return action.payload;
    case 'ADD_MESSAGES': {
      // Prepend new messages (usually for pagination of older messages)
      const newMessages = action.payload.filter(
        (newMsg) => !state.some((existingMsg) => existingMsg.id === newMsg.id),
      );
      return [...state, ...newMessages]; // Add new messages at the end of the array
    }
    case 'ADD_MESSAGE':
      // Append a new message (incoming message)
      return [action.payload, ...state]; // Add new message at the start
    case 'UPDATE_MESSAGE':
      // Update a specific message by ID
      return state.map((msg) =>
        msg.id === action.payload.id ? action.payload : msg,
      );
    case 'DELETE_MESSAGE':
      // Remove a specific message by ID
      return state.filter((msg) => msg.id !== action.payload);
    default:
      return state;
  }
};

interface UseMessagesReturn {
  messages: MessageType[]; // The list of messages
  isLoading: boolean; // Loading state for fetching messages
  error: string | null; // Error state
  hasMore: boolean; // Whether more messages can be loaded (pagination)
  total: number; // Total number of messages in the conversation
  page: number; // Current page of messages
  size: number; // Number of messages per page
  sendUserMessage: (content: string) => Promise<void>; // Function to send a new message
  editMessage: (id: string, content: string) => Promise<void>; // Function to edit a message
  removeMessage: (id: string) => Promise<void>; // Function to delete a message
  loadMoreMessages: () => Promise<void>; // Function to load more messages (pagination)
  isAiTyping: boolean; // Whether the AI is currently typing
}

/**
 * Custom hook to manage the state and behavior of chat messages.
 * This hook handles message retrieval, sending, editing, and deletion.
 * It also manages WebSocket events for real-time message handling and typing indicators.
 *
 * @param {string | null} conversationId - The ID of the current conversation.
 * @param {number} [initialPage=1] - The initial page number for pagination.
 * @param {number} [initialSize=15] - The initial number of messages per page.
 * @returns {UseMessagesReturn} - Returns the current state and functions for managing messages.
 */
const useMessages = (
  conversationId: string | null,
  initialPage: number = 1,
  initialSize: number = 15,
): UseMessagesReturn => {
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [size, setSize] = useState<number>(initialSize);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);

  /**
   * Fetch messages from the API based on the current conversation ID and page number.
   * This function also updates the state for pagination and error handling.
   *
   * @param {number} currentPage - The current page of messages to fetch.
   */
  const fetchMessages = async (currentPage: number) => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetchedData: ApiResponse = await getMessages(
        conversationId,
        currentPage,
        size,
      );

      const fetchedMessages = fetchedData.messages;

      if (currentPage === 1) {
        dispatchMessages({
          type: 'INITIALIZE_MESSAGES',
          payload: fetchedMessages,
        });
      } else {
        dispatchMessages({
          type: 'ADD_MESSAGES',
          payload: fetchedMessages,
        });
      }

      setTotal(fetchedData.total);
      setHasMore(messages.length + fetchedMessages.length < fetchedData.total);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize WebSocket connection and listen for incoming messages and typing events.
   */
  const initWebSocket = () => {
    if (!conversationId) return;
    webSocketService.connect(conversationId);
    webSocketService.joinConversation(conversationId);
    webSocketService.onIncomingMessage((message) => {
      // Handle new incoming message
      dispatchMessages({ type: 'ADD_MESSAGE', payload: message });
      setTotal((prevTotal) => prevTotal + 1);
    });
    webSocketService.onTyping((event) => {
      setIsAiTyping(event.isTyping);
    });
  };

  /**
   * Clean up WebSocket connection when leaving the conversation.
   */
  const cleanWebSocket = () => {
    if (!conversationId) return;
    webSocketService.leaveConversation();
    webSocketService.disconnect();
  };

  // Initialize messages and WebSocket when the conversationId changes
  useEffect(() => {
    if (conversationId) {
      // Reset state when conversation changes
      dispatchMessages({ type: 'INITIALIZE_MESSAGES', payload: [] });
      setPage(initialPage);
      setSize(initialSize);
      setTotal(0);
      setHasMore(true);
      fetchMessages(initialPage);
      setPage((prevPage) => prevPage + 1);
      initWebSocket();
    }

    return () => {
      cleanWebSocket();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  /**
   * Load more messages for pagination.
   */
  const loadMoreMessages = async () => {
    if (!hasMore || isLoading || !conversationId) return;
    await fetchMessages(page);
    setPage((prevPage) => prevPage + 1);
  };

  /**
   * Send a new message through WebSocket.
   *
   * @param {string} content - The content of the message to send.
   */
  const sendUserMessage = async (content: string) => {
    if (!conversationId) return;
    setError(null);
    try {
      webSocketService.sendMessage(content);
    } catch (err) {
      console.error('Error sending user message:', err);
      setError('Failed to send message.');
    }
  };

  /**
   * Edit an existing message.
   *
   * @param {string} id - The ID of the message to edit.
   * @param {string} content - The new content of the message.
   */
  const editMessage = async (id: string, content: string) => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedMsg = await updateMessage(conversationId, id, content);
      dispatchMessages({ type: 'UPDATE_MESSAGE', payload: updatedMsg });
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Failed to update message.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete an existing message.
   *
   * @param {string} id - The ID of the message to delete.
   */
  const removeMessage = async (id: string) => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteMessage(conversationId, id);
      dispatchMessages({ type: 'DELETE_MESSAGE', payload: id });
      setTotal((prevTotal) => prevTotal - 1);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete message.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    hasMore,
    total,
    page,
    size,
    sendUserMessage,
    editMessage,
    removeMessage,
    loadMoreMessages,
    isAiTyping,
  };
};

export default useMessages;
