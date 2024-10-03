import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Maximize2,
  Minimize2,
  X,
  Settings,
  SendHorizonal,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import Message from './Message';
import { Textarea } from './ui/textarea';

interface ChatWindowProps {
  onCloseWindow: () => void;
  position?: 'left' | 'right'; // Added prop for position
  onChangePosition: (position: 'left' | 'right') => void;
}

interface MessageType {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  avatar: string;
  actions?: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  onCloseWindow,
  position = 'right',
  onChangePosition,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      sender: 'ai',
      content:
        'Hi Jane,\nAmazing how Mosey is simplifying state compliance for businesses across the board!',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: '2',
      sender: 'user',
      content: 'Hi, thanks for connecting!',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: '3',
      sender: 'ai',
      content:
        'Hi Jane,\nAmazing how Mosey is simplifying state compliance for businesses across the board!',
      avatar: '/placeholder.svg?height=32&width=32',
      actions: ['Create Report this month', 'Call Lead'],
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Function to check if the screen is mobile-sized
  const isMobileScreen = () => window.innerWidth <= 768; // You can adjust this breakpoint

  // Set initial fullscreen state based on screen size
  useEffect(() => {
    setIsFullscreen(isMobileScreen());
  }, []);

  // Update fullscreen state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsFullscreen(isMobileScreen());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    if (editMessageId) {
      setMessages(
        messages.map((msg) =>
          msg.id === editMessageId ? { ...msg, content: newMessage } : msg,
        ),
      );
    } else {
      const userMessage: MessageType = {
        id: Date.now().toString(),
        sender: 'user',
        content: newMessage,
        avatar: '/placeholder.svg?height=32&width=32',
      };
      setMessages([...messages, userMessage]);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: generateAIResponse(newMessage),
          avatar: '/placeholder.svg?height=32&width=32',
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }, 1000);
    }
    setEditMessageId('');
    setNewMessage('');
  };

  const generateAIResponse = (userInput: string) => {
    // Placeholder AI response logic
    return `You said: "${userInput}". Here's an AI-generated response!`;
  };

  const handleEditMessage = (id: string, newContent: string) => {
    setEditMessageId(id);
    setNewMessage(newContent);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  return (
    <Card
      className={`
        fixed shadow-xl flex flex-col animate-slide-up
        ${
          isFullscreen
            ? 'inset-0 z-50 rounded-none'
            : `bottom-20 ${position === 'right' ? 'right-4' : 'left-4'} w-[calc(100%-2rem)] sm:w-[400px] h-[720px] max-h-[calc(100vh-6rem)] rounded-2xl`
        }
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 text-gray-600" />
            ) : (
              <Maximize2 className="h-5 w-5 text-gray-600" />
            )}
            <span className="sr-only">
              {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onChangePosition(position === 'right' ? 'left' : 'right')
            }
          >
            {position === 'right' ? (
              <PanelLeft className="h-5 w-5 text-gray-600" />
            ) : (
              <PanelRight className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={onCloseWindow}>
          <X className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>

      {/* Chat area */}
      <ScrollArea className="flex-grow p-4 pt-0">
        <div className="space-y-2 mb-10">
          <div className="flex justify-center">
            <Avatar className="w-16 h-16">
              <AvatarImage
                alt="Ava"
                src="/placeholder.svg?height=64&width=64"
              />
              <AvatarFallback>Ava</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-xl font-semibold">Hey👋, I'm Ava</h2>
            <p className="text-sm text-gray-500">
              Ask me anything or pick a place to start
            </p>
          </div>
        </div>
        {messages.map((msg) => (
          <Message
            key={msg.id}
            id={msg.id}
            sender={msg.sender}
            content={msg.content}
            avatar={msg.avatar}
            actions={msg.actions}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input area */}
      <div className="border-t px-4 pt-4 flex items-center space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage alt="User" src="/placeholder.svg?height=24&width=24" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-grow relative">
          <Textarea
            placeholder="Your question"
            className="py-1 px-2 border-none resize-none shadow-none focus-visible:ring-0"
            rows={1}
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">Context</span>
          <Select defaultValue="onboarding">
            <SelectTrigger className="w-[120px] bg-gray-100 h-8 px-1.5">
              <SelectValue placeholder="Select context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleSendMessage}
            disabled={!newMessage}
          >
            <SendHorizonal className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
