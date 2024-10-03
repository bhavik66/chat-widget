import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows = 10, rows = 1, value, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = 'auto';
      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      const paddingBottom = parseFloat(computedStyle.paddingBottom);
      const borderTop = parseFloat(computedStyle.borderTopWidth);
      const borderBottom = parseFloat(computedStyle.borderBottomWidth);

      const minHeight =
        lineHeight * rows +
        paddingTop +
        paddingBottom +
        borderTop +
        borderBottom;
      const maxHeight =
        lineHeight * maxRows +
        paddingTop +
        paddingBottom +
        borderTop +
        borderBottom;

      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight,
      );
      textarea.style.height = `${newHeight}px`;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxRows, rows, value]);

    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      adjustHeight(); // Initial adjustment
      textarea.addEventListener('input', adjustHeight);

      return () => textarea.removeEventListener('input', adjustHeight);
    }, [adjustHeight]);

    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none overflow-hidden', // Prevent manual resizing and hide scrollbar
          className,
        )}
        ref={(node) => {
          textareaRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        rows={rows}
        value={value}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
