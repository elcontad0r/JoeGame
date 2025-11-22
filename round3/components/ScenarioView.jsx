import React from 'react';
import { Zap, ArrowRight, RefreshCw } from 'lucide-react';

const ScenarioView = ({ scenario, config, onStartWrite, onReset }) => {
  if (!scenario) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-2 border-orange-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
            <Zap className="text-orange-600" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{scenario.title || 'Your Scenario'}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.badgeColor}`}>{config.label} level</span>
              {scenario.sector && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">{scenario.sector}</span>
              )}
              {scenario.urgency && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-orange-700">{scenario.urgency}</span>
              )}
            </div>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-4">
              <p className="text-gray-800 leading-relaxed">{scenario.situation}</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
              <p className="text-sm font-semibold text-purple-900 mb-1">Your challenge:</p>
              <p className="text-gray-800 leading-relaxed">{scenario.requirement}</p>
              {scenario.focus && (
                <p className="text-xs text-purple-800 mt-2">What matters most: {scenario.focus}</p>
              )}
            </div>
            <div className="mt-4 bg-white border-2 border-dashed border-gray-200 rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">How this level works</p>
              <p className="text-sm text-gray-800 leading-relaxed">{config.playstyle}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStartWrite}
            className="flex-1 bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            Start Building My Prompt
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onReset}
            className="bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Different Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioView;
