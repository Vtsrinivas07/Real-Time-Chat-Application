import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Message APIs
export const getMessages = async (limit = 100, offset = 0) => {
  const response = await api.get(`/messages?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const sendMessage = async (content, senderId) => {
  const response = await api.post('/messages', { content, senderId });
  return response.data;
};

export const deleteMessageForMe = async (messageId, userId) => {
  const response = await api.delete(`/messages/${messageId}/delete-for-me`, {
    data: { userId }
  });
  return response.data;
};

export const deleteMessageForEveryone = async (messageId, userId) => {
  const response = await api.delete(`/messages/${messageId}/delete-for-everyone`, {
    data: { userId }
  });
  return response.data;
};

export const togglePinMessage = async (messageId) => {
  const response = await api.patch(`/messages/${messageId}/pin`);
  return response.data;
};

export default api;
