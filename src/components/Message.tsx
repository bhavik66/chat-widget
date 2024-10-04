import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { MessageType } from '@/types/chat';

interface MessageProps extends MessageType {
  isTyping?: boolean;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 p-1">
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-400"></span>
    </div>
  );
};

const Message: React.FC<MessageProps> = ({
  id,
  sender,
  content,
  avatar,
  actions,
  isTyping,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isAI = sender === 'ai';

  const handleEdit = () => {
    onEdit(id, content);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div
      className={`flex items-start space-x-2 my-2 ${isAI ? '' : 'justify-end'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isAI && (
        <Avatar className="w-10 h-10">
          <AvatarImage alt="AI" src={avatar} />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div className={`space-y-2 ${isAI ? '' : 'flex flex-col items-end'}`}>
        <div className="flex flex-row space-x-2">
          {!isTyping && !isAI && (
            <div className="flex space-x-2 mt-1">
              {isHovered ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                    className="h-6 w-6"
                    data-testid="button-edit"
                  >
                    <Edit className="h-4 w-4 text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="h-6 w-6"
                    data-testid="button-delete"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </>
              ) : null}
            </div>
          )}
          <div
            className={`rounded-2xl p-2 ${
              isAI
                ? 'bg-gray-100 rounded-tl-none'
                : 'bg-purple-500 text-white rounded-tr-none'
            }`}
          >
            {isTyping ? (
              <TypingIndicator />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            )}
          </div>
        </div>
        {actions && Object.keys(actions).length > 0 && !isTyping && (
          <div className="flex flex-col items-start space-y-2">
            {Object.values(actions).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-purple-500 border-purple-500 rounded-full"
              >
                {action}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
