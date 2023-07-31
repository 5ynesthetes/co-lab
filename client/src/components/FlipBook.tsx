import React, { useState, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import '../styles.css';
import { FaPlusCircle, FaVolumeUp } from 'react-icons/fa';
import styled from 'styled-components';
import PageEditor from "./PageEditor";
import TitlePage from './TitlePage';
import TooltipIcon from "./TooltipIcons";
import '../styles.css';

const PageContainer = styled.div`
  width: 500px;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Pages = styled.div`
  font-family: 'Georgia', serif;
  background: ivory;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  font-size: 18px;
  width: 500px;
  height: 700px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
`;

const StyledVolumeIcon = styled(FaVolumeUp)`
  color: #3d3983;
  background-color: white;
  border-radius: 50%;
  margin: 10px;
  padding: 3px;
  height: 30px;
  width: 30px;
  &:hover {
    color: #8b88b5;
  }
`;


interface Page {
  id?: number;
  page_number: number;
  content: string;
  story: string;
}

interface Story {
  id?: number;
  title: string;
  coverImage: any | null;
  numberOfPages: number | null;
  originalCreatorId?: string | null;
  isPrivate: boolean;
  titleColor: string;
  collaborators: Array<string>
}

interface FlipBookProps {
  story: Story;
  selectedStoryPages: Page[];
  onUpdatePage: (updatedPage: Page) => void;
  fetchPages: () => void;
  addNewPage: () => void;
  roomId: string | undefined;
  user: string | undefined;
}

const FlipBook: React.FC<FlipBookProps> = ({ story, selectedStoryPages, fetchPages, addNewPage, roomId, user }) => {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const flipBookRef = useRef<any>(null);

  const handlePageClick = (page: Page) => {
    //only allow the creator to edit
    // if (user === story.originalCreatorId) {
      setSelectedPage(page);
    // }
  };

  //save page after editing it
  const handleSavePage = async (content: string, autoSave = false) => {
    if (selectedPage && story) {
      const existingPage = selectedStoryPages.find(page => page.page_number === selectedPage.page_number);
      let response;

      if (existingPage) {
        //update the existing page
        try {
          response = await fetch(`/api/pages/${existingPage.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content,
              id: existingPage.id,
            })
          });
        } catch (error) {
          console.error('Failed to update the page-client:', error);
          return;
        }
        if (!response.ok) {
          console.error('Failed to update the page-server:', await response.text());
          return;
        }
      }

      //update the pages to display the current info
      //map over selectedStoryPages looking for the page and set the content
      selectedStoryPages.map((page: any) => {
        if (existingPage && page.page_number === existingPage.page_number) {
          return { ...page, content: content };
        }
        return page;
      });
      fetchPages();
      //only deselect the page if it's not an auto-save
      if (!autoSave) {
        setSelectedPage(null);
      }
    }
  };

  const handleCancelEdit = () => {
    setSelectedPage(null);
  };

  //to read the pages
  const handleSpeakClick = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Cannot read the page');
    }
  };

  return (
    <>
    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
    <HTMLFlipBook
      ref={flipBookRef}
      size={"stretch"}
      minWidth={300}
      maxWidth={500}
      minHeight={300}
      maxHeight={700}
      drawShadow={true}
      flippingTime={500}
      usePortrait={false}
      startZIndex={0}
      autoSize={true}
      maxShadowOpacity={0}
      mobileScrollSupport={false}
      clickEventForward={false}
      swipeDistance={0}
      showPageCorners={false}
      disableFlipByClick={true}
      width={500}
      height={650}
      className={'my-flipbook'}
      startPage={1}
      showCover={true}
      useMouseEvents={true}
      // onFlip={() => handleBookOpen()}
      style={{
        backgroundColor: '#3d3983',
        overflow: "visible",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '20px',
        paddingLeft: '5px',
      }}
      >
        <div>
          <PageContainer
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '90%',
              margin: 'auto',
            }}>
            <TitlePage
              story={ story }
              addNewPage={ addNewPage }
            />
          </PageContainer>
        </div>
      {selectedStoryPages.map((page, index) => (
        <div key={index}>
        <PageContainer
          onClick={() => handlePageClick(page)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '90%',
            margin: 'auto',
            }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              { index === selectedStoryPages.length - 2 && (
                <TooltipIcon
                  icon={ FaPlusCircle }
                  tooltipText="Add New Page"
                  handleClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    addNewPage();
                  }}
                  style={{
                    position: 'absolute',
                    color: '#3d3983',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    margin: '10px',
                    padding: '4px',
                    height: '30px',
                    marginTop: '5px',
                    width: '30px',
                  }}
                />
              )}
            <div onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleSpeakClick(page.content);
            }}>
              <StyledVolumeIcon size={30} />
            </div>
            </div>
            <Pages data-density="hard">
              {page.content}
              {index === selectedStoryPages.length - 1 ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '30px',
                    fontWeight: 'bold'
                  }}>
                  The End
                </div>
              ) : (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '68px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'black'
                  }}
                >
                  {page.page_number}
                </span>
              )}
            </Pages>
          </PageContainer>
        </div>
      ))}
      </HTMLFlipBook>
      {selectedPage && (
        <PageEditor
          page={ selectedPage }
          onSave={ handleSavePage }
          onCancel={ handleCancelEdit }
          roomId={ roomId }
        />
      )}
      </div>
    </>
  );
};

export default FlipBook;
