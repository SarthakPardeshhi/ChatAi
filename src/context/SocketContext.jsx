import { createContext, useState, useEffect, useRef, useContext } from 'react';
import { WS_URL, STORAGE_KEYS } from '../utils/constants';
import { ChatContext } from './ChatContext';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const chatContext = useContext(ChatContext);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const connectSocket = () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return;

    try {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleSocketEvent(data);
        } catch (error) {
          console.error('Failed to parse socket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);

        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          connectSocket();
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    }
  };

  const handleSocketEvent = (data) => {
    const { event, payload } = data;

    switch (event) {
      case 'message-received':
        if (chatContext?.receiveMessage) {
          chatContext.receiveMessage(payload);
        }
        break;

      case 'message-delivered':
        if (chatContext?.updateMessageStatus) {
          chatContext.updateMessageStatus(payload.messageId, 'delivered');
        }
        break;

      case 'message-read':
        if (chatContext?.updateMessageStatus) {
          chatContext.updateMessageStatus(payload.messageId, 'read');
        }
        break;

      case 'user-typing':
        if (chatContext?.setTypingStatus) {
          chatContext.setTypingStatus(payload.userId, true);
        }
        break;

      case 'user-stopped-typing':
        if (chatContext?.setTypingStatus) {
          chatContext.setTypingStatus(payload.userId, false);
        }
        break;

      case 'user-online':
      case 'user-offline':
        // Update contact online status
        // Could be handled in ChatContext if needed
        break;

      default:
        console.log('Unknown socket event:', event);
    }
  };

  const emit = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify({ event, data }));
    }
  };

  const on = (event, handler) => {
    // Custom event listeners could be registered here
    // For now, all events are handled in handleSocketEvent
  };

  const value = {
    socket,
    isConnected,
    emit,
    on,
    connectSocket,
    disconnectSocket,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
