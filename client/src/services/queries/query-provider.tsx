import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
    children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
    // Create a client instance that persists across component render cycles
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Default query options
                staleTime: 5 * 60 * 1000, // 5 minutes
                refetchOnWindowFocus: true,
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}