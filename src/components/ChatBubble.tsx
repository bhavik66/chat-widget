import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
  position?: 'left' | 'right'; // Added prop for left or right position
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  isOpen,
  onClick,
  position,
}) => {
  return (
    <Button
      className={`fixed bottom-4 ${position === 'left' ? 'left-4' : 'right-4'} rounded-full w-14 h-14 shadow-lg`}
      onClick={onClick}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
      <span className="sr-only">{isOpen ? 'Close chat' : 'Open chat'}</span>
    </Button>
  );
};

export default ChatBubble;
