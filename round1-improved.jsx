import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Lightbulb } from 'lucide-react';
import LessonSection from './rounds/common/LessonSection';
import ScenarioHero from './rounds/common/ScenarioHero';
import { round1Config } from './rounds/common/lessonConfig';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [selections, setSelections] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const renderScenario = () => (
    <ScenarioHero
      scenario={round1Config.scenario}
      actionTitle={round1Config.hero.actionTitle}
      actionCopy={round1Config.hero.actionCopy}
      actionLabel={round1Config.hero.actionLabel}
      onAction={() => setStage('lessons')}
      accentColorClass={round1Config.hero.accentColorClass}
      gradientFrom={round1Config.hero.gradientFrom}
      gradientTo={round1Config.hero.gradientTo}
    />
  );

  const renderLessons = () => {
    const allChosen = round1Config.sections.every((section) => selections[section.id]);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="text-blue-600" size={22} />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Test the building blocks</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Tap one per row, then skim the note that appears. Faster trying, less reading.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm font-semibold">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-800 rounded-lg px-3 py-2 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
              Clear task first
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-800 rounded-lg px-3 py-2 border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-500" aria-hidden="true" />
              Real context only
            </div>
            <div className="flex items-center gap-2 bg-purple-50 text-purple-800 rounded-lg px-3 py-2 border border-purple-100">
              <span className="w-2 h-2 rounded-full bg-purple-500" aria-hidden="true" />
              Keep it doable
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {round1Config.sections.map((section) => (
            <LessonSection
              key={section.id}
              section={section}
              selectedOptionId={selections[section.id]}
              onSelectOption={(optionId) => setSelections({ ...selections, [section.id]: optionId })}
            />
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-200 rounded-xl p-6 mt-6 text-center shadow-inner">
          <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to write?</h4>
          <p className="text-gray-700 text-sm mb-5">
            {allChosen ? 'Use these picks as guardrails in your own draft.' : 'Lock in one per row to unlock the next step.'}
          </p>
          <button
            onClick={() => setStage('complete')}
            disabled={!allChosen}
            className={`px-10 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
              allChosen
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white mb-8">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h3 className="text-3xl font-bold mb-2 text-center">{round1Config.completion.title}</h3>
        <p className="text-xl mb-6 text-center text-green-50">{round1Config.completion.summary}</p>

        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-lg font-bold mb-4">The three things that matter:</div>
          <div className="space-y-4">
            {round1Config.completion.takeaways.map((takeaway, index) => (
              <div key={takeaway.title} className="flex items-start gap-3">
                <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-bold">{takeaway.title}</div>
                  <div className="text-green-50 text-sm">{takeaway.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Round 1 Complete</h2>
        <p className="text-gray-600 mb-6">
          You locked in the essentials and kept momentum. Now try building one yourself.
        </p>
        <button
          onClick={onComplete}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
        >
          Start Round 2 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto mb-8 px-4 text-center">
        <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
          {round1Config.stageLabel}
        </div>
        <h1 className="text-4xl font-bold mb-2">{round1Config.headline}</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">{round1Config.subheadline}</p>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'lessons' && renderLessons()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round1GameV3;
