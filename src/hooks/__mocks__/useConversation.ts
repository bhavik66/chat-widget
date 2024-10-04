const useConversation = jest.fn(() => ({
  conversationId: 'test-conversation-id',
  isLoading: false,
  error: null,
  initializeConversation: jest.fn(),
}));

export default useConversation;
