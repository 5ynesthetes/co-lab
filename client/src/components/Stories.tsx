import React, { useState, useEffect, useRef, createContext } from "react";
import NewStoryForm from "./NewStoryForm";
import FlipBook from "./FlipBook";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from 'react-router-dom'
import { io, Socket } from 'socket.io-client';
import { FaTty, FaPenSquare, FaMicrophone, FaMicrophoneSlash, FaMagic, FaUserPlus } from 'react-icons/fa';
import TooltipIcon from './TooltipIcons';
import TTS from "./TTS";
import axios from 'axios';
import {v4 as generatePeerId} from 'uuid';
import Peer, { MediaConnection } from 'peerjs';
export const socket = io('/');
export const SocketContext = createContext<Socket | null>(null);
import '../styles.css';
import StoryCarousel from "./Carousel";
import { SketchPicker } from 'react-color';
import ModalStory from "./ModalStory";

interface Page {
  id?: number;
  page_number: number;
  content: string;
  story: string;
}

interface Story {
  id?: number;
  title: string;
  coverImage: string | null;
  numberOfPages: number | null;
  originalCreatorId?: string;
  isPrivate: boolean;
  titleColor: string;
  collaborators: Array<string>;
}

interface Friend {
  id: string;
  name: string;
}

export const TTSToggleContext = createContext<{
  ttsOn: boolean;
  setTtsOn: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  ttsOn: true,
  setTtsOn: () => {},
});

const peers: Record<string, MediaConnection> = {};

const StoryBook: React.FC = () => {
  const { user } = useAuth0();
  const { roomId } = useParams();
  const socket = io('/');
  const [pages, setPages] = useState<Page[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showNewStoryForm, setShowNewStoryForm] = useState(false);
  const [speakText, setSpeakText] = useState('');
  const [ttsOn, setTtsOn] = useState(false);
  const [peerId, setPeerId] = useState('');
  const [muted, setMuted] = useState(true);
  const [defaultStory, setDefaultStory] = useState(null);
  const [titleCol, setTitleCol] = useState('#000000');
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [friendList, setFriendList] = useState<Friend[]>([]);

  const userStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, MediaConnection>>({});
  const audioElements = useRef<Map<string, HTMLAudioElement>>(new Map());

  // for muting capabilities
  const handleToggleMute = () => {
    setMuted(prevMuted => {
      // Update the track itself
      if (userStream.current) {
        userStream.current.getAudioTracks().forEach((track) => {
          track.enabled = prevMuted;
        });
      }

      return !prevMuted;
    });
};

  useEffect(() => {
    setPeerId(generatePeerId());
    const peer = new Peer(peerId as string, {
      host: '/',
      port: 8001,
    })

    const myAudio = document.createElement('audio')
    myAudio.muted = true

    navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    }).then(stream => {
      userStream.current = stream;
      addAudioStream(peerId, myAudio, stream);

      peer.on('call', call => {
        call.answer(stream);
        call.on('stream', (userStream) => {
          const audio = document.createElement('audio');
          addAudioStream(call.peer, audio, userStream);
        })
      })

      socket.on('userJoined', userId => {
        connectToNewUser(userId, stream)
      })
    })

    const connectToNewUser = (userId: string, stream: MediaStream) => {
      const call = peer.call(userId, stream);
      const audio = document.createElement('audio');
      call.on('stream', (userStream) => {
        addAudioStream(userId, audio, userStream);
      });
      call.on('close', () => {
        audio.remove();
      });
      peers[userId] = call;
    };


    const addAudioStream = (userId: string, audio: HTMLAudioElement, stream: MediaStream) => {
      audio.srcObject = stream;
      audio.addEventListener('loadedmetadata', () => {
        audio.play();
      });
      audioElements.current.set(userId, audio);
    };

    socket.emit('createRoom', peerId, roomId);

    peer.on('open', (userId) => {
      socket.emit('joinRoom', userId, roomId);
    })

    socket.on('roomCreated', (userId, roomId) => {
      console.log(`${userId} created room: ${roomId}`);
    });

    socket.on('userJoined', (userId) => {
      console.log(`User ${userId} joined the room`);
    });

    socket.on('storyCreated', async () => {
      await fetchStories();
    });

    socket.on('newPageAdded', async (pageId) => {
      const page = await fetchPages();
      // Update the state or the UI with the new page
    });

    socket.on('storyDeleted', (storyId) => {
      // Update the state or the UI to reflect the deletion
    });

    socket.on('titleColorChanged', async ({ color, storyId }) => {
      await fetchStories();
    });

    socket.on('disconnectUser', userId => {
      if (peers[userId]) {
        peers[userId].close();
      }
    })

    // Clean up event listeners
    return () => {
      // window.removeEventListener('keypress', handleKeyPress);
      socket.emit('disconnectUser', peerId, roomId);
      socket.disconnect();
      peer.disconnect();
    };
  }, []);

  useEffect(() => {
    audioElements.current.forEach((audio, userId) => {
      audio.muted = muted;
    });
  }, [muted]);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Failed to fetch stories-client', error);
    }
  };

  //fetch stories from the server
  useEffect(() => {
    fetchStories();
  }, []);

  //fetch the pages for a specific story from the database
  const fetchPages = async () => {
    if (selectedStory) {
      try {
        const response = await fetch(`/api/pages?storyId=${selectedStory.id}`);
        const data = await response.json();

        let newPages = data.map((fetchedPage: any) => {
          return { id: fetchedPage.id, page_number: fetchedPage.page_number, content: fetchedPage.content, story: selectedStory.title };
        });

       //sort pages by page_number
        newPages = newPages.sort((a: any, b: any) => a.page_number - b.page_number);

        setPages(newPages);

      } catch (error) {
        console.error('Failed to fetch pages', error);
      }
    }
  };

  useEffect(() => {
    fetchPages();
  }, [selectedStory]);

  //handle click on a story title
  //put the selectedStory on the page
  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  const hoverTimeout = React.useRef<any>(null);
  //for TTS component to read title of story on hover
  // handle hover over a story
  const handleStoryHover = (story: Story) => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    // start a new timeout
    hoverTimeout.current = setTimeout(() => {
      setSpeakText(story.title);
    }, 1000);
  };

  //create a new story should show the form
  //add the story to the list of stories
  //and set the created story as the current working story
  const handleCreateStory = async (createdStory: Story) => {
    if (createdStory.isPrivate === false) {
      setStories([...stories, createdStory]);
      socket.emit('newStory', createdStory);
    }
    setSelectedStory(createdStory);
    setShowNewStoryForm(false);

    //add two empty pages to the new story
    for (let i = 1; i <= 3; i++) {
      const newPage: Page = {
        page_number: i,
        content: '',
        story: createdStory.title,
      };

      try {
        const response = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_number: newPage.page_number,
            content: newPage.content,
            storyId: createdStory.id,
          }),
        });

        const savedPage = await response.json();
        newPage.id = savedPage.id;
        setPages((prevPages) => [...prevPages, newPage]);
      } catch (error) {
        console.error('Failed to add new page', error);
      }
    }
  };


  //in case of cancel
  const handleCancelCreateStory = () => {
    setShowNewStoryForm(false);
  };

  //to toggle showing the story form
  const handleShowNewStoryForm = () => {
    setShowNewStoryForm(true);
  };


  const handleUpdatePage = (updatedPage: Page) => {
    // Update the pages array with the new page content
    setPages(prevPages =>
      prevPages.map(page =>
        page.page_number === updatedPage.page_number ? updatedPage : page
      )
    );
    socket.emit('pageUpdated', { page: updatedPage, roomId });
  };

  //functionality to add new page
  //changed to make POST request to database
  //so the new page gets an id immediately
  const addNewPage = async (content = '') => {
    if (selectedStory) {
      const newPageNumber = pages.length + 1;
      const newPage: Page = { page_number: newPageNumber, content, story: selectedStory.title };
      //POST request to save the new page to the database
      try {
        const response = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_number: newPageNumber,
            content,
            storyId: selectedStory.id
          })
        });
        const savedPage = await response.json();
        //update the new page with the id
        newPage.id = savedPage.id;
        setPages(prevPages => [...prevPages, newPage]);
        socket.emit('newPageAdded', { page: newPage, roomId });
      } catch (error) {
        console.error('Failed to add new page', error);
      }
    }
  };

  const deleteStory = async (storyId: number, originalCreatorId: string) => {
    if (user?.sub !== originalCreatorId) {
      console.error('Unauthorized deletion attempt');
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}?userId=${user?.sub}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // remove the deleted story from the list
        setStories(stories.filter(story => story.id !== storyId));
        socket.emit('storyDeleted', { storyId, roomId });
      } else {
        console.error('Failed to delete story-client');
      }
    } catch (error) {
      console.error('Failed to delete story-client', error);
    }
  };

  useEffect(() => {
    const fetchDefaultStory = async () => {
      const res = await axios.get('/api/stories');
      const defaultStory = res.data.filter((story: Story) => {
        return story.title === 'Instructions';
      })
      setSelectedStory(defaultStory[0]);
    };
    fetchDefaultStory();
  }, []);


  const handleColorPickerToggle = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleTitleColorChange = async (color: any) => {
    setTitleCol(color.hex);

    if (selectedStory) {
      const updatedStory = { ...selectedStory, titleColor: color.hex };
      setSelectedStory(updatedStory);
      socket.emit('titleColorChanged', { color: color.hex, storyId: selectedStory?.id, roomId });
      try {
        const response = await fetch(`/api/stories/${selectedStory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titleColor: color.hex }),
        });

        if (!response.ok) {
          throw new Error("response was not ok");
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    // fetch stories data from the server
    fetchStories();
  }, [selectedStory]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const openModal = async () => {
    try {
      setIsModalOpen(true);
      await getFriends();
    } catch (err) {
      console.error('Failed to send invite at client:', err);
    }
  }

  const getFriends = async () => {
    try {
      setIsModalOpen(true);
      const { data } = await axios.get(`/users/${user?.sub}`);

      if (data.friends && Array.isArray(data.friends)) {
        const friends = await Promise.all(
          data.friends.map(async (friendId: string) => {
            const userObj = await axios.get(`/users/${friendId}`);
            return { name: userObj.data.name, id: friendId };
          })
        );

        setFriendList(friends);
      } else {
        console.log('Friends data is not available or not an array');
        setFriendList([]);
      }

    } catch (err) {
      console.error('Failed to GET user friends at client:', err);
    }
  }


  const sendInvite = async (senderId: string, receiverId: string, message: string) => {
    // try {
      socket.emit('directMessage', {
        senderId,
        receiverId,
        message,
      });

  //   const response = await axios.put(`/stories/${selectedStory?.id}/collaborators`, { collaboratorId: receiverId });

  //   if (response.status !== 200) {
  //     throw new Error("Failed to update story collaborators");
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
  }

  return (
    <SocketContext.Provider value={socket}>
    <TTSToggleContext.Provider value={{ ttsOn, setTtsOn }}>
      <div style={{ display: 'flex' }}>
        {/* Column 2: FlipBook and PageEditor and NewStoryForm */}
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            alignContent: 'center',
            height: '100%',
            width: '100%',
          }}
        >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'right',
            justifyContent: 'right',
            marginRight: '20px',
            boxShadow: '5px 5px 13px #343171, -5px -5px 13px #464195',
          }}>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <TooltipIcon
              icon={ FaPenSquare }
              tooltipText="Create new story"
              handleClick={ handleShowNewStoryForm }
              style={{ marginRight: '20px', fontSize: '32px' }}
            />
            <TooltipIcon
              icon={ FaTty }
              tooltipText={ttsOn ? "Turn TTS Off" : "Turn TTS On"}
              handleClick={() => setTtsOn(!ttsOn)}
              style={{ marginRight: '20px' }}
            >
              {ttsOn ? "Turn TTS Off" : "Turn TTS On"}
            </TooltipIcon>
            <TooltipIcon
              icon={ muted ? FaMicrophoneSlash : FaMicrophone }
              tooltipText={muted ? "Unmute" : "Mute"}
              handleClick={ handleToggleMute }
              style={{ fontSize: '32px' }}
            />
            <TooltipIcon
              icon={ FaMagic }
              tooltipText={ 'Edit Cover Page' }
              handleClick={ handleColorPickerToggle }
              style={{ fontSize: '32px', marginLeft: '20px' }}
            />
          <div>
          <TooltipIcon
              icon={ FaUserPlus }
              tooltipText={ 'Invite Friends' }
              handleClick={ openModal }
              style={{ fontSize: '33px', marginLeft: '20px' }}
            />

            {isModalOpen && <ModalStory
              isOpen={ isModalOpen }
              onClose={ handleCloseModal }
              roomId={ roomId! }
              userId={ user?.sub! }
              friendList={ friendList }
              sendInvite={ sendInvite }
            />}
          </div>
              <div>
                {displayColorPicker ?
                  <div style={{ position: 'absolute', zIndex: '2' }}>
                    <SketchPicker color={ titleCol } onChange={ handleTitleColorChange } />
                  </div>
                  : null
                }
            </div>
          </div>
         </div>
         {showNewStoryForm && (
          <NewStoryForm onCreateStory={ handleCreateStory } onCancel={ handleCancelCreateStory } />
        )}

        {!showNewStoryForm && selectedStory &&
          <div style={{ height: '100%', width: '100%' }}>
            <FlipBook
              story={ selectedStory || defaultStory }
              selectedStoryPages={ pages }
              onUpdatePage={ handleUpdatePage }
              fetchPages={ fetchPages }
              addNewPage={ addNewPage }
              roomId={ roomId }
              user={ user?.sub }
            />
          </div>
        }
        </div>
      </div>
      {/* Carousel */}
      <div
        style={{
          height: '250px',
          width: '700px',
          boxShadow:  '5px 5px 13px #343171, -5px -5px 13px #464195',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto',
        }}>
        <StoryCarousel
          items={ stories }
          handleStoryClick={ handleStoryClick }
          handleStoryHover={ handleStoryHover }
          deleteStory={ deleteStory }
          user={ user?.sub }
        />
      </div>
      {/* TTS */}
      {speakText && <TTS text={ speakText } />}
    </TTSToggleContext.Provider>
    </SocketContext.Provider>
  );
};

export default StoryBook;