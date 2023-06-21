import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useAuth0 } from '@auth0/auth0-react';

const socket = io('/');

interface Message {
  id: number;
  senderId: string;
  message: string;
}

const Messages = () => {
  const { user } = useAuth0();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [receiverId, setReceiverId] = useState<string>('google-oauth2|104097737553983109767');
  const [userId, setUserId] = useState<string | undefined>(user?.sub);

  useEffect(() => {
    setUserId(user?.sub);
  }, [user])

  useEffect(() => {
    if (userId) {
      socket.on('connect', () => {
        socket.emit('joinMsgRoom', userId);
      });

      socket.on('privateMessage', (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.emit('logJoinUser', userId);

      return () => {
        socket.emit('disconnectMsgUser', userId);
        socket.off();
      };
    }
  }, [userId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '') return;

    socket.emit('privateMessage', {
      senderId: userId,
      receiverId,
      message,
    });

    setMessage('');
  };

  return (
    <div>
      <h2>Private Messaging</h2>
      {userId}
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <span>{msg.senderId}:</span> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
