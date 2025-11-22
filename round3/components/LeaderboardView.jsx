import React from 'react';
import { Trophy } from 'lucide-react';

const LeaderboardView = ({ leaderboard, onRestart }) => {
  const animals = ['🦁', '🐯', '🐻', '🦅', '🐺', '🦊', '🐉', '🦈', '🐆', '🦇'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-600 to-orange-600 text-white p-8 rounded-lg mb-6 text-center">
        <Trophy className="mx-auto mb-4" size={56} />
        <h2 className="text-3xl font-bold mb-2">Leaderboard</h2>
        <p className="text-purple-100">Top prompt engineers in your firm</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No scores yet. Be the first to complete a scenario!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.slice(0, 20).map((entry, idx) => {
              const animal = animals[entry.id % animals.length];
              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    idx === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400'
                      : idx === 1
                      ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300'
                      : idx === 2
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        idx === 0
                          ? 'bg-yellow-500 text-white'
                          : idx === 1
                          ? 'bg-gray-400 text-white'
                          : idx === 2
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>{animal}</span>
                        <span>Player {(entry.id % 1000).toString().padStart(3, '0')}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {entry.scenarioType}
                        {entry.difficulty ? ` • ${entry.difficulty}` : ''} • {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-3xl font-bold ${
                      entry.score >= 85
                        ? 'text-green-600'
                        : entry.score >= 70
                        ? 'text-blue-600'
                        : entry.score >= 50
                        ? 'text-yellow-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {entry.score}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          Try Another Scenario
        </button>
      </div>
    </div>
  );
};

export default LeaderboardView;
