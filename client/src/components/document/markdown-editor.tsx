import { useState, useCallback } from 'react';
import { EditorToolbar } from './editor-toolbar';
import { MarkdownRenderer } from './markdown-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MarkdownEditorProps {
    content: string;
    onChange: (content: string) => void;
    className?: string;
}

export function MarkdownEditor({ content, onChange, className = '' }: MarkdownEditorProps) {
    const [editorRef, setEditorRef] = useState<HTMLTextAreaElement | null>(null);

    const handleToolbarAction = useCallback((actionType: string, payload?: any) => {
        if (!editorRef) return;

        const selStart = editorRef.selectionStart;
        const selEnd = editorRef.selectionEnd;
        const textBefore = content.substring(0, selStart);
        const selectedText = content.substring(selStart, selEnd);
        const textAfter = content.substring(selEnd);

        let newContent = content;
        let newCursorPos = selEnd;

        switch (actionType) {
            case 'bold':
                newContent = `${textBefore}**${selectedText || 'bold text'}**${textAfter}`;
                newCursorPos = selStart + 2 + (selectedText ? selectedText.length : 9);
                break;
            case 'italic':
                newContent = `${textBefore}_${selectedText || 'italic text'}_${textAfter}`;
                newCursorPos = selStart + 1 + (selectedText ? selectedText.length : 11);
                break;
            case 'heading':
                const level = payload as number;
                const prefix = '#'.repeat(level) + ' ';
                const lineStart = content.lastIndexOf('\n', selStart - 1) + 1 || 0;
                const existingPrefix = /^(#{1,6})\s/.exec(content.substring(lineStart, selStart));

                if (existingPrefix) {
                    const prefixLength = existingPrefix[0].length;
                    const textBeforeHeader = content.substring(0, lineStart);
                    const lineContent = content.substring(lineStart + prefixLength, textAfter.includes('\n') ? content.indexOf('\n', selStart) : content.length);

                    newContent = `${textBeforeHeader}${prefix}${lineContent}${textAfter}`;
                    newCursorPos = lineStart + prefix.length + (selEnd - selStart - prefixLength);
                } else {
                    const lineContent = content.substring(lineStart, textAfter.includes('\n') ? content.indexOf('\n', selStart) : content.length);
                    const textBeforeHeader = content.substring(0, lineStart);

                    newContent = `${textBeforeHeader}${prefix}${lineContent}${textAfter}`;
                    newCursorPos = lineStart + prefix.length + (selEnd - selStart);
                }
                break;
            case 'list':
                const listStart = content.lastIndexOf('\n', selStart - 1) + 1 || 0;
                const line = content.substring(listStart, content.indexOf('\n', selStart) >= 0 ? content.indexOf('\n', selStart) : content.length);

                if (line.startsWith('- ')) {
                    // Remove list formatting
                    newContent = content.substring(0, listStart) + line.substring(2) + textAfter;
                    newCursorPos = selStart - 2;
                } else {
                    // Add list formatting
                    newContent = content.substring(0, listStart) + '- ' + line + textAfter;
                    newCursorPos = selStart + 2;
                }
                break;
            case 'link':
                newContent = `${textBefore}[${selectedText || 'link text'}](url)${textAfter}`;
                newCursorPos = selStart + 1 + (selectedText ? selectedText.length : 9) + 2;
                break;
            case 'code':
                if (selectedText.includes('\n')) {
                    // Code block for multi-line
                    newContent = `${textBefore}\`\`\`\n${selectedText || 'code block'}\n\`\`\`${textAfter}`;
                    newCursorPos = selStart + 4 + (selectedText ? selectedText.length : 10) + 4;
                } else {
                    // Inline code for single line
                    newContent = `${textBefore}\`${selectedText || 'code'}\`${textAfter}`;
                    newCursorPos = selStart + 1 + (selectedText ? selectedText.length : 4) + 1;
                }
                break;
            default:
                return;
        }

        onChange(newContent);

        // Ensure focus returns to the editor with proper cursor positioning
        setTimeout(() => {
            if (editorRef) {
                editorRef.focus();
                editorRef.selectionStart = newCursorPos;
                editorRef.selectionEnd = newCursorPos;
            }
        }, 0);
    }, [content, editorRef, onChange]);

    return (
        <div className={`flex flex-col border rounded-md ${className}`}>
            <EditorToolbar onActionClick={handleToolbarAction} />

            <div className="grid grid-cols-2 h-full min-h-[300px]">
                <div className="border-r p-2">
                    <textarea
                        ref={setEditorRef}
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full min-h-[300px] resize-none focus:outline-none"
                        placeholder="Write your markdown here..."
                    />
                </div>

                <ScrollArea className="p-2">
                    <MarkdownRenderer content={content} />
                </ScrollArea>
            </div>
        </div>
    );
}