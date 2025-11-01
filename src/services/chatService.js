import api from './api';

class ChatService {
  async getContacts() {
    return api.get('/contacts');
  }

  async getContact(contactId) {
    return api.get(`/contacts/${contactId}`);
  }

  async getMessages(contactId, limit = 50, offset = 0) {
    return api.get(`/messages/${contactId}?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(recipientId, content) {
    return api.post('/messages', { recipientId, content });
  }

  async markAsRead(messageId) {
    return api.patch(`/messages/${messageId}/read`);
  }

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${api.baseURL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${api.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  }
}

export default new ChatService();
