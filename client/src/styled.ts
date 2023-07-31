import styled from 'styled-components';

// EYE
const CanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCanvas = styled.canvas<{ backgroundColor: string }>`
  width: 75vw;
  height: 70vh;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 10px;
  box-shadow:  5px 5px 13px #343171,
               -5px -5px 13px #464195;
  cursor: url('https://res.cloudinary.com/dtnq6yr17/raw/upload/v1690061567/cursor_bmteo3.cur'), auto;
`;

const DrawContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 75%;
  left: 5%;
  transform: translateY(-50%);
`;

const ColorPicker = styled.input`
  display: none;
`;

const ColorPickerWrapper = styled.div`
  display: flex:
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: -11rem;
  left: 1.25rem;
`;

const PenWidthSliderWrapper = styled.div`
  position: absolute;
  top: -2.1rem;
  left: 1.5rem;
  transform: rotate(-90deg);
  transform-origin: left center;
  display: flex;
  flex-direction: column;
`;

const PenWidthSlider = styled.div`
  background-color: #3d3983;

  input[type="range"] {
    height: 5px;
    width: 145px;
    -webkit-appearance: none;
    border: 2px solid white;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: white;
    height: 1.25rem;
    width: 1.25rem;
    margin-left: -1rem;
    border: 1px solid #3d3983;
    border-radius: 50%;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    width: 5px;
  }
`;

const ButtonContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: -1;
`;

const ButtonContainerRight = styled.div`
  margin-left: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-self: start;
`;

const Button = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: white;
  font-size: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 5% 5%;

  &:hover {
    color: #8b88b5;
  }
`;

const CollaboratorImage = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 15px;
  margin-left: -10px;
  object-fit: cover;
  object-position: center;
  clip-path: circle();
  align-self: center;
  border: 4px solid white;
  border-radius: 50%;
`;

const CollaboratorLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  margin: 0 auto;
`;

const CollaboratorCursor = styled.div<{ x: number; y: number, collaboratorColor: Color }>`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ collaboratorColor }) => collaboratorColor.toCSS(true)};
  pointer-events: none;
`;

// MESSAGES
// Thread
const BodyContainer = styled.div`
  background-color: #3d3983;
  display: flex;
  justify-content: space-between;
  width: 80vw;
  height: 70vh;
  margin: 0 auto;
`;

const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 78%;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  padding: 20px;
  border-radius: 10px;
  box-shadow:  5px 5px 13px #343171,
               -5px -5px 13px #464195;

  /* For WebKit browsers */
    &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f5c968;
    border-radius: 12px;
    border: 3px solid transparent;
  }

  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &::-moz-scrollbar {
    width: 6px;
  }

  &::-moz-scrollbar-track {
    background: transparent;
  }

  &::-moz-scrollbar-thumb {
    background-color: #f5c968;
    border-radius: 12px;
    border: 3px solid transparent;
  }
`;

const BubbleContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const SenderBubble = styled.div`
  align-self: flex-end;
  background-color: #F06b80;
  min-width: 33%;
  text-align: right;
  margin-left: auto;
  color: #ffffff;
  border: 2px solid white;
  border-radius: 20px;
  padding: 10px;
  white-space: pre-wrap;
  font-size: 20px;
`;

const RecipientBubble = styled.div`
  align-self: flex-start;
  background-color: #3d3983;
  min-width: 33%;
  margin-right: auto;
  color: #fff;
  border: 2px solid white;
  border-radius: 20px;
  padding: 10px;
  white-space: pre-wrap;
  font-size: 20px;
`;

const TextInputContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
`;

const TextInput = styled.input`
  height: 35px;
  width: 100%;
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
`;

const STTButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
  padding: 5px;
  background-color: transparent;
  border: none;
`;

const SendMessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const SendButton = styled.button`
  background-color: #F06b80;
  color: #ffffff;
  margin-left: 10px;
  border: 2px solid white;
  border-radius: 20px;
  padding: 7.5px 15px;
  font-size: 20px;
  cursor: pointer;
`;

//Sidebar
const SidebarContainer = styled.div`
  display: flex;
  width: 100%;
`;

const Inbox = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const MessageList = styled.div`
  flex: 1;
  width: 25%;
  height: 67vh;
  overflow-y: auto;
  scrollbar: hidden;

  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const ThreadContainer = styled.div`
  flex: 3;
  width: 75%;
  padding: 20px;
  max-height: 100%;
  overflow-y: auto;
`;

const ClickableName = styled.li`
  display: flex;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;

const UserImage = styled.img<{ isSelected: boolean }>`
  width: 40px;
  height: 40px;
  clip-path: circle();
  margin: 5px 10px 5px 65px;
  border: 4px solid transparent;
  border-radius: 50%;

  ${({ isSelected }) =>
    isSelected &&
    `
    border-color: white;
  `}
`;

//Thread
const TimestampSender = styled.div`
  text-align: right;
  margin-left: auto;
  font-size: 12px;
`;

const TimestampRecipient = styled.div`
  margin-right: auto;
  font-size: 12px;
`;

const InviteLink = styled.a`
  color: inherit;
`;

//Storybook
const StyledFormStory = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
  width: 500px;
  background-color: #fff;
`;

const StyledInputStory = styled.input`
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 40px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  outline: none;
  background-color: #f3f3f3;
  color: #3d3983;
  transition: background-color 0.3s ease;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    background-color: #e1e1e1;
  }
`;

const StyledButtonStory = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  outline: none;
  background-color: #3d3983;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #5e5a9e;
  }
`;

export {
  CanvasContainer,
  StyledCanvas,
  DrawContainer,
  ColorPicker,
  ColorPickerWrapper,
  PenWidthSliderWrapper,
  PenWidthSlider,
  ButtonContainer,
  ButtonContainerRight,
  Button,
  CollaboratorImage,
  CollaboratorLink,
  CollaboratorCursor,
  BodyContainer,
  ConversationContainer,
  BubbleContainer,
  SenderBubble,
  RecipientBubble,
  TextInput,
  TextInputContainer,
  STTButton,
  SendMessageContainer,
  SendButton,
  SidebarContainer,
  Inbox,
  MessageList,
  ThreadContainer,
  ClickableName,
  UserImage,
  TimestampSender,
  TimestampRecipient,
  InviteLink,
  StyledButtonStory,
  StyledFormStory,
  StyledInputStory,
};
