import React, { useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import { SocketContext } from './Inbox';
import Thread from './Thread';
import {
  SidebarContainer,
  Inbox,
  MessageList,
  ThreadContainer,
  ClickableName,
  UserImage
} from '../../styled'

const Sidebar = () => {
  const socket = useContext(SocketContext) as Socket;

  const { user } = useAuth0();
  const [userId, setUserId] = useState<string>('');
  const [userList, setUserList] = useState<{ id: string; name: string }[]>([]);
  const [recipient, setRecipient] = useState<string>('');

  const getUsers = async () => {
    try {
      const { data } = await axios.get('/users');
      setUserList(data);
      setRecipient(data[0].id);
    } catch (err) {
      console.error('Failed to GET user list:', err);
    }
  }

  const handleRecipientClick = (recipientId: string) => {
    setRecipient(recipientId);
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
        <Inbox>Inbox</Inbox>
        <ul>
          {userList.map((user) => {
            if (user.id !== userId) {
              return (
                <ClickableName
                  key={user.id}
                  onClick={() => handleRecipientClick(user.id)}
                >
                  <UserImage
                    src={user.picture}
                    isSelected={user.id === recipient} />
                  {user.name}
                </ClickableName>
              )
            }
          })}
        </ul>
      </MessageList>
      <ThreadContainer>
        <Thread userId={userId} receiverId={recipient} userList={userList} setUserList={setUserList} />
      </ThreadContainer>
    </SidebarContainer>
  )
}

export default Sidebar;

