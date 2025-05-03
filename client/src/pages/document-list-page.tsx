import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useDocumentManager } from "@/services/hooks/use-document-manager";

export default function DocumentListPage() {
    const {
        documents,
        isLoadingDocuments,
        createDocument,
        isCreating
    } = useDocumentManager();

    const handleCreateNewDocument = async () => {
        await createDocument({
            title: "New Document",
            content: "Start writing..."
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Documents</h1>
                <Button onClick={handleCreateNewDocument} disabled={isCreating}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Document
                </Button>
            </div>

            {isLoadingDocuments ? (
                <div className="flex justify-center py-8">
                    <div className="animate-pulse">Loading documents...</div>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map(doc => (
                            <Link
                                key={doc.id}
                                to={`/documents/${doc.id}`}
                                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                        {doc.content}
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                        Updated {new Date(doc.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {documents.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">No documents yet</p>
                            <Button onClick={handleCreateNewDocument} disabled={isCreating}>
                                Create your first document
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}