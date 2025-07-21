export type Role = 'user' | 'ai';

export interface ChatMessageLangChain {
  role: Role;
  content: string;
  timestamp?: Date;
}
