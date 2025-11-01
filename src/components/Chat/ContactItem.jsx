import Avatar from '../common/Avatar';
import { formatTimestamp } from '../../utils/helpers';
import './ContactItem.css';

const ContactItem = ({ contact, isActive, unreadCount, onClick }) => {
  return (
    <div
      className={`contact-item ${isActive ? 'contact-item-active' : ''}`}
      onClick={onClick}
    >
      <Avatar
        name={contact.name}
        avatar={contact.avatar}
        size="medium"
        isOnline={contact.isOnline}
      />

      <div className="contact-item-info">
        <div className="contact-item-header">
          <span className="contact-item-name">{contact.name}</span>
          {contact.lastMessageTime && (
            <span className="contact-item-time">
              {formatTimestamp(contact.lastMessageTime)}
            </span>
          )}
        </div>

        <div className="contact-item-footer">
          <span className="contact-item-status">
            {contact.lastMessage || (contact.isOnline ? 'Online' : 'Offline')}
          </span>
          {unreadCount > 0 && (
            <span className="contact-item-unread-badge">{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactItem;
