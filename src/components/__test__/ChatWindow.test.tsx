// src/components/__test__/ChatWindow.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatWindow from '@/components/ChatWindow';
import useConversation from '@/hooks/useConversation';
import useMessages from '@/hooks/useMessages';
import '@testing-library/jest-dom'; // for better assertion methods

// Mock the custom hooks and services
jest.mock('@/hooks/useConversation');
jest.mock('@/hooks/useMessages');
jest.mock('@/services/wsService');

describe('ChatWindow Component', () => {
  const onCloseWindow = jest.fn();
  const onChangePosition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock implementations
    (useConversation as jest.Mock).mockReturnValue({
      conversationId: 'test-conversation-id',
      isLoading: false,
      error: null,
      initializeConversation: jest.fn(),
    });

    (useMessages as jest.Mock).mockReturnValue({
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
    });
  });

  it('renders ChatWindow with header, input, and footer', () => {
    render(
      <ChatWindow
        onCloseWindow={onCloseWindow}
        position="right"
        onChangePosition={onChangePosition}
      />,
    );

    // Check for header buttons
    expect(screen.getByTestId('button-fullscreen')).toBeInTheDocument();
    expect(screen.getByTestId('button-change-position')).toBeInTheDocument();
    expect(screen.getByTestId('button-close')).toBeInTheDocument();

    // // Check for input area
    expect(screen.getByPlaceholderText('Your question')).toBeInTheDocument();

    // // Check for footer elements
    expect(screen.getByText('Context')).toBeInTheDocument();
    expect(screen.getByText('Onboarding')).toBeInTheDocument(); // Default Select value
    expect(screen.getByTestId('button-send')).toBeInTheDocument();
    expect(screen.getByTestId('button-settings')).toBeInTheDocument();
  });

  it('allows the user to send a new message', async () => {
    const sendUserMessageMock = jest.fn();
    (useMessages as jest.Mock).mockReturnValue({
      messages: [],
      isLoading: false,
      error: null,
      hasMore: false,
      total: 0,
      page: 1,
      size: 15,
      sendUserMessage: sendUserMessageMock,
      editMessage: jest.fn(),
      removeMessage: jest.fn(),
      loadMoreMessages: jest.fn(),
      isAiTyping: false,
    });

    render(
      <ChatWindow
        onCloseWindow={onCloseWindow}
        position="right"
        onChangePosition={onChangePosition}
      />,
    );

    const input = screen.getByPlaceholderText('Your question');
    const sendButton = screen.getByTestId('button-send');

    // Simulate typing
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    expect(input).toHaveValue('Hello, world!');

    // Simulate clicking send
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(sendUserMessageMock).toHaveBeenCalledWith('Hello, world!');
      expect(input).toHaveValue(''); // Input should be cleared after sending
    });
  });

  it('allows the user to edit an existing message', async () => {
    const editMessageMock = jest.fn();
    (useMessages as jest.Mock).mockReturnValue({
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          content: 'Original Message',
          avatar: '',
          actions: {},
        },
      ],
      isLoading: false,
      error: null,
      hasMore: false,
      total: 1,
      page: 1,
      size: 15,
      sendUserMessage: jest.fn(),
      editMessage: editMessageMock,
      removeMessage: jest.fn(),
      loadMoreMessages: jest.fn(),
      isAiTyping: false,
    });

    render(
      <ChatWindow
        onCloseWindow={onCloseWindow}
        position="right"
        onChangePosition={onChangePosition}
      />,
    );

    // Wait for the message to appear
    const messageContent = await screen.findByText('Original Message');
    expect(messageContent).toBeInTheDocument();

    // Locate the message container (you may need to adjust the selector based on your DOM structure)
    const messageContainer = messageContent.closest('div.flex'); // Example selector
    expect(messageContainer).toBeInTheDocument();

    if (messageContainer) {
      // Simulate hover over the message container
      fireEvent.mouseEnter(messageContainer);
    }

    // Now, the edit button should be visible
    const editButton = await screen.findByTestId('button-edit');
    expect(editButton).toBeInTheDocument();

    // Click the edit button
    fireEvent.click(editButton);

    // The input area should now have the message content
    const inputArea = screen.getByPlaceholderText('Your question');
    expect(inputArea).toHaveValue('Original Message');

    // Change the message
    fireEvent.change(inputArea, { target: { value: 'Edited Message' } });

    // Click the send button
    const sendButton = screen.getByTestId('button-send');
    fireEvent.click(sendButton);

    // Assert that editMessage was called with correct parameters
    await waitFor(() => {
      expect(editMessageMock).toHaveBeenCalledWith('msg-1', 'Edited Message');
      expect(inputArea).toHaveValue(''); // Input should be cleared after editing
    });
  });

  it('allows the user to delete a message', async () => {
    const removeMessageMock = jest.fn();
    const messages = [
      {
        id: 'msg-1',
        sender: 'user',
        content: 'Message to delete',
        avatar: '',
        actions: {},
      },
    ];

    (useMessages as jest.Mock).mockReturnValue({
      messages,
      isLoading: false,
      error: null,
      hasMore: false,
      total: 1,
      page: 1,
      size: 15,
      sendUserMessage: jest.fn(),
      editMessage: jest.fn(),
      removeMessage: removeMessageMock,
      loadMoreMessages: jest.fn(),
      isAiTyping: false,
    });

    render(
      <ChatWindow
        onCloseWindow={onCloseWindow}
        position="right"
        onChangePosition={onChangePosition}
      />,
    );

    // Wait for the message to appear
    const messageContent = await screen.findByText('Message to delete');
    expect(messageContent).toBeInTheDocument();

    // Locate the message container (you may need to adjust the selector based on your DOM structure)
    const messageContainer = messageContent.closest('div.flex'); // Example selector
    expect(messageContainer).toBeInTheDocument();

    if (messageContainer) {
      // Simulate hover over the message container
      fireEvent.mouseEnter(messageContainer);
    }

    // Now, the edit button should be visible
    const deleteButton = await screen.findByTestId('button-delete');
    expect(deleteButton).toBeInTheDocument();

    // Simulate clicking the delete button
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(removeMessageMock).toHaveBeenCalledWith('msg-1');
    });
  });

  it('toggles fullscreen mode when fullscreen button is clicked', () => {
    render(
      <ChatWindow
        onCloseWindow={onCloseWindow}
        position="right"
        onChangePosition={onChangePosition}
      />,
    );

    const fullscreenButton = screen.getByTestId('button-fullscreen');

    // Initially, not fullscreen
    expect(fullscreenButton).toBeInTheDocument();

    // Click to enter fullscreen
    fireEvent.click(fullscreenButton);

    // Now, the button should offer to exit fullscreen
    expect(screen.getByTestId('button-minimize')).toBeInTheDocument();

    // Click to exit fullscreen
    fireEvent.click(screen.getByTestId('button-minimize'));

    // The button should offer to enter fullscreen again
    expect(screen.getByTestId('button-maximize')).toBeInTheDocument();
  });

  it('changes chat window position when position button is clicked', () => {
    render(
      <ChatWindow
        onCloseWindow={onCloseWindow}
        position="right"
        onChangePosition={onChangePosition}
      />,
    );

    const positionButton = screen.getByTestId('button-change-position');

    // Click to change position from right to left
    fireEvent.click(positionButton);

    expect(onChangePosition).toHaveBeenCalledWith('left');
  });
});
