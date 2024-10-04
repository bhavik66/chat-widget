import { MessageType } from '@/types/chat';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

class WebSocketService {
  private socket: Socket | null = null;
  private conversationId: string | null = null;

  /**
   * Establish a WebSocket connection to the server using the provided conversation ID.
   * @param {string} conversation_id - The ID of the conversation to connect to.
   */
  connect(conversation_id: string): void {
    this.socket = io(SOCKET_URL, {
      query: { conversation_id },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Disconnects from the WebSocket server and resets the socket instance.
   */
  disconnect(): void {
    console.log('disconnect', this.conversationId);
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Joins a conversation using the conversation ID.
   * If the user is already in a conversation, they will leave it before joining the new one.
   * @param {string} conversationId - The ID of the conversation to join.
   */
  joinConversation(conversationId: string): void {
    if (this.socket && this.conversationId !== conversationId) {
      if (this.conversationId) {
        this.socket.emit('leave_conversation', this.conversationId);
      }
      this.conversationId = conversationId;
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  /**
   * Leaves the current conversation.
   * Emits the 'leave_conversation' event to the server and clears the current conversation ID.
   */
  leaveConversation(): void {
    console.log('leaveConversation', this.conversationId);
    if (this.socket && this.conversationId) {
      this.socket.emit('leave_conversation', {
        conversationId: this.conversationId,
      });
      this.conversationId = null;
    }
  }

  /**
   * Sends a message to the server as part of the current conversation.
   * @param {string} content - The content of the message to be sent.
   */
  sendMessage(content: string): void {
    if (this.socket && this.conversationId) {
      this.socket.emit('send_message', {
        conversationId: this.conversationId,
        content,
      });
    }
  }

  /**
   * Listens for typing events from the server and executes the callback when triggered.
   * @param {function} callback - A callback function to handle typing events.
   */
  onTyping(callback: (event: TypingEvent) => void): void {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  /**
   * Listens for incoming messages from the server and executes the callback when a message is received.
   * @param {function} callback - A callback function to handle incoming messages.
   */
  onIncomingMessage(callback: (message: MessageType) => void): void {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  /**
   * Emits a typing event to the server indicating whether the user is typing or not.
   * @param {boolean} isTyping - Boolean value indicating whether the user is typing.
   */
  emitTyping(isTyping: boolean): void {
    if (this.socket && this.conversationId) {
      this.socket.emit('typing', {
        conversationId: this.conversationId,
        isTyping,
      });
    }
  }
}

export const webSocketService = new WebSocketService();
