// src/types/chat.ts

export interface MessageType {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  actions?: Record<string, string>;
}
