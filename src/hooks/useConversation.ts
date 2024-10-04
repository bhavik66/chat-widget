import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createConversation, getConversation } from '@/services/apiService';

// Interface representing a conversation
interface Conversation {
  id: string; // Unique conversation ID
}

// Return type for the custom hook
interface UseConversationReturn {
  conversationId: string | null; // Current conversation ID
  isLoading: boolean; // Indicates if the conversation is being initialized
  error: string | null; // Error message if any issues occur
  initializeConversation: () => Promise<void>; // Initializes the conversation
}

/**
 * Custom hook to manage conversation initialization.
 * It checks if a conversation exists in local storage, otherwise creates a new one.
 */
const useConversation = (): UseConversationReturn => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string>(''); // Holds the user ID persistently

  /**
   * Initializes the conversation by checking local storage for existing data.
   * If no conversation or user ID exists, a new one is generated and saved.
   */
  const initializeConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Retrieve or create userId
      const userId = localStorage.getItem('userId') || uuidv4();
      localStorage.setItem('userId', userId);
      userIdRef.current = userId;

      // Retrieve or create conversationId
      const conversationId = localStorage.getItem('conversationId');
      let conversation: Conversation | null = null;

      if (conversationId) {
        conversation = await getConversation(conversationId);
        if (!conversation) conversation = await createConversation(userId);
      } else {
        conversation = await createConversation(userId);
      }

      if (conversation) {
        localStorage.setItem('conversationId', conversation.id);
        setConversationId(conversation.id);
      }
    } catch (err) {
      console.error('Error initializing conversation:', err);
      setError('Failed to initialize conversation.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeConversation();
  }, []); // Runs once when the component mounts

  return {
    conversationId,
    isLoading,
    error,
    initializeConversation,
  };
};

export default useConversation;
