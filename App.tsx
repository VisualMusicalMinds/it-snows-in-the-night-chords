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
    <div className={`app-container ${isReady ? 'ready' : ''}`}>
      <main className="main-content">
        
        {/* Chord Grid */}
        <div className="chord-grid">
          {currentChords.map((pair, index) => {
            // Calculate keys: 1&2 for first button, 3&4 for second, etc.
            const leftKey = String((index * 2) + 1);
            const rightKey = String((index * 2) + 2);
            
            return (
              <div key={pair.id} style={{ display: 'flex', justifyContent: 'center' }}>
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
          className="toggle-btn"
          aria-label="Switch Chord Set"
        >
          <div 
            className={`toggle-indicator ${activeSetIndex === 0 ? 'active' : 'inactive'}`} 
          />
          <div 
            className={`toggle-indicator ${activeSetIndex === 1 ? 'active' : 'inactive'}`} 
          />
        </button>

      </main>
    </div>
  );
};

export default App;