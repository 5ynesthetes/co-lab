import React, { useState, useEffect } from "react";
import STT from './STT';
import '../styles.css';
import { FaSave, FaTimesCircle, FaVolumeUp, FaEraser } from 'react-icons/fa';
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import styled from 'styled-components';

const StyledSaveIcon = styled(FaSave)`
  color: white;
  &:hover {
    color: #8b88b5;
  }
`;

const StyledEraserIcon = styled(FaEraser)`
  color: white;
  &:hover {
    color: #8b88b5;
  }
`;

const StyledVolumeIcon = styled(FaVolumeUp)`
  color: white;
  &:hover {
    color: #8b88b5;
  }
`;

const StyledTimesCircleIcon = styled(FaTimesCircle)`
  position: absolute;
  top: -25px;
  right: -25px;
  color: #3d3983;
  background-color: white;
  border-radius: 100%;
  padding: 3px;

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

interface PageEditorProps {
  page: Page;
  onSave: (content: string, autoSave: boolean) => void;
  onCancel: () => void;
  roomId: string | undefined;
}

interface SaveButtonProps {
  onClick: () => void;
}

interface ClearButtonProps {
  onClick: () => void;
}

interface TTYButtonProps {
  onSpeakClick: () => void;
  updateTranscript: (transcript: string) => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel, roomId }) => {
  const [content, setContent] = useState(page.content);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSave = () => {
    onSave(content, false);
  };

  const handleCancel = () => {
    onCancel();
  };

  //for transcribing data into the page
  const updateContentWithTranscript = (transcript: string) => {
    setContent((prevContent) => prevContent + ' ' + transcript);
  };

  const handleSpeakClick = () => {
    if (page && 'speechSynthesis' in window) {
      //cancel any other ongoing speech synthesis
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(page.content);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis is not supported in this browser.');
    }
  };

  const handleClearContent = () => {
    setContent('');
  };

  const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => (
    <button
      onClick={ onClick }
      style={{ top: '14px', fontSize: '34px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
    >
      <StyledSaveIcon />
    </button>
  );

  const ClearButton: React.FC<ClearButtonProps> = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{ top: '14px', fontSize: '34px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
    >
      <StyledEraserIcon />
    </button>
  );

  const TTYButton: React.FC<TTYButtonProps> = ({ onSpeakClick, updateTranscript }) => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={onSpeakClick}
        style={{ top: '14px', fontSize: '34px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
      >
         <StyledVolumeIcon />
      </button>
    </div>
  );


  //auto save functionality for collaborative editing
  useEffect(() => {
    const autoSave = setInterval(() => {
      onSave(content, true);
    }, 1000);
    return () => {
      clearInterval(autoSave);
    };
  }, [onSave]);

  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block', top: '100px' }}>
        <GrammarlyEditorPlugin clientId='client_RZvMQYBxstbSeZEA6Ft7sA'>
          <textarea
            value={ content }
            onChange={ handleContentChange }
            maxLength={3000}
            rows={10}
            cols={50}
            style={{ width: '300px', height: '400px', padding: '15px' }}
          />
        </GrammarlyEditorPlugin>
        <StyledTimesCircleIcon
          size={30}
          onClick={ handleCancel }
        />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        right: 0,
        display: 'flex',
        gap: '10px',
      }}>
          <SaveButton onClick={ handleSave } />
          <ClearButton onClick={ handleClearContent } />
        <TTYButton onSpeakClick={ handleSpeakClick } updateTranscript={ updateContentWithTranscript } />
        <STT updateTranscript={ updateContentWithTranscript } />
      </div>
    </div>
  </div>
  );

};

export default PageEditor;