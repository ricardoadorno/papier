import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useDocumentManager } from '@/services/hooks/use-document-manager';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  const { documents, createDocument, isCreating } = useDocumentManager()

  const handleCreateNewDocument = async () => {
    await createDocument({
      title: "New Document",
      content: "Start writing..."
    });
  };

  return (
    <div className="w-64 border-r h-full flex flex-col bg-background">
      <div className="p-4 flex items-center justify-between">
        <h1 className="font-semibold text-lg">Papier</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      <div className="p-2">
        <Button
          onClick={handleCreateNewDocument}
          disabled={isCreating}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isExpanded && (
            <div className="space-y-1">
              {documents.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/documents/${doc.id}`}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span className="truncate">{doc.title}</span>
                </Link>
              ))}
              {documents.length === 0 && (
                <div className="text-sm text-muted-foreground p-2">
                  No documents yet. Create your first one!
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}