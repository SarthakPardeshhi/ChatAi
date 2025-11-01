import { useState } from 'react';
import './InputArea.css';

const InputArea = ({ onSendMessage, onAttachFile }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="input-area">
      <button
        type="button"
        className="input-attach-button"
        onClick={onAttachFile}
        title="Attach file"
      >
        &#128206;
      </button>

      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field"
        />

        <button type="submit" className="input-send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default InputArea;
