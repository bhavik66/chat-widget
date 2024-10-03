import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface TypingEvent {
  userId: string;
  isTyping: boolean;
}

interface IncomingMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  avatar: string;
  actions?: string[];
}

class WebSocketService {
  private socket: Socket | null = null;
  private conversationId: string | null = null;

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

  disconnect(): void {
    console.log('disconnect', this.conversationId);
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string): void {
    if (this.socket && this.conversationId !== conversationId) {
      if (this.conversationId) {
        this.socket.emit('leave_conversation', this.conversationId);
      }
      this.conversationId = conversationId;
      this.socket.emit('join_conversation', { conversationId });
    }
  }

  leaveConversation(): void {
    console.log('leaveConversation', this.conversationId);
    if (this.socket && this.conversationId) {
      this.socket.emit('leave_conversation', {
        conversationId: this.conversationId,
      });
      this.conversationId = null;
    }
  }

  sendMessage(content: string): void {
    if (this.socket && this.conversationId) {
      this.socket.emit('send_message', {
        conversationId: this.conversationId,
        content,
      });
    }
  }

  onTyping(callback: (event: TypingEvent) => void): void {
    if (this.socket) {
      this.socket.on('typing', callback);
    }
  }

  onIncomingMessage(callback: (message: IncomingMessage) => void): void {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

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
