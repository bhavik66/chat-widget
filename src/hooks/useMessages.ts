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

// Define action types
type MessageAction =
  | { type: 'INITIALIZE_MESSAGES'; payload: MessageType[] }
  | { type: 'ADD_MESSAGES'; payload: MessageType[] }
  | { type: 'ADD_MESSAGE'; payload: MessageType }
  | { type: 'UPDATE_MESSAGE'; payload: MessageType }
  | { type: 'DELETE_MESSAGE'; payload: string };

// Reducer function
const messagesReducer = (
  state: MessageType[],
  action: MessageAction,
): MessageType[] => {
  switch (action.type) {
    case 'INITIALIZE_MESSAGES':
      return action.payload;
    case 'ADD_MESSAGES': {
      // Prepend new messages for pagination (older messages)
      const newMessages = action.payload.filter(
        (newMsg) => !state.some((existingMsg) => existingMsg.id === newMsg.id),
      );
      return [...state, ...newMessages];
    }
    case 'ADD_MESSAGE':
      // Append a new message
      return [action.payload, ...state];
    case 'UPDATE_MESSAGE':
      return state.map((msg) =>
        msg.id === action.payload.id ? action.payload : msg,
      );
    case 'DELETE_MESSAGE':
      return state.filter((msg) => msg.id !== action.payload);
    default:
      return state;
  }
};

interface UseMessagesReturn {
  messages: MessageType[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  page: number;
  size: number;
  sendUserMessage: (content: string) => Promise<void>;
  editMessage: (id: string, content: string) => Promise<void>;
  removeMessage: (id: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  isAiTyping: boolean;
}

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

  // Fetch messages function
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

  const initWebSocket = () => {
    if (!conversationId) return;
    webSocketService.connect(conversationId);
    webSocketService.joinConversation(conversationId);
    webSocketService.onIncomingMessage((message) => {
      // Handle incoming message
      dispatchMessages({ type: 'ADD_MESSAGE', payload: message });
      setTotal((prevTotal) => prevTotal + 1);
    });
    webSocketService.onTyping((event) => {
      setIsAiTyping(event.isTyping);
    });
  };

  const cleanWebSocket = () => {
    if (!conversationId) return;
    webSocketService.leaveConversation();
    webSocketService.disconnect();
  };

  // Initialize messages on conversationId change
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

  // Load more messages for pagination
  const loadMoreMessages = async () => {
    if (!hasMore || isLoading || !conversationId) return;
    await fetchMessages(page);
    setPage((prevPage) => prevPage + 1);
  };

  // Send a user message
  const sendUserMessage = async (content: string) => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      // const userMsg = await sendMessage(conversationId, 'user', content);
      // dispatchMessages({ type: 'ADD_MESSAGE', payload: userMsg });
      // setTotal((prevTotal) => prevTotal + 1);
      webSocketService.sendMessage(content);
    } catch (err) {
      console.error('Error sending user message:', err);
      setError('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit a message
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

  // Remove a message
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
