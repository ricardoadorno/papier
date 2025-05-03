import {
    createBrowserRouter,
} from "react-router";
import AboutPage from './pages/about-page';
import HomePage from './pages/home-page';
import DocumentListPage from './pages/document-list-page';
import DocumentDetailPage from './pages/document-detail-page';
import RootLayout from './components/layout/root-layout';

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'about',
                element: <AboutPage />
            },
            {
                path: 'documents',
                element: <DocumentListPage />
            },
            {
                path: 'documents/:id',
                element: <DocumentDetailPage />
            }
        ]
    }
]);

export default router;

