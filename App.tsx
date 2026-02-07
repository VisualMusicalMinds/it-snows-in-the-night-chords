import React, { useEffect, useState } from 'react';
import SplitButton from './components/SplitButton';
import { CHORD_SETS } from './constants';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const toggleSet = () => {
    setActiveSetIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const currentChords = CHORD_SETS[activeSetIndex];

  return (
    <div className={`h-screen w-full flex items-center justify-center bg-white transition-opacity duration-700 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <main className="w-full px-2 flex flex-col items-center">
        
        {/* Chord Grid */}
        <div className="grid grid-cols-4 gap-2 w-full mb-3">
          {currentChords.map((pair, index) => {
            // Calculate keys: 1&2 for first button, 3&4 for second, etc.
            const leftKey = String((index * 2) + 1);
            const rightKey = String((index * 2) + 2);
            
            return (
              <div key={pair.id} className="flex justify-center">
                <SplitButton 
                  data={pair} 
                  leftKey={leftKey}
                  rightKey={rightKey}
                />
              </div>
            );
          })}
        </div>

        {/* Set Toggle */}
        <button 
          onClick={toggleSet}
          className="flex items-center gap-3 p-2 cursor-pointer transition-transform active:scale-95 outline-none"
          aria-label="Switch Chord Set"
        >
          <div 
            className={`w-4 h-4 rounded-full border-2 border-blue-600 transition-colors duration-300 ${
              activeSetIndex === 0 ? 'bg-blue-600' : 'bg-transparent'
            }`} 
          />
          <div 
            className={`w-4 h-4 rounded-full border-2 border-blue-600 transition-colors duration-300 ${
              activeSetIndex === 1 ? 'bg-blue-600' : 'bg-transparent'
            }`} 
          />
        </button>

      </main>
    </div>
  );
};

export default App;