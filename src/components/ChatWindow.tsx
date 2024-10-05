import React, { useState, useCallback, useEffect } from 'react';
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
import {
  Maximize2,
  Minimize2,
  X,
  Settings,
  SendHorizontal, // Fixed typo from SendHorizonal
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { Textarea } from './ui/textarea';

// Import custom hooks
import useConversation from '@/hooks/useConversation';
import useMessages from '@/hooks/useMessages';
import InfiniteScroll from 'react-infinite-scroll-component';
import Message from './Message';

interface ChatWindowProps {
  onCloseWindow: () => void;
  position?: 'left' | 'right'; // Added prop for position
  onChangePosition: (position: 'left' | 'right') => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  onCloseWindow,
  position = 'right',
  onChangePosition,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState('');

  // Use custom hooks
  const { conversationId, error: conversationError } = useConversation();

  const {
    messages,
    error: messagesError,
    sendUserMessage,
    editMessage,
    removeMessage,
    loadMoreMessages,
    hasMore,
    isAiTyping,
  } = useMessages(conversationId);

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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      if (editMessageId) {
        // Update the message via the useMessages hook
        await editMessage(editMessageId, newMessage);
      } else {
        // Send the user message
        await sendUserMessage(newMessage);
      }
      setEditMessageId('');
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      // Handle error if necessary
    }
  };

  const handleEditMessage = (id: string, currentContent: string) => {
    setEditMessageId(id);
    setNewMessage(currentContent);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!conversationId) return;

    try {
      await removeMessage(id);
    } catch (err) {
      console.error('Error deleting message:', err);
      // Handle error if necessary
    }
  };

  return (
    <Card
      className={`fixed shadow-xl flex flex-col animate-slide-up ${
        isFullscreen
          ? 'inset-0 z-50 rounded-none'
          : `bottom-20 ${position === 'right' ? 'right-4' : 'left-4'} w-[calc(100%-2rem)] sm:w-[400px] h-[720px] max-h-[calc(100vh-6rem)] rounded-2xl`
      }`}
    >
      {/* Header */}
      <div
        className={`flex ${isMobileScreen() ? 'justify-end' : 'justify-between'} items-center p-3 pb-0`}
      >
        <div
          className={`flex items-center space-x-2 ${isMobileScreen() && 'hidden'}`}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            data-testid="button-fullscreen"
          >
            {isFullscreen ? (
              <Minimize2
                className="h-5 w-5 text-gray-600"
                data-testid="button-minimize"
              />
            ) : (
              <Maximize2
                className="h-5 w-5 text-gray-600"
                data-testid="button-maximize"
              />
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
            data-testid="button-change-position"
          >
            {position === 'right' ? (
              <PanelLeft className="h-5 w-5 text-gray-600" />
            ) : (
              <PanelRight className="h-5 w-5 text-gray-600" />
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCloseWindow}
          data-testid="button-close"
        >
          <X className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Close chat</span>
        </Button>
      </div>
      <div className="relative">
        <div
          className="absolute top-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.4) 65%, rgba(255,255,255,0) 100%)',
          }}
        />
      </div>

      {conversationError && (
        <div className="text-red-500 text-center mt-12">
          {conversationError}
        </div>
      )}
      {messagesError && (
        <div className="text-red-500 text-center mt-12">{messagesError}</div>
      )}

      <div
        id="scrollableDiv"
        className="w-full overflow-y-scroll flex flex-col-reverse m-auto p-3 custom-scrollbar"
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMoreMessages}
          hasMore={hasMore}
          endMessage={
            <div className="space-y-2 mb-10">
              <div className="flex justify-center">
                <Avatar className="w-16 h-16 bg-purple-500 border-2 border-solid">
                  <AvatarImage alt="Ava" src="/img/ava.webp" />
                </Avatar>
              </div>
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold">Hey👋, I'm Ava</h2>
                <p className="text-sm text-gray-500">
                  Ask me anything or pick a place to start
                </p>
              </div>
            </div>
          }
          loader={<p className="text-center m-5">Loading...</p>}
          scrollableTarget="scrollableDiv"
          inverse={true}
          className="flex flex-col-reverse overflow-visible"
        >
          {isAiTyping && (
            <div>
              <Message
                id={'ai-typing'}
                sender={'ai'}
                content={''}
                actions={{}}
                onEdit={() => {}}
                onDelete={() => {}}
                isTyping
              />
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id}>
              <Message
                id={msg.id}
                sender={msg.sender}
                content={msg.content}
                actions={msg.actions}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>

      {/* Input area */}
      <div className="border-t px-4 pt-4 flex items-center space-x-2">
        <Avatar className="w-8 h-8">
          <AvatarImage alt="User" src="/placeholder.svg?height=24&width=24" />
          <AvatarFallback>B</AvatarFallback>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            data-testid="button-settings"
          >
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            data-testid="button-send"
          >
            <SendHorizontal className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatWindow;
