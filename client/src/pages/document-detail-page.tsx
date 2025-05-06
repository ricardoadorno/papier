import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft, Trash } from "lucide-react";
import { useDocumentManager } from "@/services/hooks/use-document-manager";
import { MarkdownEditor } from "@/components/document/markdown-editor";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DocumentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Use our custom hook to manage document operations
    const {
        document,
        isLoadingDocument,
        isUpdating,
        isDeleting,
        updateDocument,
        deleteDocument
    } = useDocumentManager(id);

    // Update local state when document loads or changes
    useEffect(() => {
        if (document) {
            setTitle(document.title);
            setContent(document.content);
        }
    }, [document]);

    const handleSave = async () => {
        await updateDocument({ title, content });
        setIsEditing(false);
        // No need for try/catch as errors are handled in the hook with toast
    };

    const handleDelete = async () => {
        if (!id) return;
        await deleteDocument(id);
        // No need for try/catch as errors are handled in the hook with toast
    };

    // Show loading state
    if (isLoadingDocument) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-pulse">Loading document...</div>
            </div>
        );
    }

    // Show error or not found state
    if (!document && !isLoadingDocument) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold mb-4">Document not found</h1>
                <p className="text-muted-foreground mb-6">The document you're looking for doesn't exist or was deleted.</p>
                <Button asChild>
                    <Link to="/documents">Go to Documents</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="border-b">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link to="/documents">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>

                        {isEditing ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-xl font-semibold border-none focus:outline-none focus:ring-0 p-0 bg-transparent"
                                placeholder="Document Title"
                            />
                        ) : (
                            <h1 className="text-xl font-semibold">{title}</h1>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <Button onClick={handleSave} disabled={isUpdating}>
                                <Save className="h-4 w-4 mr-2" />
                                {isUpdating ? "Saving..." : "Save"}
                            </Button>
                        ) : (
                            <>
                                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={isDeleting}
                                        >
                                            <Trash className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the document
                                                "{title}" and remove it from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {isDeleting ? "Deleting..." : "Delete"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button onClick={() => setIsEditing(true)}>
                                    Edit
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {isEditing ? (
                    <MarkdownEditor
                        content={content}
                        onChange={setContent}
                        className="h-full"
                    />
                ) : (
                    <div className="prose dark:prose-invert max-w-none">
                        <MarkdownEditor
                            content={content}
                            onChange={() => { }} // Read-only in view mode
                            className="h-full border-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}