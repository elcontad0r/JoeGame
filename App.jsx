import React, { useState } from 'react';
import { Trophy, Sparkles, Target, Zap, Award, Clock } from 'lucide-react';
import Round1Game from './round1-improved';
import Round2Game from './round2-improved';
import Round3Game from './round3-complete';

const App = () => {
  const [currentRound, setCurrentRound] = useState('menu'); // menu, round1, round2, round3

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
            The Prompt Challenge
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Learn to write clear, accountable AI prompts for any team or domain.
          </p>
        </div>

        {/* Round Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Round 1 */}
          <button
            onClick={() => setCurrentRound('round1')}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Target className="text-blue-600" size={28} />
            </div>
            <div className="text-xs font-bold text-blue-600 mb-2 tracking-wide">OBSERVE</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">See What Breaks</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Joe got mediocre output. See exactly where his prompts failed.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span className="text-gray-500">5 min</span>
              <span className="ml-auto text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Round 2 */}
          <button
            onClick={() => setCurrentRound('round2')}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group"
          >
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <Sparkles className="text-purple-600" size={28} />
            </div>
            <div className="text-xs font-bold text-purple-600 mb-2 tracking-wide">LEARN</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Master the Framework</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Build prompts with 5 guided ingredients. See results shift live.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span className="text-gray-500">5 min</span>
              <span className="ml-auto text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>

          {/* Round 3 */}
          <button
            onClick={() => setCurrentRound('round3')}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left group relative overflow-hidden border-2 border-orange-200"
          >
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-2.5 py-1 text-xs font-bold rounded-full shadow-md">
              SCORED
            </div>
            <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Zap className="text-orange-600" size={28} />
            </div>
            <div className="text-xs font-bold text-orange-600 mb-2 tracking-wide">COMPETE</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">The Challenge</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Tackle a fresh scenario. Write from scratch. Make the leaderboard.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className="text-gray-400" />
              <span className="text-gray-500">5+ min</span>
              <span className="ml-auto text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        </div>

        {/* Competition Info - Simplified */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">How Scoring Works</h3>
                <p className="text-sm text-gray-600">
                  Complete Rounds 1-2 to learn. Round 3 score determines your leaderboard rank. Top performers win.
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
                <h3 className="font-bold text-gray-900 mb-1">The Stakes</h3>
                <p className="text-sm text-gray-600">
                  Mystery prize for top scorers. Best prompt engineers will be announced to the group.
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
            Start Round 1 <ArrowRight size={18} />
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

// Missing import
const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default App;
