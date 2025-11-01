import './TypingIndicator.css';

const TypingIndicator = ({ contactName }) => {
  return (
    <div className="typing-indicator">
      <span className="typing-indicator-text">{contactName} is typing</span>
      <span className="typing-indicator-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </span>
    </div>
  );
};

export default TypingIndicator;
