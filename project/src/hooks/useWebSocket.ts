import { useState, useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: 'progress' | 'result' | 'error' | 'log';
  module: 'unwrap' | 'batch' | 'analysis';
  data: {
    taskId: string;
    progress: number;
    message: string;
    details: any;
  };
}

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Simulate WebSocket connection for demo
    setIsConnected(true);
    
    // Simulate periodic messages
    const interval = setInterval(() => {
      const mockMessage: WebSocketMessage = {
        type: 'progress',
        module: 'unwrap',
        data: {
          taskId: 'demo-task',
          progress: Math.random() * 100,
          message: '处理进行中...',
          details: {}
        }
      };
      setLastMessage(mockMessage);
    }, 3000);

    return () => {
      clearInterval(interval);
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    // Simulate sending message
    console.log('Sending message:', message);
  };

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
};