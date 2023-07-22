import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { FaTrash } from 'react-icons/fa';
import TooltipIcon from './TooltipIcons';
import styled from 'styled-components';

interface Story {
  id?: number;
  title: string;
  coverImage: string | null;
  numberOfPages: number | null;
  originalCreatorId?: string;
  isPrivate: boolean;
  titleColor: string;
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
                        src={'https://res.cloudinary.com/dhin8tgv1/image/upload/v1689349895/cgdztp7ma8eqxivjsd5r.png'}
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
                { (
                  <div
                    style={{
                      top: '-20px',
                      height: '35px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <TooltipIcon
                      icon={() => <FaTrash size={20} color="white" />}
                      tooltipText="Delete story"
                      handleClick={() => {
                        if (window.confirm('Are you sure you want to delete this story?')) {
                          deleteStory(story.id!, story.originalCreatorId!);
                          console.log('story deleted');
                        }
                      }}
                      style={{
                        marginTop: '7px',
                      }}
                    />
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