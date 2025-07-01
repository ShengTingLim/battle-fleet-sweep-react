import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log('Connected to server!');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('Disconnected from server!');
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div>
      <h1>Battle Fleet Sweep v2</h1>
      <p>Server Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}

export default App;