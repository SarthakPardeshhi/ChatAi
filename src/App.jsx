import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { SocketProvider } from './context/SocketContext';
import { router } from './routes/router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <SocketProvider>
          <RouterProvider router={router} />
        </SocketProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
