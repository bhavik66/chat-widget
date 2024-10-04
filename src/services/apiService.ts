import axios from 'axios';

// Base URL for the API, retrieved from environment variables.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios client with default settings, including the base URL and JSON headers.
const apiClient = axios.create({
  baseURL: API_BASE_URL, // Base URL for API requests
  headers: {
    'Content-Type': 'application/json', // Set content type to JSON for all requests
  },
});

// Conversation APIs

/**
 * Creates a new conversation for a given user.
 *
 * @param {string} userId - The ID of the user starting the conversation.
 * @returns {Promise<Object>} - Returns the created conversation object.
 * @throws Will throw an error if the request fails.
 */
export const createConversation = async (userId: string) => {
  try {
    const response = await apiClient.post('/conversations/', {
      user_id: userId, // Pass user_id in request body
    });
    return response.data; // Return the created conversation object
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error; // Propagate error to the caller
  }
};

/**
 * Fetches an existing conversation by its ID.
 *
 * @param {string} conversationId - The ID of the conversation to fetch.
 * @returns {Promise<Object>} - Returns the fetched conversation object.
 * @throws Will throw an error if the request fails.
 */
export const getConversation = async (conversationId: string) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data; // Return the fetched conversation object
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error; // Propagate error to the caller
  }
};

// Message APIs

/**
 * Sends a message within a specific conversation.
 *
 * @param {string} conversationId - The ID of the conversation to which the message belongs.
 * @param {string} sender - The sender of the message (either 'user' or 'ai').
 * @param {string} content - The content of the message.
 * @returns {Promise<Object>} - Returns the created message object.
 * @throws Will throw an error if the request fails.
 */
export const sendMessage = async (
  conversationId: string,
  sender: string,
  content: string,
) => {
  try {
    const response = await apiClient.post(
      `/conversations/${conversationId}/messages`,
      {
        sender, // The sender of the message (e.g., 'user' or 'ai')
        content, // The actual message content
      },
    );
    return response.data; // Return the created message object
  } catch (error) {
    console.error('Error sending message:', error);
    throw error; // Propagate error to the caller
  }
};

/**
 * Fetches a paginated list of messages from a conversation.
 *
 * @param {string} conversationId - The ID of the conversation from which to fetch messages.
 * @param {number} [page=1] - The page number (default is 1).
 * @param {number} [size=10] - The number of messages per page (default is 10).
 * @returns {Promise<Object>} - Returns an object containing the list of messages.
 * @throws Will throw an error if the request fails.
 */
export const getMessages = async (
  conversationId: string,
  page: number = 1,
  size: number = 10,
) => {
  try {
    const response = await apiClient.get(
      `/conversations/${conversationId}/messages?page=${page}&size=${size}`,
    );
    return response.data; // Return a list of paginated messages
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error; // Propagate error to the caller
  }
};

/**
 * Updates the content of a specific message in a conversation.
 *
 * @param {string} conversationId - The ID of the conversation to which the message belongs.
 * @param {string} messageId - The ID of the message to be updated.
 * @param {string} content - The new content of the message.
 * @returns {Promise<Object>} - Returns the updated message object.
 * @throws Will throw an error if the request fails.
 */
export const updateMessage = async (
  conversationId: string,
  messageId: string,
  content: string,
) => {
  try {
    const response = await apiClient.put(
      `/conversations/${conversationId}/messages/${messageId}`,
      { content }, // Send the updated content in the request body
    );
    return response.data; // Return the updated message object
  } catch (error) {
    console.error('Error updating message:', error);
    throw error; // Propagate error to the caller
  }
};

/**
 * Deletes a message from a conversation.
 *
 * @param {string} conversationId - The ID of the conversation to which the message belongs.
 * @param {string} messageId - The ID of the message to be deleted.
 * @returns {Promise<Object>} - Returns the success status of the operation.
 * @throws Will throw an error if the request fails.
 */
export const deleteMessage = async (
  conversationId: string,
  messageId: string,
) => {
  try {
    const response = await apiClient.delete(
      `/conversations/${conversationId}/messages/${messageId}`,
    );
    return response.data; // Return success status
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error; // Propagate error to the caller
  }
};
