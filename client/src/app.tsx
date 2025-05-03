import { RouterProvider } from 'react-router';
import router from './router';
import { ThemeProvider } from './components/theme/theme-provider';
import QueryProvider from './services/queries/query-provider';
import { Toaster } from './components/ui/sonner';

export default function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <QueryProvider>
                <RouterProvider router={router} />
                <Toaster />
            </QueryProvider>
        </ThemeProvider>
    )
}
