export enum Role {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  role: Role;
  text: string;
  image?: string; // base64 encoded image
}

export type Theme = 'light' | 'dark';

export type AppMode = 'chat' | 'image_generator';