import React, { useState } from 'react';
import { Trophy, Sparkles, Target, Zap, Award, Clock, Flame } from 'lucide-react';
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
            AI is a weird technology and understanding it can be confusing. This program walks you through the right and wrong way to use AI, then puts you in a friendly game that shows what happens when you prompt well—or not. You might even win a mystery prize.
          </p>
        </div>

        {/* Tutorial steps */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Warm-up tutorials</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setCurrentRound('round1')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow rounded-full border border-gray-200 hover:-translate-y-0.5 transition-transform text-sm font-semibold text-gray-800"
              >
                <Target size={16} className="text-blue-600" />
                Step 1: Watch mistakes
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-500">5 min</span>
              </button>
              <button
                onClick={() => setCurrentRound('round2')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow rounded-full border border-gray-200 hover:-translate-y-0.5 transition-transform text-sm font-semibold text-gray-800"
              >
                <Sparkles size={16} className="text-purple-600" />
                Step 2: Guided build
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-500">5 min</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-600 font-semibold">Scored Levels</p>
            <h3 className="text-3xl font-bold text-gray-900">Easy → Medium → Hard</h3>
            <p className="text-sm text-gray-600 max-w-2xl">Start with a low-stakes practice round, then climb to tougher, multi-step scenarios that demand sharper prompting.</p>
          </div>
        </div>

        {/* Scored levels */}
        <div className="max-w-4xl mx-auto space-y-4">
          <button
            onClick={() => setCurrentRound('easy')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-left group relative overflow-hidden border-2 border-green-200 hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              EASY • SCORED
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Zap className="text-green-700" size={28} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-green-700 mb-1 tracking-wide">Level 1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Low-stakes warm-up</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Friendly, everyday scenario with one clear deliverable. Perfect first score.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>5-7 min</span>
                  <span className="ml-auto text-green-700 font-semibold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentRound('medium')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-left group relative overflow-hidden border-2 border-orange-200 hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              MEDIUM • SCORED
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Flame className="text-orange-700" size={28} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-orange-700 mb-1 tracking-wide">Level 2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add moving parts</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Two audiences or constraints to juggle. Write a prompt that keeps them balanced.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>7-9 min</span>
                  <span className="ml-auto text-orange-700 font-semibold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentRound('hard')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-left group relative overflow-hidden border-2 border-purple-200 hover:-translate-y-1 transition-transform"
          >
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 text-xs font-bold rounded-full shadow-md">
              HARD • SCORED
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Trophy className="text-purple-700" size={28} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-purple-700 mb-1 tracking-wide">Level 3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complex, timed challenge</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Multi-step output with conflicting constraints and tradeoffs. Show full prompt craft.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>9-12 min</span>
                  <span className="ml-auto text-purple-700 font-semibold group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
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

// Missing import
const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default App;
