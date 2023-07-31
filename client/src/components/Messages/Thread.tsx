import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Socket } from 'socket.io-client';
import { SocketContext } from './Inbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import {
  ConversationContainer,
  BubbleContainer,
  SenderBubble,
  RecipientBubble,
  TextInput,
  TextInputContainer,
  SendMessageContainer,
  SendButton,
  TimestampSender,
  TimestampRecipient,
  InviteLink
} from '../../styled';
interface Message {
  id: number;
  senderId: string;
  message: string;
  sender: {
    name: string;
  };
  recipient: {
    name: string;
  }
}

const Thread = ({ userId, receiverId, userList, setUserList }) => {
  const socket = useContext(SocketContext) as Socket;
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const getMessages = async () => {
    try {
      const response = await axios.get(`/messages/${userId}/${receiverId}`);
      const newMessages = response.data;
      setMessages(newMessages);
    } catch (err) {
      console.error('Failed to GET messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim() === '' || receiverId.trim() === '') return;

    socket.emit('directMessage', {
      senderId: userId,
      receiverId,
      message,
    });

    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  };

  const formatTimeDifference = (createdAt: string): string => {
    const created = new Date(createdAt);
    return formatDistanceToNow(created, { addSuffix: true });
  };

  useEffect(() => {
    socket.on('messageReceived', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('messageReceived');
    };
  });

  useEffect(() => {
    if (userId && receiverId) {
      getMessages();

      socket.emit('joinThread', userId, receiverId);

      return () => {
        socket.emit('disconnectThread', userId, receiverId);
        socket.off();
      };
    }
  }, [receiverId]);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <ConversationContainer ref={conversationContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <BubbleContainer>
              {msg.senderId === userId ? (
                <TimestampSender>
                  <SenderBubble>
                    {msg.message.includes('http://') || msg.message.includes('https://') ?
                      <InviteLink href={msg.message}>Let's collab!</InviteLink>
                      : msg.message}
                  </SenderBubble>
                  {formatTimeDifference(msg.createdAt)}
                </TimestampSender>
              ) : (
                <TimestampRecipient>
                  <RecipientBubble>
                    {msg.message.includes('http://') || msg.message.includes('https://') ?
                      <InviteLink href={msg.message}>Let's collab!</InviteLink>
                      : msg.message}
                  </RecipientBubble>
                  {formatTimeDifference(msg.createdAt)}
                </TimestampRecipient>
              )}
            </BubbleContainer>
          </div>
        ))}
      </ConversationContainer>
      {receiverId ? (
        <>
          <SendMessageContainer>
            <TextInputContainer>
              <TextInput
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </TextInputContainer>
            <SendButton onClick={sendMessage}>
              <FontAwesomeIcon icon={faPaperPlane} size='lg' />
            </SendButton>
          </SendMessageContainer>
        </>
      ) : null}
    </>
  );
};

export default Thread;
