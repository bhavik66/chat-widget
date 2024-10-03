import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createConversation, getConversation } from '@/services/apiService';

interface Conversation {
  id: string;
}

interface UseConversationReturn {
  conversationId: string | null;
  isLoading: boolean;
  error: string | null;
  initializeConversation: () => Promise<void>;
}

const useConversation = (): UseConversationReturn => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userIdRef = useRef<string>('');

  // Function to check if a conversation exists and initialize it
  const initializeConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Retrieve or generate userId
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }
      userIdRef.current = userId;

      // Retrieve or create conversationId
      const storedConversationId = localStorage.getItem('conversationId');
      let conversation: Conversation | null = null;

      if (storedConversationId) {
        try {
          conversation = await getConversation(storedConversationId);
          if (!conversation) {
            // If no conversation found, create a new one
            conversation = await createConversation(userId);
            if (conversation) {
              localStorage.setItem('conversationId', conversation.id);
            }
          }
        } catch (apiError) {
          console.error('Error fetching conversation:', apiError);
          // Fallback to creating a new conversation
          conversation = await createConversation(userId);
          if (conversation) {
            localStorage.setItem('conversationId', conversation.id);
          }
        }
      } else {
        // No conversationId stored, create a new conversation
        conversation = await createConversation(userId);
        if (conversation) {
          localStorage.setItem('conversationId', conversation.id);
        }
      }
      if (conversation) {
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
  }, []); // Run once on mount

  return {
    conversationId,
    isLoading,
    error,
    initializeConversation,
  };
};

export default useConversation;
