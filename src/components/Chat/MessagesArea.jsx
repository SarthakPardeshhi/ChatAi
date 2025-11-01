import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import './MessagesArea.css';

const MessagesArea = ({ messages = [], currentUserId, isTyping, contactName }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="messages-area">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="messages-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSent={message.senderId === currentUserId}
            />
          ))
        )}
        {isTyping && <TypingIndicator contactName={contactName} />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessagesArea;
