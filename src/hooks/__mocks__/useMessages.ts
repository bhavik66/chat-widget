const useMessages = jest.fn(() => ({
  messages: [],
  isLoading: false,
  error: null,
  hasMore: false,
  total: 0,
  page: 1,
  size: 15,
  sendUserMessage: jest.fn(),
  editMessage: jest.fn(),
  removeMessage: jest.fn(),
  loadMoreMessages: jest.fn(),
  isAiTyping: false,
}));

export default useMessages;
