import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DocumentApi, { CreateDocumentDto, UpdateDocumentDto } from '../api/document';

// Define a type for document filters
export interface DocumentFilters {
  title?: string;
  content?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Add other filter properties as needed
}

// Query keys for documents
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: DocumentFilters = {}) => [...documentKeys.lists(), { filters }] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

// Hook for fetching all documents
export const useDocuments = (filters?: DocumentFilters) => {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: () => DocumentApi.getAll(),
  });
};

// Hook for fetching a single document by id
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => DocumentApi.getById(id),
    enabled: !!id, // Only run if id exists
  });
};

// Hook for creating a document
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDocument: CreateDocumentDto) => DocumentApi.create(newDocument),
    onSuccess: () => {
      // Invalidate documents list to trigger refetch
      queryClient.invalidateQueries({
        queryKey: documentKeys.lists(),
      });
    },
  });
};

// Hook for updating a document
export const useUpdateDocument = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (document: UpdateDocumentDto) => DocumentApi.update(id, document),
    onSuccess: (updatedDocument) => {
      // Update document in cache
      queryClient.setQueryData(documentKeys.detail(id), updatedDocument);
      
      // Invalidate lists that might contain this document
      queryClient.invalidateQueries({
        queryKey: documentKeys.lists(),
      });
    },
  });
};

// Hook for deleting a document
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DocumentApi.delete(id),
    onSuccess: (_data, id) => {
      // Remove document from cache
      queryClient.removeQueries({
        queryKey: documentKeys.detail(id),
      });
      
      // Invalidate documents list to trigger refetch
      queryClient.invalidateQueries({
        queryKey: documentKeys.lists(),
      });
    },
  });
};