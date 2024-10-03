import { useState } from 'react';
import ChatBubble from './ChatBubble';

import ChatWindow from './ChatWindow';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bubblePosition, setBubblePosition] = useState<'left' | 'right'>(
    'right',
  ); // State for position

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      <ChatBubble
        isOpen={isOpen}
        onClick={toggleChat}
        position={bubblePosition}
      />
      {isOpen && (
        <ChatWindow
          onCloseWindow={toggleChat}
          position={bubblePosition}
          onChangePosition={(position) => setBubblePosition(position)}
        />
      )}
    </>
  );
};

export default ChatWidget;
