import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Conversation APIs
export const createConversation = async (userId: string) => {
  try {
    const response = await apiClient.post('/conversations/', {
      user_id: userId,
    });
    return response.data; // Assuming the API returns the conversation object
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const getConversation = async (conversationId: string) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

// Message APIs
export const sendMessage = async (
  conversationId: string,
  sender: string,
  content: string,
) => {
  try {
    const response = await apiClient.post(
      `/conversations/${conversationId}/messages`,
      {
        sender,
        content,
      },
    );
    return response.data; // Assuming the API returns the created message
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (
  conversationId: string,
  page: number = 1,
  size: number = 10,
) => {
  try {
    const response = await apiClient.get(
      `/conversations/${conversationId}/messages?page=${page}&size=${size}`,
    );
    return response.data; // Assuming the API returns a list of messages
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const updateMessage = async (
  conversationId: string,
  messageId: string,
  content: string,
) => {
  try {
    const response = await apiClient.put(
      `/conversations/${conversationId}/messages/${messageId}`,
      { content },
    );
    return response.data; // Assuming the API returns the updated message
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};

export const deleteMessage = async (
  conversationId: string,
  messageId: string,
) => {
  try {
    const response = await apiClient.delete(
      `/conversations/${conversationId}/messages/${messageId}`,
    );
    return response.data; // Assuming the API returns a success status
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};
