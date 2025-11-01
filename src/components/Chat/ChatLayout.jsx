import NavigationPanel from './NavigationPanel';
import ContactListPanel from './ContactListPanel';
import ChatArea from './ChatArea';
import './ChatLayout.css';

const ChatLayout = () => {
  return (
    <div className="chat-layout">
      <NavigationPanel />
      <ContactListPanel />
      <ChatArea />
    </div>
  );
};

export default ChatLayout;
