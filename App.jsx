import React, { useState } from 'react';
import Round1Game from './round1-improved';
import Round2Game from './round2-improved';
import Round3Game from './round3-complete';
import Menu from './components/Menu';
import BackButton from './components/BackButton';

const App = () => {
  const [currentRound, setCurrentRound] = useState('menu'); // menu, round1, round2, easy, medium, hard

  const handleStart = () => setCurrentRound('round1');
  const handleJumpToLevel = (level) => setCurrentRound(level);
  const handleBackToMenu = () => setCurrentRound('menu');

  const renderRound = () => {
    switch (currentRound) {
      case 'round1':
        return <Round1Game onComplete={() => setCurrentRound('round2')} onBack={handleBackToMenu} />;
      case 'round2':
        return <Round2Game onComplete={() => setCurrentRound('easy')} onBack={handleBackToMenu} />;
      case 'easy':
        return <Round3Game difficulty="easy" onBack={handleBackToMenu} />;
      case 'medium':
        return <Round3Game difficulty="medium" onBack={handleBackToMenu} />;
      case 'hard':
        return <Round3Game difficulty="hard" onBack={handleBackToMenu} />;
      default:
        return <Menu onStart={handleStart} onJumpToLevel={handleJumpToLevel} />;
    }
  };

  if (currentRound === 'menu') {
    return <Menu onStart={handleStart} onJumpToLevel={handleJumpToLevel} />;
  }

  return (
    <div>
      <BackButton onBack={handleBackToMenu} />
      {renderRound()}
    </div>
  );
};

export default App;
