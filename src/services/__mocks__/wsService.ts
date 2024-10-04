export const webSocketService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  joinConversation: jest.fn(),
  leaveConversation: jest.fn(),
  sendMessage: jest.fn(),
  onTyping: jest.fn(),
  onIncomingMessage: jest.fn(),
  emitTyping: jest.fn(),
};
