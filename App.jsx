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
            AI Onboarding Initiative
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            The Prompt Game
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn to get 10x better results from AI in 15 minutes
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
            <div className="text-sm font-semibold text-blue-600 mb-2">ROUND 1</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">See the Difference</h3>
            <p className="text-gray-600 text-sm mb-4">
              Compare bad vs. good prompts side-by-side. Understand what makes output actually useful.
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
            <div className="text-sm font-semibold text-purple-600 mb-2">ROUND 2</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Prompt</h3>
            <p className="text-gray-600 text-sm mb-4">
              Choose the right components with guidance. See your score before generating.
            </p>
            <div className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
              5 minutes →
            </div>
          </button>

          {/* Round 3 */}
          <button
            onClick={() => setCurrentRound('round3')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Zap className="text-orange-600" size={32} />
            </div>
            <div className="text-sm font-semibold text-orange-600 mb-2">ROUND 3</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Freestyle Challenge</h3>
            <p className="text-gray-600 text-sm mb-4">
              Random crisis scenario. Write your own prompt from scratch. Compete for the leaderboard.
            </p>
            <div className="text-sm font-semibold text-orange-600 group-hover:text-orange-700">
              5+ minutes →
            </div>
          </button>
        </div>

        {/* Why This Matters */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-600 rounded-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Trophy className="mx-auto mb-4" size={40} />
            <h2 className="text-2xl font-bold mb-4">Why This Matters</h2>
            <p className="text-purple-100 mb-4">
              Your clients need fast, high-quality work. AI can deliver that—but only if you know how to drive it.
            </p>
            <p className="text-purple-100">
              The difference between "meh" and "exactly what I needed" is in how you frame the ask.
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
