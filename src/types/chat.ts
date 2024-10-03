// src/types/chat.ts

export interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: Date;
  avatarUrl?: string; // Optional avatar URL
}
