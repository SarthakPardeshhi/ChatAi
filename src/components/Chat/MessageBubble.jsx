import { formatMessageTime } from '../../utils/helpers';
import './MessageBubble.css';

const MessageBubble = ({ message, isSent }) => {
  const renderStatusIndicator = () => {
    if (!isSent) return null;

    switch (message.status) {
      case 'sent':
        return <span className="message-status">&#10003;</span>; // Single checkmark
      case 'delivered':
        return <span className="message-status">&#10003;&#10003;</span>; // Double checkmark
      case 'read':
        return <span className="message-status message-status-read">&#10003;&#10003;</span>; // Double checkmark (blue)
      default:
        return null;
    }
  };

  return (
    <div className={`message-bubble ${isSent ? 'message-sent' : 'message-received'}`}>
      <div className="message-content">{message.content}</div>
      <div className="message-footer">
        <span className="message-time">{formatMessageTime(message.timestamp)}</span>
        {renderStatusIndicator()}
      </div>
    </div>
  );
};

export default MessageBubble;
