import './ChatHeader.css';

const ChatHeader = ({ contactName, isOnline }) => {
  return (
    <div className="chat-header">
      <div className="chat-header-content">
        <h3 className="chat-header-name">{contactName}</h3>
        {isOnline !== undefined && (
          <span className="chat-header-status">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
