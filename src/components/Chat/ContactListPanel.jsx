import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import ContactItem from './ContactItem';
import './ContactListPanel.css';

const ContactListPanel = () => {
  const { contacts, activeContactId, setActiveContact, unreadCounts, searchContacts } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchContacts(query);
  };

  const handleContactClick = (contactId) => {
    setActiveContact(contactId);
  };

  return (
    <div className="contact-list-panel">
      <div className="contact-list-header">
        <h2 className="contact-list-title">Chats</h2>
        <div className="contact-list-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <div className="contact-list">
        {contacts.length === 0 ? (
          <div className="contact-list-empty">
            <p>No contacts found</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === activeContactId}
              unreadCount={unreadCounts[contact.id] || 0}
              onClick={() => handleContactClick(contact.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ContactListPanel;
