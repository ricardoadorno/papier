import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    Link,
    Code
} from 'lucide-react';

interface EditorToolbarProps {
    onActionClick: (action: string, payload?: any) => void;
}

export function EditorToolbar({ onActionClick }: EditorToolbarProps) {
    return (
        <div className="flex items-center p-2 border-b gap-1 bg-muted/30 rounded-t-md">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('bold')}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('italic')}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </Button>

            <div className="border-r h-6 mx-1" />

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('heading', 1)}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('heading', 2)}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('heading', 3)}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </Button>

            <div className="border-r h-6 mx-1" />

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('list')}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('link')}
                title="Link"
            >
                <Link className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onActionClick('code')}
                title="Code"
            >
                <Code className="h-4 w-4" />
            </Button>
        </div>
    );
}