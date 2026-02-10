import React, { useState, useEffect, useCallback } from 'react';
import { Chord, SplitChordButton as SplitButtonType } from '../types';
import { audioService } from '../services/audioService';

interface SplitButtonProps {
  data: SplitButtonType;
  leftKey: string;
  rightKey: string;
}

const SplitButton: React.FC<SplitButtonProps> = ({ data, leftKey, rightKey }) => {
  const [isLeftActive, setIsLeftActive] = useState(false);
  const [isRightActive, setIsRightActive] = useState(false);

  const startPlaying = useCallback((side: 'left' | 'right') => {
    const uniqueId = `${data.id}-${side}`;
    const chord = side === 'left' ? data.call : data.response;

    if (side === 'left') setIsLeftActive(true);
    else setIsRightActive(true);

    audioService.resumeContext().then(() => {
      audioService.startChord(uniqueId, chord.notes);
    });
  }, [data]);

  const stopPlaying = useCallback((side: 'left' | 'right') => {
    const uniqueId = `${data.id}-${side}`;
    
    if (side === 'left') setIsLeftActive(false);
    else setIsRightActive(false);

    audioService.stopChord(uniqueId);
  }, [data]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === leftKey) startPlaying('left');
      if (e.key === rightKey) startPlaying('right');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === leftKey) stopPlaying('left');
      if (e.key === rightKey) stopPlaying('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [leftKey, rightKey, startPlaying, stopPlaying]);

  // Touch/Mouse Handlers helper
  const handleStart = (e: React.SyntheticEvent, side: 'left' | 'right') => {
    if (e.type === 'touchstart') {
        // Handle specific touch behavior if needed
    }
    startPlaying(side);
  };

  const handleEnd = (e: React.SyntheticEvent, side: 'left' | 'right') => {
    stopPlaying(side);
  };

  return (
    <div className="split-button-wrapper">
      <div className="split-button-inner">
        
        {/* Left Side (Call) */}
        <button
          className={`chord-button ${data.call.color} ${isLeftActive ? 'active' : ''}`}
          onMouseDown={(e) => handleStart(e, 'left')}
          onMouseUp={(e) => handleEnd(e, 'left')}
          onMouseLeave={(e) => isLeftActive && handleEnd(e, 'left')} 
          onTouchStart={(e) => handleStart(e, 'left')}
          onTouchEnd={(e) => handleEnd(e, 'left')}
          onTouchCancel={(e) => handleEnd(e, 'left')}
          aria-label={`Play ${data.call.name} (Key ${leftKey})`}
        >
          <div className="chord-text">
            <span>{data.call.name}</span>
          </div>
        </button>

        {/* Separator Visual */}
        <div className="separator"></div>

        {/* Right Side (Response) */}
        <button
          className={`chord-button ${data.response.color} ${isRightActive ? 'active' : ''}`}
          onMouseDown={(e) => handleStart(e, 'right')}
          onMouseUp={(e) => handleEnd(e, 'right')}
          onMouseLeave={(e) => isRightActive && handleEnd(e, 'right')}
          onTouchStart={(e) => handleStart(e, 'right')}
          onTouchEnd={(e) => handleEnd(e, 'right')}
          onTouchCancel={(e) => handleEnd(e, 'right')}
          aria-label={`Play ${data.response.name} (Key ${rightKey})`}
        >
          <div className="chord-text">
            <span>{data.response.name}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SplitButton;