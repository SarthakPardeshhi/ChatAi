import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import ChatHeader from './ChatHeader';
import MessagesArea from './MessagesArea';
import InputArea from './InputArea';
import './ChatArea.css';

const ChatArea = () => {
  const { activeContactId, contacts, conversations, sendMessage } = useChat();
  const { currentUser } = useAuth();

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const conversation = activeContactId ? conversations[activeContactId] : null;
  const messages = conversation?.messages || [];
  const isTyping = conversation?.isTyping || false;

  const handleSendMessage = async (content) => {
    if (activeContactId) {
      try {
        await sendMessage(activeContactId, content);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleAttachFile = () => {
    // File attachment functionality - placeholder for now
    console.log('Attach file clicked');
  };

  if (!activeContactId) {
    return (
      <div className="chat-area chat-area-empty">
        <div className="chat-area-empty-message">
          <p>Select a contact to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <ChatHeader
        contactName={activeContact?.name || 'Unknown'}
        isOnline={activeContact?.isOnline}
      />
      <MessagesArea
        messages={messages}
        currentUserId={currentUser?.id}
        isTyping={isTyping}
        contactName={activeContact?.name}
      />
      <InputArea onSendMessage={handleSendMessage} onAttachFile={handleAttachFile} />
    </div>
  );
};

export default ChatArea;
