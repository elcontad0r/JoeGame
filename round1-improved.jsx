import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Clock, CheckCircle, Lightbulb } from 'lucide-react';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [selections, setSelections] = useState({});

  const scenario = {
    title: "Plan a Saturday Skillshare Day",
    urgency: "Draft the plan tonight",
    situation: "Your community center is hosting a relaxed weekend event with DIY classes (budgeting basics, meal prep, bike repair). Four volunteer instructors, 60 RSVPs so far, and you need to publish a plan with roles, timing, and what to bring before people head to bed.",
  };

  const sections = [
    {
      id: 'task',
      title: 'Task first, then details',
      summary: 'State the exact job before adding color.',
      helper: 'Leads the AI to deliver the right shape of work.',
      options: [
        {
          id: 'task-clear',
          label: 'Draft the full Skillshare Day plan',
          description: 'Ask for the plan you actually need, not a loose brainstorm.',
          stance: 'best'
        },
        {
          id: 'task-vague',
          label: 'Share some ideas for this event',
          description: 'Sounds fine, but you’ll just get a generic list of tips.',
          stance: 'avoid'
        },
        {
          id: 'task-hype',
          label: 'Write marketing copy to hype the club',
          description: 'Fun, but it ignores the Saturday logistics you actually need.',
          stance: 'avoid'
        }
      ]
    },
    {
      id: 'context',
      title: 'Context beats vagueness',
      summary: 'Share the real details of your situation.',
      helper: 'Specifics let the AI analyze instead of summarize.',
      options: [
        {
          id: 'context-specific',
          label: 'Name the classes, rooms, RSVPs, and timing',
          description: 'The output will match your headcount and spaces.',
          stance: 'best'
        },
        {
          id: 'context-late',
          label: 'Just say it is a “community event”',
          description: 'Not obviously wrong, but it hides the facts that change the plan.',
          stance: 'avoid'
        },
        {
          id: 'context-random',
          label: 'Talk about club values and mission',
          description: 'Nice background, yet it won’t help assign rooms or timing.',
          stance: 'avoid'
        }
      ]
    },
    {
      id: 'constraints',
      title: 'Constraints drive strategy',
      summary: 'Time, space, and budget steer the plan.',
      helper: 'Real limits focus the AI on workable options.',
      options: [
        {
          id: 'constraints-clear',
          label: 'Share budget, setup time, supplies on hand',
          description: 'The plan will fit how much money and time you actually have.',
          stance: 'best'
        },
        {
          id: 'constraints-none',
          label: 'Tell it “be creative, no limits”',
          description: 'Feels empowering, but invites ideas you can’t execute tomorrow.',
          stance: 'avoid'
        },
        {
          id: 'constraints-soft',
          label: 'Only mention it’s happening “soon”',
          description: 'Too fuzzy to inform the schedule or shopping list.',
          stance: 'avoid'
        }
      ]
    },
    {
      id: 'audience',
      title: 'Role shapes relevance',
      summary: 'Tell the AI who will use the output and how.',
      helper: 'Different audiences need different cuts of the same info.',
      options: [
        {
          id: 'audience-split',
          label: 'Separate notes for attendees and volunteers',
          description: 'Keeps instructions clear for each group.',
          stance: 'best'
        },
        {
          id: 'audience-everyone',
          label: 'One message for “everyone involved”',
          description: 'Looks efficient, but it blurs what helpers must do.',
          stance: 'avoid'
        },
        {
          id: 'audience-lead',
          label: 'Write only for leadership',
          description: 'Useful later, but skips the people running Saturday.',
          stance: 'avoid'
        }
      ]
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  const renderScenario = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">{scenario.title}</h2>
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-4">
              <Clock size={18} />
              <span>{scenario.urgency}</span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">Skip the painful tutorial</h3>
        <p className="text-base mb-5 text-blue-50">
          Pick the right ingredients in one screen. We’ll flag the sneaky traps so you can move on fast.
        </p>
        <button
          onClick={() => setStage('lessons')}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
        >
          Start picking <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderLessons = () => {
    const stanceStyles = {
      best: 'border-green-400 bg-green-50 text-green-900',
      avoid: 'border-red-200 bg-white text-gray-800'
    };

    const stanceBadges = {
      best: 'bg-green-100 text-green-700',
      avoid: 'bg-orange-100 text-orange-700'
    };

    const allChosen = sections.every((section) => selections[section.id]);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="text-blue-600" size={22} />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Pick the ingredients</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Choose one option per row. The good ones aren’t always obvious—look for the picks that keep the plan actionable for Saturday.
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            We’ll highlight the solid moves. Hover over anything that feels harmless—some options sound fine but lead to vague outputs.
          </div>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-3 mb-4 flex-col sm:flex-row sm:items-center">
                <div>
                  <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">{section.title}</div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{section.summary}</h4>
                  <p className="text-sm text-gray-600">{section.helper}</p>
                </div>
                {selections[section.id] && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    Locked in
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {section.options.map((option) => {
                  const isSelected = selections[section.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelections({ ...selections, [section.id]: option.id })}
                      className={`text-left rounded-lg border-2 p-4 transition-all h-full flex flex-col gap-2 hover:-translate-y-0.5 ${
                        isSelected ? stanceStyles[option.stance] : 'border-gray-200 bg-white text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sm">{option.label}</span>
                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${stanceBadges[option.stance]}`}>
                          {option.stance === 'best' ? 'Solid' : 'Looks fine, but…'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 mt-6 text-center">
          <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to write?</h4>
          <p className="text-gray-700 text-sm mb-4">
            {allChosen ? 'Nice picks. Keep them in mind for the next round.' : 'Select one option in each row to lock in what matters.'}
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
        <h3 className="text-3xl font-bold mb-2 text-center">You Spotted It</h3>
        <p className="text-xl mb-6 text-center text-green-50">
          Same AI. Better instructions. Actually useful output.
        </p>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-lg font-bold mb-4">The three things that matter:</div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <div className="font-bold">Context beats vagueness</div>
                <div className="text-green-50 text-sm">Specifics let AI analyze instead of summarize</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <div className="font-bold">Constraints drive strategy</div>
                <div className="text-green-50 text-sm">AI navigates tradeoffs when you tell it what matters</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <div className="font-bold">Role shapes relevance</div>
                <div className="text-green-50 text-sm">Define who needs this and how they'll use it</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Round 1 Complete</h2>
        <p className="text-gray-600 mb-6">
          You locked in the essentials without sitting through a lecture. Now try building one yourself.
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
          Round 1 of 3
        </div>
        <h1 className="text-4xl font-bold mb-2">Choose better prompts fast</h1>
        <p className="text-gray-600">One screen to pick the moves that make AI responses actually useful</p>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'lessons' && renderLessons()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round1GameV3;
