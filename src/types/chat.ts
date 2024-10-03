// src/types/chat.ts

export interface MessageType {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  avatar: string;
  actions?: Record<string, string>;
}
