import React, { useState, useEffect, useMemo } from 'react';
import TopicInput from './round3/components/TopicInput';
import ScenarioView from './round3/components/ScenarioView';
import PromptBuilder from './round3/components/PromptBuilder';
import GeneratingState from './round3/components/GeneratingState';
import ResultsView from './round3/components/ResultsView';
import LeaderboardView from './round3/components/LeaderboardView';
import ScenarioLoading from './round3/components/ScenarioLoading';
import { difficultyConfig, chipRules, difficultyFieldOrder } from './round3/constants';
import usePromptIngredients from './round3/hooks/usePromptIngredients';

const Round3Game = ({ onBack, difficulty = 'easy' }) => {
  const selectedDifficulty = difficulty;
  const config = difficultyConfig[selectedDifficulty] || difficultyConfig.easy;
  const difficultyChipRule = chipRules[selectedDifficulty] || chipRules.easy;
  const [stage, setStage] = useState('topic-input');
  const [userTopic, setUserTopic] = useState('');
  const [scenario, setScenario] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const activeChipRule = scenario?.chipRule || difficultyChipRule;

  const promptIngredients = usePromptIngredients({ chipRule: activeChipRule });
  const {
    promptValues,
    promptSetters,
    selectedPresets,
    collapsed,
    chipsPlayed,
    baseFieldsFilled,
    buildFullPrompt,
    applyPresetToField,
    toggleCollapse,
    resetPromptState: resetIngredients
  } = promptIngredients;

  const ingredientPresets = useMemo(() => {
    const scenarioContext = scenario?.situation || 'Use concrete scenario facts (names, timing, numbers).';
    const deliverable = scenario?.requirement || 'Spell out the deliverable and success criteria.';
    const audienceHint = scenario?.sector
      ? `Write in the voice of people in ${scenario.sector} who need this to be usable.`
      : 'Speak directly to the people who will actually use this.';
    const urgency = scenario?.urgency ? `Timing: ${scenario.urgency}.` : 'Note when this is due and why timing matters.';
    const challenge = scenario?.title ? `Task: ${scenario.title}.` : 'Clarify the headline ask.';

    return {
      easy: {
        context: [
          {
            id: 'setting-people',
            label: 'Setting + people',
            snippet: scenarioContext.split('. ').slice(0, 1).join('. ') || scenarioContext
          },
          {
            id: 'headline-ask',
            label: 'Headline ask',
            snippet: deliverable
          },
          {
            id: 'timing',
            label: 'Timing',
            snippet: urgency
          }
        ],
        format: [
          {
            id: 'steps-bullets',
            label: 'Steps + bullets',
            snippet: `Short intro, then 3-4 bullets with headers. Keep it skimmable. ${urgency}`,
            tone: 'easy'
          },
          {
            id: 'mini-template',
            label: 'Mini template',
            snippet: 'Greeting → key info → 3 bullets → closing ask. Keep sentences under 18 words.',
            tone: 'Round 2 remix'
          },
          {
            id: 'checklist',
            label: 'Checklist',
            snippet: 'Checklist with owners + due times. Close with one reminder line.'
          }
        ],
        audience: [
          {
            id: 'speak-to-readers',
            label: 'Speak to readers',
            snippet: audienceHint
          },
          {
            id: 'what-they-need',
            label: 'What they need',
            snippet: 'Call out what they worry about (time, cost, effort). Highlight the one decision they owe you.'
          },
          {
            id: 'tone',
            label: 'Tone',
            snippet: 'Plain, calm voice. Avoid hype; aim for clarity first.'
          }
        ],
        constraints: [
          {
            id: 'tone-guardrails',
            label: 'Tone guardrails',
            snippet: 'Warm, plain language. No jargon. Keep to 180-220 words max.'
          },
          {
            id: 'format-guardrails',
            label: 'Formatting',
            snippet: 'Headers + bullets; paste-ready for chat/email. No analysis around it.'
          },
          {
            id: 'scope',
            label: 'Stay scoped',
            snippet: 'Stick to the scenario facts; no new promises or offers.'
          }
        ],
        goal: []
      },
      medium: {
        context: [
          {
            id: 'stakes',
            label: "What's at stake",
            snippet: `${challenge} Why it matters: explain the stakes for the team/person reading.`,
            tone: 'sharper'
          },
          {
            id: 'evidence',
            label: 'Evidence + facts',
            snippet: `${scenarioContext} Include numbers, names, or locations that make this credible.`
          },
          {
            id: 'constraints-teaser',
            label: 'Fixed limits',
            snippet: `Budget/time limits: ${urgency} Keep to the real constraints.`
          }
        ],
        format: [
          {
            id: 'checklist-format',
            label: 'Checklist + mini-brief',
            snippet: 'Header line with the goal, then checklist with owners/timing, then a 3-sentence rationale.',
            tone: 'Round 2 remix'
          },
          {
            id: 'two-column',
            label: 'Need → Answer',
            snippet: 'Bullets that pair "Need" → "Answer" so readers can skim fast. End with a one-line summary.',
            tone: 'structured'
          },
          {
            id: 'timeline',
            label: 'Timeline cut',
            snippet: 'Start with when things happen, then who owns them, then the ask.'
          }
        ],
        audience: [
          {
            id: 'audience-lens',
            label: 'Audience lens',
            snippet: `${audienceHint} Be explicit about what you need from them.`
          },
          {
            id: 'secondary-readers',
            label: 'Secondary readers',
            snippet: 'Assume this will be forwarded. Add one sentence that helps a new reader catch up fast.'
          },
          {
            id: 'voice',
            label: 'Voice',
            snippet: 'Direct, specific, confident. One sentence that sets the tone.'
          }
        ],
        constraints: [
          {
            id: 'avoid-fluff',
            label: 'Avoid fluff',
            snippet: 'No metaphors or marketing spin. Prioritize clarity over persuasion. Define acronyms once.'
          },
          {
            id: 'ready-to-send',
            label: 'Ready to send',
            snippet: 'Return only the final copy. Format so it pastes cleanly into chat/email.'
          },
          {
            id: 'tradeoffs',
            label: 'Tradeoffs',
            snippet: 'Call out one tradeoff and what wins if things conflict.'
          }
        ],
        goal: []
      },
      hard: {
        context: [],
        format: [],
        audience: [],
        constraints: [],
        goal: []
      }
    };
  }, [scenario]);

  const loadLeaderboard = () => {
    const stored = localStorage.getItem('ai-game-leaderboard');
    if (stored) {
      setLeaderboard(JSON.parse(stored));
    }
  };

  const saveToLeaderboard = (score, scenarioType) => {
    const entry = {
      score,
      scenarioType,
      difficulty: config.leaderboardTag,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    const stored = localStorage.getItem('ai-game-leaderboard');
    const current = stored ? JSON.parse(stored) : [];
    const updated = [...current, entry].sort((a, b) => b.score - a.score).slice(0, 50);

    localStorage.setItem('ai-game-leaderboard', JSON.stringify(updated));
    setLeaderboard(updated);
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const generateScenario = async (topic) => {
    setStage('loading');

    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userTopic: topic, difficulty: selectedDifficulty })
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const data = await response.json();
      resetPromptState();
      setScenario({ ...data.scenario, difficulty: selectedDifficulty });
      setStage('scenario');
    } catch (error) {
      console.error('Error generating scenario:', error);
      alert('Failed to generate scenario. Please check API connection.');
      setStage('scenario');
    }
  };

  const hints = [
    {
      category: 'Context',
      questions: ["What does Claude need to know about the company?", 'What are the specific facts?', "What's at stake?"]
    },
    {
      category: 'Format',
      questions: ['What structure works best?', 'How long should it be?', 'Any specific sections needed?']
    },
    {
      category: 'Audience',
      questions: ["Who's reading this?", "What's their perspective?", 'What tone will land?']
    },
    {
      category: 'Constraints',
      questions: ['What must be avoided?', 'What are the limitations?', 'Any specific requirements?']
    },
    {
      category: 'Goal',
      questions: ["What's the desired outcome?", 'What action should they take?', 'How will success be measured?']
    }
  ];

  const allHints = config.hintExtras
    ? [
        ...hints,
        {
          category: `${config.label} focus`,
          questions: config.hintExtras
        }
      ]
    : hints;

  const readyToGenerate = baseFieldsFilled && chipsPlayed >= (activeChipRule.minTotalSelections || 0);

  const resetPromptState = () => {
    resetIngredients();
    setGeneratedOutput(null);
    setSimulation(null);
    setEvaluation(null);
    setGenerationStep('');
    setShowHints(false);
  };

  const handleGenerate = async () => {
    if (!readyToGenerate) return;

    setStage('generating');
    setIsGenerating(true);

    try {
      setGenerationStep('Building your prompt...');
      await new Promise(resolve => setTimeout(resolve, 800));

      const fullPrompt = buildFullPrompt();

      setGenerationStep('Generating the output...');

      const generateResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          scenario: scenario
        })
      });

      if (!generateResponse.ok) {
        throw new Error('Generation failed');
      }

      const generateData = await generateResponse.json();
      setGeneratedOutput({ content: generateData.output });

      setGenerationStep('Simulating real-world results...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const simulateResponse = await fetch('/api/simulate-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          output: generateData.output,
          scenario: scenario
        })
      });

      if (!simulateResponse.ok) {
        throw new Error('Simulation failed');
      }

      const simulateData = await simulateResponse.json();
      setSimulation(simulateData.simulation);

      setGenerationStep('Evaluating your prompt...');
      await new Promise(resolve => setTimeout(resolve, 800));

      const evaluateResponse = await fetch('/api/evaluate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: fullPrompt,
          promptComponents: {
            context: promptValues.context,
            format: promptValues.format,
            audience: promptValues.audience,
            constraints: promptValues.constraints,
            goal: promptValues.goal
          },
          scenario: scenario,
          difficulty: selectedDifficulty
        })
      });

      if (!evaluateResponse.ok) {
        throw new Error('Evaluation failed');
      }

      const evaluateData = await evaluateResponse.json();
      setEvaluation(evaluateData.evaluation);

      const scenarioLabel = scenario?.title || scenario?.requirement || 'Scenario';
      saveToLeaderboard(evaluateData.evaluation.score, `${config.leaderboardTag} • ${scenarioLabel}`);

      setIsGenerating(false);
      setStage('results');
    } catch (error) {
      console.error('Error in generation pipeline:', error);
      alert('Something went wrong. Please try again.');
      setIsGenerating(false);
      setStage('write-prompt');
    }
  };

  const handleRestart = () => {
    resetPromptState();
    setUserTopic('');
    setScenario(null);
    setStage('topic-input');
  };

  const replayScenario = () => {
    resetPromptState();
    setStage('write-prompt');
  };

  const startNewScenario = () => {
    resetPromptState();
    setUserTopic('');
    setScenario(null);
    setStage('topic-input');
  };

  const showLeaderboard = () => setStage('leaderboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto mb-6 px-4">
        <div className="text-center">
          <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${config.badgeColor}`}>
            {config.ribbon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{config.label} Freestyle Challenge</h1>
          <p className="text-gray-600">{config.hero}</p>
        </div>
      </div>

      {stage === 'topic-input' && (
        <TopicInput
          config={config}
          userTopic={userTopic}
          onTopicChange={setUserTopic}
          onGenerate={generateScenario}
        />
      )}

      {stage === 'loading' && <ScenarioLoading />}

      {stage === 'scenario' && (
        <ScenarioView
          scenario={scenario}
          config={config}
          onStartWrite={() => setStage('write-prompt')}
          onReset={startNewScenario}
        />
      )}

      {stage === 'write-prompt' && (
        <PromptBuilder
          scenario={scenario}
          config={config}
          selectedDifficulty={selectedDifficulty}
          ingredientPresets={ingredientPresets}
          chipRule={activeChipRule}
          chipsPlayed={chipsPlayed}
          showHints={showHints}
          onToggleHints={() => setShowHints(!showHints)}
          allHints={allHints}
          promptIngredients={promptIngredients}
          baseFieldsFilled={baseFieldsFilled}
          buildFullPrompt={buildFullPrompt}
          readyToGenerate={readyToGenerate}
          handleGenerate={handleGenerate}
          onBackToScenario={() => setStage('scenario')}
          difficultyFieldOrder={difficultyFieldOrder}
        />
      )}

      {stage === 'generating' && <GeneratingState generationStep={generationStep} />}

      {stage === 'results' && (
        <ResultsView
          evaluation={evaluation}
          scenario={scenario}
          simulation={simulation}
          generatedOutput={generatedOutput}
          onReplay={replayScenario}
          onNewScenario={startNewScenario}
          onShowLeaderboard={showLeaderboard}
        />
      )}

      {stage === 'leaderboard' && <LeaderboardView leaderboard={leaderboard} onRestart={handleRestart} />}
    </div>
  );
};

export default Round3Game;
