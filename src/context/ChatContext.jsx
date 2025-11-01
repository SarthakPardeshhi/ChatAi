import { createContext, useState, useEffect, useCallback } from 'react';
import chatService from '../services/chatService';

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [conversations, setConversations] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await chatService.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      // Use mock data as fallback
      const mockContacts = [
        {
          id: 'ai-chatbot',
          name: 'AI Assistant',
          avatar: null,
          lastMessage: 'Hi! How can I help you today?',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          isOnline: true,
          lastSeen: 'Online'
        },
        {
          id: 'user-1',
          name: 'John Doe',
          avatar: null,
          lastMessage: 'Hey, how are you?',
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 2,
          isOnline: false,
          lastSeen: 'Last seen 1 hour ago'
        },
        {
          id: 'user-2',
          name: 'Jane Smith',
          avatar: null,
          lastMessage: 'See you tomorrow!',
          lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
          unreadCount: 0,
          isOnline: true,
          lastSeen: 'Online'
        }
      ];
      setContacts(mockContacts);
    }
  };

  const loadMessages = async (contactId) => {
    try {
      const messages = await chatService.getMessages(contactId);
      setConversations(prev => ({
        ...prev,
        [contactId]: {
          messages,
          isTyping: false,
        },
      }));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (contactId, content) => {
    try {
      const message = await chatService.sendMessage(contactId, content);

      setConversations(prev => ({
        ...prev,
        [contactId]: {
          ...prev[contactId],
          messages: [...(prev[contactId]?.messages || []), message],
        },
      }));

      // Update contact's last message
      setContacts(prev => {
        const updated = prev.map(contact => {
          if (contact.id === contactId) {
            return {
              ...contact,
              lastMessage: content,
              lastMessageTime: message.timestamp,
            };
          }
          return contact;
        });
        // Sort by most recent
        return updated.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });

      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const markAsRead = async (contactId) => {
    const conversation = conversations[contactId];
    if (!conversation) return;

    try {
      const unreadMessages = conversation.messages.filter(
        msg => msg.recipientId === 'currentUser' && msg.status !== 'read'
      );

      for (const message of unreadMessages) {
        await chatService.markAsRead(message.id);
      }

      setUnreadCounts(prev => ({
        ...prev,
        [contactId]: 0,
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const setActiveContact = useCallback((contactId) => {
    setActiveContactId(contactId);
    if (contactId && !conversations[contactId]) {
      loadMessages(contactId);
    }
    if (contactId) {
      markAsRead(contactId);
    }
  }, [conversations]);

  const searchContacts = (query) => {
    setSearchQuery(query);
  };

  const filteredContacts = searchQuery
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : contacts;

  const receiveMessage = useCallback((message) => {
    const contactId = message.senderId;

    setConversations(prev => ({
      ...prev,
      [contactId]: {
        ...prev[contactId],
        messages: [...(prev[contactId]?.messages || []), message],
      },
    }));

    // Update contact's last message and reorder
    setContacts(prev => {
      const updated = prev.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
          };
        }
        return contact;
      });
      return updated.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    });

    // Increment unread count if not active chat
    if (contactId !== activeContactId) {
      setUnreadCounts(prev => ({
        ...prev,
        [contactId]: (prev[contactId] || 0) + 1,
      }));
    }
  }, [activeContactId]);

  const setTypingStatus = (contactId, isTyping) => {
    setConversations(prev => ({
      ...prev,
      [contactId]: {
        ...prev[contactId],
        isTyping,
      },
    }));
  };

  const updateMessageStatus = (messageId, status) => {
    setConversations(prev => {
      const updated = { ...prev };
      for (const contactId in updated) {
        const messages = updated[contactId].messages || [];
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
          updated[contactId] = {
            ...updated[contactId],
            messages: messages.map(m =>
              m.id === messageId ? { ...m, status } : m
            ),
          };
          break;
        }
      }
      return updated;
    });
  };

  const value = {
    contacts: filteredContacts,
    activeContactId,
    conversations,
    unreadCounts,
    sendMessage,
    markAsRead,
    setActiveContact,
    searchContacts,
    receiveMessage,
    setTypingStatus,
    updateMessageStatus,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
