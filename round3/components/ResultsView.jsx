import React from 'react';
import { Sparkles, AlertCircle, TrendingUp, Trophy, RefreshCw } from 'lucide-react';
import { ingredientColors } from '../constants';
import { renderMarkdown, highlightQuotes } from '../utils/markdown.jsx';

const ResultsView = ({
  evaluation,
  scenario,
  simulation,
  generatedOutput,
  onReplay,
  onNewScenario,
  onShowLeaderboard
}) => {
  if (!evaluation || !scenario || !simulation || !generatedOutput) return null;

  const getScoreColor = (score) => {
    if (score >= 18) return 'text-green-600';
    if (score >= 15) return 'text-blue-600';
    if (score >= 12) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return 'bg-green-50 border-green-300';
    if (score >= 70) return 'bg-blue-50 border-blue-300';
    if (score >= 50) return 'bg-yellow-50 border-yellow-300';
    return 'bg-orange-50 border-orange-300';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-100 rounded-lg p-3 mb-6 border border-gray-300">
        <p className="text-xs text-gray-600 uppercase font-semibold mb-0.5">Scenario</p>
        <p className="text-sm font-semibold text-gray-900">{scenario.title}</p>
      </div>

      <details open className="bg-white rounded-lg shadow-md border-2 border-purple-200 mb-6">
        <summary className="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600" />
          What Claude Generated
          <span className="ml-auto text-gray-400 text-sm">Click to collapse</span>
        </summary>
        <div className="p-6 border-t border-gray-200">
          <div className="text-gray-800">{renderMarkdown(generatedOutput.content)}</div>
        </div>
      </details>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎬</span>
          <h2 className="text-2xl font-bold text-orange-900">What Happened</h2>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-sm">First Gate</span>
          </h3>
          <p className="text-gray-800 leading-relaxed">{highlightQuotes(simulation.first_gate)}</p>
        </div>

        {simulation.where_it_goes && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-sm">The Real Test</span>
            </h3>
            <p className="text-gray-800 leading-relaxed">{highlightQuotes(simulation.where_it_goes)}</p>
          </div>
        )}

        {simulation.consequences && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm">The Fallout</span>
            </h3>
            <p className="text-gray-800 leading-relaxed">{highlightQuotes(simulation.consequences)}</p>
          </div>
        )}

        {simulation.best_quote && (
          <div className="mt-4 pt-4 border-t-2 border-orange-300">
            <p className="text-xs font-semibold text-orange-900 uppercase mb-2">Quote of the Day</p>
            <blockquote className="text-base italic text-gray-900 font-medium">"{simulation.best_quote}"</blockquote>
          </div>
        )}
      </div>

      <div className={`rounded-xl p-6 mb-6 border-2 ${getScoreBgColor(evaluation.score)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Your Score</h2>
            <p className={`text-base font-semibold ${getScoreColor(evaluation.score)}`}>
              {evaluation.score >= 85
                ? 'Expert'
                : evaluation.score >= 70
                ? 'Proficient'
                : evaluation.score >= 50
                ? 'Developing'
                : 'Needs Work'}
            </p>
          </div>
          <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(evaluation.score)}`}>{evaluation.score}</div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              evaluation.score >= 85
                ? 'bg-green-500'
                : evaluation.score >= 70
                ? 'bg-blue-500'
                : evaluation.score >= 50
                ? 'bg-yellow-500'
                : 'bg-orange-500'
            }`}
            style={{ width: `${evaluation.score}%` }}
          />
        </div>
      </div>

      {simulation.analysis && (
        <details open className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
          <summary className="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-600" />
            What Went Wrong (or Right)
            <span className="ml-auto text-gray-400 text-sm">Click to collapse</span>
          </summary>
          <div className="p-4 border-t border-gray-200">
            <p className="text-gray-800 leading-relaxed">{simulation.analysis}</p>
          </div>
        </details>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <h3 className="font-bold text-xl mb-4 text-gray-900">Why It Went That Way</h3>
        <p className="text-gray-600 text-sm mb-6">Here's how each part of your prompt affected the outcome:</p>

        <div className="space-y-3">
          {evaluation.ingredients?.context && (
            <div className={`${ingredientColors.context.bg} border-2 ${ingredientColors.context.border} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${ingredientColors.context.label} px-3 py-1 rounded text-xs font-bold`}>Context</div>
                <div className={`text-2xl font-bold ${getScoreColor(evaluation.ingredients.context.score)}`}>
                  {evaluation.ingredients.context.score}/20
                </div>
              </div>
              <p className={`text-sm ${ingredientColors.context.text} leading-relaxed`}>
                {evaluation.ingredients.context.feedback}
              </p>
            </div>
          )}

          {evaluation.ingredients?.format && (
            <div className={`${ingredientColors.format.bg} border-2 ${ingredientColors.format.border} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${ingredientColors.format.label} px-3 py-1 rounded text-xs font-bold`}>Format</div>
                <div className={`text-2xl font-bold ${getScoreColor(evaluation.ingredients.format.score)}`}>
                  {evaluation.ingredients.format.score}/20
                </div>
              </div>
              <p className={`text-sm ${ingredientColors.format.text} leading-relaxed`}>
                {evaluation.ingredients.format.feedback}
              </p>
            </div>
          )}

          {evaluation.ingredients?.audience && (
            <div className={`${ingredientColors.audience.bg} border-2 ${ingredientColors.audience.border} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${ingredientColors.audience.label} px-3 py-1 rounded text-xs font-bold`}>Audience</div>
                <div className={`text-2xl font-bold ${getScoreColor(evaluation.ingredients.audience.score)}`}>
                  {evaluation.ingredients.audience.score}/20
                </div>
              </div>
              <p className={`text-sm ${ingredientColors.audience.text} leading-relaxed`}>
                {evaluation.ingredients.audience.feedback}
              </p>
            </div>
          )}

          {evaluation.ingredients?.constraints && (
            <div className={`${ingredientColors.constraints.bg} border-2 ${ingredientColors.constraints.border} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${ingredientColors.constraints.label} px-3 py-1 rounded text-xs font-bold`}>Constraints</div>
                <div className={`text-2xl font-bold ${getScoreColor(evaluation.ingredients.constraints.score)}`}>
                  {evaluation.ingredients.constraints.score}/20
                </div>
              </div>
              <p className={`text-sm ${ingredientColors.constraints.text} leading-relaxed`}>
                {evaluation.ingredients.constraints.feedback}
              </p>
            </div>
          )}

          {evaluation.ingredients?.goal && (
            <div className={`${ingredientColors.goal.bg} border-2 ${ingredientColors.goal.border} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${ingredientColors.goal.label} px-3 py-1 rounded text-xs font-bold`}>Goal</div>
                <div className={`text-2xl font-bold ${getScoreColor(evaluation.ingredients.goal.score)}`}>
                  {evaluation.ingredients.goal.score}/20
                </div>
              </div>
              <p className={`text-sm ${ingredientColors.goal.text} leading-relaxed`}>
                {evaluation.ingredients.goal.feedback}
              </p>
            </div>
          )}
        </div>
      </div>

      {evaluation.rewrite && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={20} className="text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900">Suggested fix</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{evaluation.rewrite.summary}</p>
          {evaluation.rewrite.prompt && (
            <div className="bg-white rounded-lg p-4 mt-4 border border-gray-200 font-mono text-xs text-gray-800 whitespace-pre-wrap">
              {evaluation.rewrite.prompt}
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl shadow-lg p-6 sm:p-8 text-center border border-purple-200">
        <Trophy className="mx-auto mb-4 text-orange-600" size={48} />
        <h3 className="text-2xl font-bold mb-3 text-gray-900">Round Complete</h3>
        <p className="text-gray-700 mb-6">
          {evaluation.score >= 75
            ? 'Strong work. Try a new scenario to test your skills.'
            : 'Keep practicing. Each scenario will help you improve.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReplay}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Try This Scenario Again
          </button>
          <button
            onClick={onNewScenario}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            New Scenario
          </button>
          <button
            onClick={onShowLeaderboard}
            className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <Trophy size={20} />
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
