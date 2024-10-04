import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
  position?: 'left' | 'right';
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  isOpen,
  onClick,
  position = 'right',
}) => {
  return (
    <Button
      className={`
        fixed bottom-4 ${position === 'left' ? 'left-4' : 'right-4'}
        w-14 h-14 rounded-full shadow-lg
        bg-gradient-to-r from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        transition-all duration-300 ease-in-out
        transform hover:scale-110
        flex items-center justify-center
      `}
      onClick={onClick}
      data-testid="button-chat-bubble"
    >
      <div className="relative w-6 h-6">
        <MessageCircle
          className={`absolute inset-0 h-6 w-6 text-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
        />
        <X
          className={`absolute inset-0 h-6 w-6 text-white transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <span className="sr-only">{isOpen ? 'Close chat' : 'Open chat'}</span>
    </Button>
  );
};

export default ChatBubble;
