import React, { useState } from 'react';
import { Trophy, Sparkles, Target, Zap } from 'lucide-react';
import Round1Game from './round1-improved';
import Round2Game from './round2-improved';
import Round3Game from './round3-complete';

const App = () => {
  const [currentRound, setCurrentRound] = useState('menu'); // menu, round1, round2, round3

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            🏆 Compete for a Mystery Prize
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            The Prompt Challenge
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-3">
            See what Joe did wrong. Learn the principles. Beat your colleagues.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Top scorers compete for a firm-wide prize. 15 minutes to complete.
          </p>
        </div>

        {/* Round Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Round 1 */}
          <button
            onClick={() => setCurrentRound('round1')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Target className="text-blue-600" size={32} />
            </div>
            <div className="text-sm font-semibold text-blue-600 mb-2">STEP 1: OBSERVE</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">See What Joe Did Wrong</h3>
            <p className="text-gray-600 text-sm mb-4">
              Joe's a partner at your firm. He got mediocre AI output. See exactly where his prompts failed and what makes the difference.
            </p>
            <div className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              5 minutes →
            </div>
          </button>

          {/* Round 2 */}
          <button
            onClick={() => setCurrentRound('round2')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Sparkles className="text-purple-600" size={32} />
            </div>
            <div className="text-sm font-semibold text-purple-600 mb-2">STEP 2: LEARN</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Master the Framework</h3>
            <p className="text-gray-600 text-sm mb-4">
              Build a prompt with guided choices. Learn the five components that turn vague asks into high-quality output.
            </p>
            <div className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
              5 minutes →
            </div>
          </button>

          {/* Round 3 */}
          <button
            onClick={() => setCurrentRound('round3')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
              COMPETE
            </div>
            <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Zap className="text-orange-600" size={32} />
            </div>
            <div className="text-sm font-semibold text-orange-600 mb-2">STEP 3: COMPETE</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">The Challenge</h3>
            <p className="text-gray-600 text-sm mb-4">
              Real crisis scenario. Write your prompt from scratch. Get scored. Make the leaderboard. Win the prize.
            </p>
            <div className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">
              5+ minutes →
            </div>
          </button>
        </div>

        {/* Competition Stakes */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-600 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Trophy className="mx-auto mb-4" size={40} />
            <h2 className="text-2xl font-bold mb-4">How to Win</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left mb-6">
              <div>
                <div className="font-bold mb-2">1. Complete All Three Steps</div>
                <div className="text-purple-100 text-sm">Takes 15 minutes total. Each step builds on the last.</div>
              </div>
              <div>
                <div className="font-bold mb-2">2. Score High on The Challenge</div>
                <div className="text-purple-100 text-sm">Your Round 3 score determines leaderboard position. Aim for 85+.</div>
              </div>
              <div>
                <div className="font-bold mb-2">3. Check the Leaderboard</div>
                <div className="text-purple-100 text-sm">Top performers compete for the mystery prize. Rankings update live.</div>
              </div>
            </div>
            <p className="text-purple-100 text-sm">
              Best prompt engineers in your firm will be announced. May the best prompter win.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRound = () => {
    switch(currentRound) {
      case 'round1':
        return <Round1Game onComplete={() => setCurrentRound('round2')} onBack={() => setCurrentRound('menu')} />;
      case 'round2':
        return <Round2Game onComplete={() => setCurrentRound('round3')} onBack={() => setCurrentRound('menu')} />;
      case 'round3':
        return <Round3Game onBack={() => setCurrentRound('menu')} />;
      default:
        return renderMenu();
    }
  };

  return (
    <div>
      {currentRound === 'menu' ? renderMenu() : (
        <>
          {/* Back to menu button - fixed position */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => setCurrentRound('menu')}
              className="bg-white shadow-lg px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              ← Menu
            </button>
          </div>
          {renderRound()}
        </>
      )}
    </div>
  );
};

export default App;
