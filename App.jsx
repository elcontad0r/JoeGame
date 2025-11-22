import React, { useState } from 'react';
import { Trophy, Award, ArrowRight } from 'lucide-react';
import Round1Game from './round1-improved';
import Round2Game from './round2-improved';
import Round3Game from './round3-complete';

const App = () => {
  const [currentRound, setCurrentRound] = useState('menu'); // menu, round1, round2, easy, medium, hard

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <Trophy size={16} />
            <span>Compete for a Mystery Prize</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Learn AI Challenge
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Learn how to talk to AI the easy way. We’ll show quick examples of what works, then you’ll practice across easy, medium, and hard levels. Friendly, fast, and there’s a mystery prize.
          </p>
        </div>

        {/* Single start path */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Start the challenge</p>
              <p className="text-lg text-gray-700">
                Jump in with one clear starting point. You can always skip ahead if you already know where you want to practice.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentRound('round1')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start now
                  <ArrowRight size={18} />
                </button>
                <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 w-full sm:w-auto">
                  <span className="font-semibold text-gray-700">Jump to level:</span>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setCurrentRound('easy')}
                      className="px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-200 hover:border-purple-300 hover:text-purple-700 font-semibold transition-colors"
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => setCurrentRound('medium')}
                      className="px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-200 hover:border-purple-300 hover:text-purple-700 font-semibold transition-colors"
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setCurrentRound('hard')}
                      className="px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-200 hover:border-purple-300 hover:text-purple-700 font-semibold transition-colors"
                    >
                      Hard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Competition Info - Simplified */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How the Challenge Works</h3>
                <p className="text-sm text-gray-600">
                  Start with two quick walkthroughs, then pick easy, medium, or hard. Each level scores your prompt, shows what improved, and lets you jump right back in.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Trophy className="text-orange-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">What to Expect</h3>
                <p className="text-sm text-gray-600">
                  You’ll see everyday scenarios like writing updates, planning events, and helping friends. Pick your level, try again with the feedback, and climb the leaderboard toward the mystery prize.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 sm:p-8 text-center">
          <a
            href="https://www.nationalcrabrobotinitiative.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors inline-flex items-center justify-center shadow-lg"
          >
            A project of the National Crab Robot Initiative
          </a>
        </div>
      </div>
    </div>
  );

  const renderRound = () => {
    switch(currentRound) {
      case 'round1':
        return <Round1Game onComplete={() => setCurrentRound('round2')} onBack={() => setCurrentRound('menu')} />;
      case 'round2':
        return <Round2Game onComplete={() => setCurrentRound('easy')} onBack={() => setCurrentRound('menu')} />;
      case 'easy':
        return <Round3Game difficulty="easy" onBack={() => setCurrentRound('menu')} />;
      case 'medium':
        return <Round3Game difficulty="medium" onBack={() => setCurrentRound('menu')} />;
      case 'hard':
        return <Round3Game difficulty="hard" onBack={() => setCurrentRound('menu')} />;
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
