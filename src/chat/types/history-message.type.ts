export type Role = 'user' | 'model';

export interface HistoryMessage {
  role: Role;
  parts: { text: string }[];
}
