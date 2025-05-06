// Document entity interface
export interface Document {
  id: string;
  title: string;
  content?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
