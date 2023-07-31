import React from "react";
import '../styles.css';
import { FaMicrophoneAlt } from 'react-icons/fa';
import styled from 'styled-components';

const StyledMicrophoneIcon = styled(FaMicrophoneAlt)`
  color: white;
  &:hover {
    color: #8b88b5;
  }
`;

interface STTProps {
  updateTranscript: (newTranscript: string) => void;
}

interface SpeechToTextButtonProps {
  onClick: () => void;
}

const STT: React.FC<STTProps> = ({ updateTranscript }) => {
  // const isListening = useState(false);

  //functionality to start the web speech api listening
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          //only want the final result for the transcript
          if (result.isFinal) {
              const transcript = result[0].transcript;
              updateTranscript(transcript);
          }
      }
  };

    recognition.start();
  };

  const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{ marginTop: '2px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white', fontSize: '30px' }}
    >
      <StyledMicrophoneIcon />
    </button>
  );


  return(
    <div className="stt">
      <SpeechToTextButton onClick={ startListening } />
    </div>
  );
};

export default STT;