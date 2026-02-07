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
    // Prevent default to stop mouse events firing after touch events on hybrid devices
    // and to prevent scrolling on touch devices.
    if (e.type === 'touchstart') {
        // e.preventDefault() is often passive in React 18+, handled via CSS mostly, 
        // but good practice to try if strictly needed. 
        // Note: For simple buttons, usually just handling both events with state checks is fine.
    }
    startPlaying(side);
  };

  const handleEnd = (e: React.SyntheticEvent, side: 'left' | 'right') => {
    stopPlaying(side);
  };

  return (
    <div className="w-full flex flex-col group transform transition-all duration-300 hover:-translate-y-1 select-none">
      <div className="relative h-24 md:h-32 w-full flex rounded-xl overflow-hidden shadow-md bg-white border border-gray-200">
        
        {/* Left Side (Call) */}
        <button
          className={`
            relative flex-1 flex items-center justify-center
            transition-all duration-100 ease-out outline-none no-select touch-none
            ${data.call.color}
            ${isLeftActive ? 'brightness-125 scale-105 z-10' : 'hover:brightness-110'}
          `}
          onMouseDown={(e) => handleStart(e, 'left')}
          onMouseUp={(e) => handleEnd(e, 'left')}
          onMouseLeave={(e) => isLeftActive && handleEnd(e, 'left')} // Stop if dragging out
          onTouchStart={(e) => handleStart(e, 'left')}
          onTouchEnd={(e) => handleEnd(e, 'left')}
          onTouchCancel={(e) => handleEnd(e, 'left')}
          aria-label={`Play ${data.call.name} (Key ${leftKey})`}
        >
          <div className="pointer-events-none flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{data.call.name}</span>
          </div>
        </button>

        {/* Diagonal Cut Separator Visual */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/10 z-20 pointer-events-none mix-blend-multiply"></div>

        {/* Right Side (Response) */}
        <button
          className={`
            relative flex-1 flex items-center justify-center
            transition-all duration-100 ease-out outline-none no-select touch-none
            ${data.response.color}
            ${isRightActive ? 'brightness-125 scale-105 z-10' : 'hover:brightness-110'}
          `}
          onMouseDown={(e) => handleStart(e, 'right')}
          onMouseUp={(e) => handleEnd(e, 'right')}
          onMouseLeave={(e) => isRightActive && handleEnd(e, 'right')}
          onTouchStart={(e) => handleStart(e, 'right')}
          onTouchEnd={(e) => handleEnd(e, 'right')}
          onTouchCancel={(e) => handleEnd(e, 'right')}
          aria-label={`Play ${data.response.name} (Key ${rightKey})`}
        >
          <div className="pointer-events-none flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{data.response.name}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SplitButton;