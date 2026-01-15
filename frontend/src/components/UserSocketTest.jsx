// UserSocketTest.jsx
import { useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

const UserSocketTest = () => {
  const { socket } = useContext(SocketContext);
  
  useEffect(() => {
    if (!socket) {
      console.log('❌ No socket connection');
      return;
    }
    
    console.log('✅ Socket connected:', socket.id);
    console.log('Socket connected status:', socket.connected);
    
    // Listen for all events
    socket.onAny((event, ...args) => {
      console.log(`🎯 Received event: ${event}`, args);
    });
    
    // Specific event listeners
    socket.on('repair-diagnosed', (data) => {
      console.log('🎯 Got repair-diagnosed event!', data);
      alert(`Repair diagnosed received: ${data.repairId}`);
    });
    
    socket.on('repair-diagnosed-broadcast', (data) => {
      console.log('🎯 Got broadcast event!', data);
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket connected with ID:', socket.id);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });
    
    return () => {
      socket.offAny();
      socket.off('repair-diagnosed');
      socket.off('repair-diagnosed-broadcast');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);
  
  return (
    <div className="p-4">
      <h1>Socket Test Page</h1>
      <p>Open browser console to see socket events</p>
      <div className="mt-4 p-4 bg-gray-800 rounded">
        <p>Socket ID: {socket?.id || 'Not connected'}</p>
        <p>Connected: {socket?.connected ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default UserSocketTest