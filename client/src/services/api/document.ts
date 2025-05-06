import { Document } from '@/types/document';
import apiClient from './client';

export interface CreateDocumentDto {
  title: string;
  content: string;
}

export interface UpdateDocumentDto {
  title?: string;
  content?: string;
}

const DocumentApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await apiClient.get<Document[]>('/documents');
    return response.data;
  },

  getById: async (id: string): Promise<Document> => {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  create: async (document: CreateDocumentDto): Promise<Document> => {
    const response = await apiClient.post<Document>('/documents', document);
    return response.data;
  },

  update: async (id: string, document: UpdateDocumentDto): Promise<Document> => {
    const response = await apiClient.put<Document>(`/documents/${id}`, document);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  }
};

export default DocumentApi;