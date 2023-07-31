import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaTrash } from 'react-icons/fa';
import styled from 'styled-components';

interface Story {
  id?: number;
  title: string;
  coverImage: string | null;
  numberOfPages: number | null;
  originalCreatorId?: string;
  isPrivate: boolean;
  titleColor: string;
  collaborators: Array<string>
}

interface CarouselProps {
  items: Story[];
  handleStoryClick: (story: Story) => void;
  handleStoryHover: (story: Story) => void;
  deleteStory: (storyId: number, originalCreatorId: string) => void;
  user: string | undefined;
}

const StyledSlider = styled(Slider)`
  .slick-dots {
    transform: translateY(.5em);
  }

  .slick-dots li button:before {
    transition: 0.2s;
    content: '';
    border-radius: 100%;
    background: white;
    width: 10px;
    height: 10px;
  }
`;

const StyledTrashIcon = styled(FaTrash)`
  color: white;
  &:hover {
    color: #8b88b5;
  }
`;

const StoryCarousel: React.FC<CarouselProps> = ({ items, handleStoryClick, handleStoryHover, deleteStory, user }) => {
  const [current, setCurrent] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '-20px',
    autoplay: true,
    autoplaySpeed: 2000,
    afterChange: (current: any) => setCurrent(current),
  };

  const DeleteStoryButton = ({ onClick }) => (
    <button
      onClick={() => {
        if (window.confirm('Are you sure you want to delete this story?')) {
          onClick();
          console.log('story deleted');
        }
      }}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        marginTop: '7px',
      }}
    >
      <StyledTrashIcon size={20} />
    </button>
  );

  return (
    <div id='carousel' style={{ height: '300px', overflow: 'hidden', marginRight: '30px' }}>
      <StyledSlider {...settings}>
        {items.map((story, index) => {
          const userIsCreator = story.originalCreatorId === user;
            //if the story is private and the current user not creator, don't display the story
          if (story.isPrivate && !userIsCreator) {
            return null;
          }
          return (
            <div
              key={index}
              onClick={() => handleStoryClick(story)}
              onMouseEnter={() => handleStoryHover(story)}
              style={{
                marginBottom: '20px',
                marginRight: '10px',
                color: '#3d3983',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                cursor: 'pointer',
                transform: current === index ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform .5s',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '100px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: story.coverImage ? 'transparent' : 'white',
                  marginLeft: '80px',
                  marginTop: '30px',
                }}
              >
                {story.coverImage ? (
                  <img
                    src={ story.coverImage }
                    alt={ story.title }
                    style={{
                      width: '80px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '0.8em', color: 'black', textAlign: 'center' }}>
                    <img
                      src={'https://res.cloudinary.com/dtnq6yr17/image/upload/v1690048298/book_wr0o6r.png'}
                      alt={ story.title }
                      style={{
                        width: '80px',
                        height: '100px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ marginTop: '10px', fontSize: '0.8em', color: 'white', textAlign: 'center', marginBottom: '30px' }}>
                {story.title}
              </div>
              {userIsCreator && (
                <div
                  style={{
                    top: '-20px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <DeleteStoryButton onClick={() => deleteStory(story.id!, story.originalCreatorId!)} />
                </div>
              )}
            </div>
          );
        })}
      </StyledSlider>
    </div>
  );
};

export default StoryCarousel;