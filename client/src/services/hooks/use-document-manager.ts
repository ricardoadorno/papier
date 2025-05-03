import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { 
  useDocument, 
  useDocuments, 
  useCreateDocument, 
  useUpdateDocument, 
  useDeleteDocument 
} from '../queries/document-queries';
import { CreateDocumentDto, UpdateDocumentDto } from '../api/document';
import { withErrorHandling } from '@/lib/error-handler';

// Hook for managing document operations with better error handling
export const useDocumentManager = (documentId?: string) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Query for all documents
  const { 
    data: documents = [], 
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
    refetch: refetchDocuments
  } = useDocuments();

  // Query for a single document (only runs if documentId is provided)
  const {
    data: document,
    isLoading: isLoadingDocument,
    isError: isDocumentError,
    refetch: refetchDocument
  } = useDocument(documentId || '');

  // Mutation for creating a document
  const createDocumentMutation = useCreateDocument();
  
  // Mutation for updating a document
  const updateDocumentMutation = useUpdateDocument(documentId || '');
  
  // Mutation for deleting a document
  const deleteDocumentMutation = useDeleteDocument();

  // Create a document and navigate to it
  const createDocument = async (newDocument: CreateDocumentDto) => {
    setError(null);
    return withErrorHandling(
      () => createDocumentMutation.mutateAsync(newDocument),
      {
        successMessage: "Document created successfully",
        errorMessage: "Failed to create document. Please try again.",
        onError: () => {
          setError("Failed to create document. Please try again.");
        }
      }
    ).then(createdDocument => {
      if (createdDocument) {
        navigate(`/documents/${createdDocument.id}`);
      }
      return createdDocument;
    });
  };

  // Update a document
  const updateDocument = async (updates: UpdateDocumentDto) => {
    if (!documentId) {
      const errorMessage = 'No document ID provided for update';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }
    
    setError(null);
    return withErrorHandling(
      () => updateDocumentMutation.mutateAsync(updates),
      {
        successMessage: "Document updated successfully",
        errorMessage: "Failed to update document. Please try again.",
        onError: () => {
          setError("Failed to update document. Please try again.");
        }
      }
    );
  };

  // Delete a document and navigate to documents list
  const deleteDocument = async (id: string) => {
    setError(null);
    return withErrorHandling(
      () => deleteDocumentMutation.mutateAsync(id),
      {
        successMessage: "Document deleted successfully",
        errorMessage: "Failed to delete document. Please try again.",
        onError: () => {
          setError("Failed to delete document. Please try again.");
        }
      }
    ).then(() => {
      navigate('/documents');
    });
  };

  return {
    // Data
    documents,
    document,
    
    // Loading states
    isLoadingDocuments,
    isLoadingDocument,
    isCreating: createDocumentMutation.isPending,
    isUpdating: updateDocumentMutation.isPending,
    isDeleting: deleteDocumentMutation.isPending,
    
    // Error states
    isDocumentsError,
    isDocumentError,
    error,
    
    // Actions
    createDocument,
    updateDocument,
    deleteDocument,
    refetchDocuments,
    refetchDocument
  };
};