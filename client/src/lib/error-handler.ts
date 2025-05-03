import { toast } from 'sonner';

/**
 * Generic error handler for async operations
 * Handles try/catch pattern and toast notifications
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  {
    errorMessage = 'An error occurred',
    successMessage,
    onError,
  }: {
    errorMessage?: string;
    successMessage?: string;
    onError?: (error: unknown) => void;
  } = {}
): Promise<T | undefined> {
  try {
    const result = await operation();
    
    if (successMessage) {
      toast.success(successMessage);
    }
    
    return result;
  } catch (error) {
    // Show error toast notification
    toast.error(errorMessage);
    
    // Log the error for debugging
    console.error(errorMessage, error);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error);
    }
    
    // Re-throw the error if needed for further handling
    throw error;
  }
}