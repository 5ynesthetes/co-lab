import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from 'react';
import Draw from './Sketch';
import RandomPattern from './RandomPattern';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import 'bulma/css/bulma.min.css';

enum ActiveComponent {
  DrawMode,
  PatternMode
}

const VisualArt: React.FC = () => {
  const { user } = useAuth0();
  const { roomId } = useParams();
  const socket = io('http://localhost:8000');
  const { DrawMode, PatternMode } = ActiveComponent;
  const [mode, setMode] = useState<ActiveComponent>(DrawMode);
  const [backgroundColor, setBackgroundColor] = useState('#3d3983');

  useEffect(() => {
    socket.on('roomCreated', (userId, roomId) => {
      console.log(`${userId} created room: ${roomId}`);
    });

    socket.on('userJoined', (userId) => {
      socket.emit('logJoinUser', userId);
      console.log(`User ${userId} joined the room`);
    });

    socket.on('userLeft', (userId) => {
      console.log(`User ${userId} left the room`);
    });

    // Clean up the socket.io connection when the component unmounts
    return () => {
      socket.emit('disconnectUser', user?.sub);
      socket.disconnect();
    };
  }, [roomId]);

  const handleBackgroundColorChange = (e) => {
    const { value } = e.target;
    setBackgroundColor(value);
  };

  const renderComponent = () => {
    switch (mode) {
      case PatternMode:
        return <RandomPattern backgroundColor={backgroundColor} handleBackgroundColorChange={handleBackgroundColorChange} />;
      case DrawMode:
        return <Draw backgroundColor={backgroundColor} handleBackgroundColorChange={handleBackgroundColorChange} />;
    }
  };

  return (
    <>
      <div className="container is-flex-direction-column" style={{ marginTop: '2rem' }}>
        <div className="columns is-centered">
          <div className="column">
            <div className="buttons is-centered">
              <button
                className={`button ${mode === DrawMode ? 'is-primary' : ''}`}
                onClick={() => setMode(DrawMode)}
              >
                sketch
              </button>
              <button
                className={`button ${mode === PatternMode ? 'is-primary' : ''}`}
                onClick={() => setMode(PatternMode)}
              >
                random pattern
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>{renderComponent()}</div>
    </>
  )
}

export default VisualArt;