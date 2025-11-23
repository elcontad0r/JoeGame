import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Lightbulb } from 'lucide-react';
import ScenarioHero from './rounds/common/ScenarioHero';
import { round1Config } from './rounds/common/lessonConfig';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [openSections, setOpenSections] = useState({});

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
    const allOpened = round1Config.sections.every((section) => openSections[section.id]);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="text-blue-600" size={22} />
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">Spot why the first draft falls flat</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Open each section to compare a “miss” against a better prompt. You see the outcome and the fix at the same time.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm font-semibold">
            {round1Config.pillars.map((pillar) => (
              <div
                key={pillar.label}
                className={`${pillar.bg} ${pillar.text} rounded-lg px-3 py-2 border ${pillar.border} flex items-center gap-2`}
              >
                <span className={`w-2 h-2 rounded-full ${pillar.dot}`} aria-hidden="true" />
                {pillar.label}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {round1Config.sections.map((section) => {
            const isOpen = Boolean(openSections[section.id]);

            return (
              <div key={section.id} className="bg-white rounded-xl shadow border border-gray-100 p-5">
                <button
                  type="button"
                  onClick={() => setOpenSections({ ...openSections, [section.id]: !isOpen })}
                  className="w-full flex items-start justify-between gap-3 text-left"
                >
                  <div>
                    <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">{section.title}</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{section.summary}</h4>
                    <p className="text-sm text-gray-600">{section.helper}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    {isOpen ? 'Hide comparison' : 'See miss vs. fix'}
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${isOpen ? 'rotate-180 text-purple-600' : 'text-gray-500'}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-rose-100 bg-rose-50/70 p-4">
                      <div className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-1">If you ask it this way</div>
                      <div className="font-semibold text-gray-900">{section.misstep.prompt}</div>
                      <p className="text-sm text-gray-700 mt-1">{section.misstep.effect}</p>
                    </div>
                    <div className="rounded-lg border border-green-100 bg-green-50/70 p-4">
                      <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Do this instead</div>
                      <div className="font-semibold text-gray-900">{section.fix.prompt}</div>
                      <p className="text-sm text-gray-700 mt-1">{section.fix.effect}</p>
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
                      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Takeaway</div>
                      <p className="text-sm text-gray-800">{section.takeaway}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 mt-6">
          <div className="flex items-start gap-2 mb-3">
            <Lightbulb className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h4 className="text-lg font-bold text-gray-900">What you just learned</h4>
              <p className="text-sm text-gray-700">
                Keep these fixes in mind while you build your own prompt next.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {round1Config.completion.takeaways.map((takeaway) => (
              <div key={takeaway.title} className="bg-white/80 rounded-lg border border-blue-100 p-3 shadow-sm">
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">{takeaway.title}</div>
                <div className="text-sm text-gray-800 leading-relaxed">{takeaway.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-200 rounded-xl p-6 mt-6 text-center shadow-inner">
          <h4 className="text-xl font-bold text-gray-900 mb-2">Jump into Round 2</h4>
          <p className="text-gray-700 text-sm mb-5">
            {allOpened
              ? 'Apply the fixes above to your own prompt build.'
              : 'Open each comparison to see the miss and the fix before continuing.'}
          </p>
          <button
            onClick={onComplete}
            disabled={!allOpened}
            className={`px-10 py-3 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
              allOpened
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Start Round 2 <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  };

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
    </div>
  );
};

export default Round1GameV3;
