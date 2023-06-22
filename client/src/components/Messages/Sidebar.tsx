import React, { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { SocketContext } from './Inbox';
import Messages from './Messaging';
import Thread from './Thread';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  display: flex;
`;

const MessageList = styled.div`
  flex: 1;
  width: 25%;
  padding: 20px;
`;

const ThreadContainer = styled.div`
  flex: 3;
  width: 75%;
  padding: 20px;
  max-height: 100%;
  overflow-y: auto;
`;

const Sidebar = () => {
  const socket = useContext(SocketContext) as Socket;

  const { user } = useAuth0();
  const [userId, setUserId] = useState<string>('');
  const [userList, setUserList] = useState<{ id: string; name: string }[]>([]);
  const [recipient, setRecipient] = useState<string>('');

  const getUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUserList(response.data);
    } catch (err) {
      console.error('Failed to GET user list:', err);
    }
  }

  useEffect(() => {
    setUserId(user?.sub);
  }, [user])

  useEffect(() => {
    if (userId) {
      getUsers();
    }
  }, [userId])

  return (
    <SidebarContainer>
      <MessageList>
        <h1>Threads</h1>
        <ul>
          {userList.map((user) => (
            <li key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      </MessageList>
      <ThreadContainer>
        <Thread userId={userId} recipient={recipient} />
      </ThreadContainer>
    </SidebarContainer>
  )
}

export default Sidebar;
