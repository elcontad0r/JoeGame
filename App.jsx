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
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 w-full sm:w-auto">
                  <span className="font-semibold text-gray-700">Jump to level:</span>
                  <select
                    className="bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    defaultValue=""
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        setCurrentRound(value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="" disabled>
                      Choose level
                    </option>
                    <option value="easy">Level 1 (Easy)</option>
                    <option value="medium">Level 2 (Medium)</option>
                    <option value="hard">Level 3 (Hard)</option>
                  </select>
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
                  Take two short tutorials, then try three scored levels. Each run gives you feedback so you can see how better prompts change the results.
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
                  Scenarios stay approachable—think planning events, writing updates, helping friends. Do your best, compare scores, and a mystery prize awaits the top spot.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 sm:p-8 text-center">
          <p className="text-gray-300 text-sm mb-4">
            15 minutes total • All rounds build on each other • Rankings update live
          </p>
          <button
            onClick={() => setCurrentRound('round1')}
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
          >
            Start Step 1 <ArrowRight size={18} />
          </button>
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
