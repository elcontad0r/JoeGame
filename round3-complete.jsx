import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Sparkles, Zap, Trophy, TrendingUp, CheckCircle, Lightbulb, ArrowRight, RefreshCw, Edit2, ChevronUp } from 'lucide-react';

const ingredientColors = {
  context: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', label: 'bg-orange-200 text-orange-900' },
  format: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', label: 'bg-yellow-200 text-yellow-900' },
  audience: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', label: 'bg-green-200 text-green-900' },
  constraints: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', label: 'bg-blue-200 text-blue-900' },
  goal: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', label: 'bg-purple-200 text-purple-900' }
};

const difficultyConfig = {
  easy: {
    label: 'Easy',
    ribbon: 'Level 1 • Guided remix',
    hero: 'Remix guided ingredients with a simple brief',
    gradient: 'from-green-50 to-blue-50',
    badgeColor: 'bg-green-100 text-green-800',
    leaderboardTag: 'Easy',
    instructions: 'Use the starter details and keep the prompt tight and skimmable.',
    playstyle: 'Pull the right ingredients, snap them together, and keep it short.',
    hintExtras: [
      'Pull 2-3 concrete facts from the scenario into your context.',
      'Say exactly what format you want back. Keep it short.'
    ]
  },
  medium: {
    label: 'Medium',
    ribbon: 'Level 2 • Guided + custom',
    hero: 'Blend options with your own spin',
    gradient: 'from-orange-50 to-amber-50',
    badgeColor: 'bg-orange-100 text-orange-800',
    leaderboardTag: 'Medium',
    instructions: 'Mix chips with your own edits. Add a guardrail or tone choice.',
    playstyle: 'Stack chips, then add the missing constraints and tradeoffs.',
    hintExtras: [
      'Name one thing you’re adding beyond the provided details.',
      'Point to what should be prioritized if tradeoffs appear.'
    ]
  },
  hard: {
    label: 'Hard',
    ribbon: 'Level 3 • Freeform flow',
    hero: 'You set the guardrails and the tone',
    gradient: 'from-purple-50 to-pink-50',
    badgeColor: 'bg-purple-100 text-purple-800',
    leaderboardTag: 'Hard',
    instructions: 'No scaffolding. You own the structure, tone, and constraints.',
    playstyle: 'Design the sections, define success, and call out one risk.',
    hintExtras: [
      'Lay out 2-3 sections in the order you want them.',
      'Call out one risk/sensitivity and how to handle it.'
    ]
  }
};

const chipRules = {
  easy: {
    perFieldLimit: 2,
    minTotalSelections: 4,
    label: 'Play at least 4 chips (max 2 per category) before you write your goal.'
  },
  medium: {
    perFieldLimit: 3,
    minTotalSelections: 5,
    label: 'Draft with at least 5 chips (max 3 per category), then layer your own constraints.'
  },
  hard: {
    perFieldLimit: 0,
    minTotalSelections: 0,
    label: 'No chips here—everything is freeform.'
  }
};

const IngredientField = ({ field, number, title, placeholder, value, onChange, hint, collapsed, onToggleCollapse, presets = [], onPresetSelect, selectedPresets, difficulty, perFieldLimit }) => {
  const isCollapsed = collapsed[field];
  const colors = ingredientColors[field];
  const hasContent = value.trim().length > 0;
  const selectedIds = selectedPresets?.[field] || [];
  const remainingSlots = Math.max(perFieldLimit - selectedIds.length, 0);

  if (isCollapsed && hasContent) {
    return (
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 mb-4`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-block ${colors.label} px-2 py-0.5 rounded text-xs font-bold mb-2`}>
              {number}. {title}
            </div>
            <p className={`text-sm ${colors.text} font-medium line-clamp-2`}>
              {value}
            </p>
          </div>
          <button
            onClick={() => onToggleCollapse(field)}
            className={`${colors.text} hover:opacity-70 p-2 ml-2 flex-shrink-0`}
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {number}
          </span>
          <label className="font-semibold text-gray-900">{title}</label>
        </div>
        {hasContent && (
          <button
            onClick={() => onToggleCollapse(field)}
            className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
            title="Collapse"
          >
            <ChevronUp size={18} />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-600 mb-2">{hint}</p>

      {difficulty !== 'hard' && presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((preset) => {
            const isSelected = selectedIds.includes(preset.id);
            return (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(field, preset)}
                className={`rounded-lg border px-3 py-2 text-left transition-all text-sm ${
                  isSelected
                    ? `${colors.bg} ${colors.border} border-2 text-gray-900 shadow-sm`
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold text-xs mb-1 text-gray-900 flex items-center gap-2">
                  <span className={`${colors.label} px-2 py-0.5 rounded`}>{preset.label}</span>
                  {preset.tone && <span className="text-[10px] uppercase tracking-wide text-gray-500">{preset.tone}</span>}
                  {isSelected && <span className="text-[10px] text-green-700">Locked</span>}
                </div>
                <p className="text-xs text-gray-700 leading-snug">{preset.snippet}</p>
              </button>
            );
          })}
        </div>
      )}

      {difficulty !== 'hard' && perFieldLimit > 0 && (
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
            {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} left in this category
          </span>
          {selectedIds.length > 0 && <span className="text-gray-400">Tap a new chip to stack more detail.</span>}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (hasContent) {
            onToggleCollapse(field);
          }
        }}
        placeholder={placeholder}
        className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm resize-none"
      />
    </div>
  );
};

// Simple markdown parser for generated content
const renderMarkdown = (text) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  
  lines.forEach((line, idx) => {
    // Headers
    if (line.startsWith('### ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<h3 key={idx} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<h2 key={idx} className="text-xl font-bold mt-4 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<h1 key={idx} className="text-2xl font-bold mt-4 mb-3">{line.slice(2)}</h1>);
    }
    // Bullet points
    else if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
      const text = line.trim().slice(2);
      currentList.push(<li key={idx}>{parseBold(text)}</li>);
    }
    // Empty line
    else if (line.trim() === '') {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
    }
    // Regular paragraph
    else if (line.trim()) {
      if (currentList.length > 0) {
        elements.push(<ul key={`list-${idx}`} className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
        currentList = [];
      }
      elements.push(<p key={idx} className="mb-3 leading-relaxed">{parseBold(line)}</p>);
    }
  });
  
  // Don't forget any remaining list items
  if (currentList.length > 0) {
    elements.push(<ul key="list-final" className="list-disc pl-6 mb-4 space-y-1">{currentList}</ul>);
  }
  
  return elements;
};

// Helper to parse **bold** text
const parseBold = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// Simple version - just double quotes
const highlightQuotes = (text) => {
  if (!text) return text;
  
  const parts = [];
  const segments = text.split('"');
  
  segments.forEach((segment, idx) => {
    if (idx % 2 === 1) {
      // Odd indices are inside quotes
      parts.push(
        <span key={idx} className="bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded font-semibold italic">
          "{segment}"
        </span>
      );
    } else {
      // Even indices are outside quotes
      parts.push(segment);
    }
  });
  
  return parts;
};

const Round3Game = ({ onBack, difficulty = 'easy' }) => {
  const selectedDifficulty = difficulty;
  const config = difficultyConfig[selectedDifficulty] || difficultyConfig.easy;
  const chipRule = chipRules[selectedDifficulty] || chipRules.easy;
  const [stage, setStage] = useState('topic-input');
  const [userTopic, setUserTopic] = useState('');
  const [scenario, setScenario] = useState(null);
  const [promptContext, setPromptContext] = useState('');
  const [promptFormat, setPromptFormat] = useState('');
  const [promptAudience, setPromptAudience] = useState('');
  const [promptConstraints, setPromptConstraints] = useState('');
  const [promptGoal, setPromptGoal] = useState('');
  const [selectedPresets, setSelectedPresets] = useState({
    context: [],
    format: [],
    audience: [],
    constraints: [],
    goal: []
  });
  const [collapsed, setCollapsed] = useState({
    context: false,
    format: false,
    audience: false,
    constraints: false,
    goal: false
  });
  const [userPrompt, setUserPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const ingredientValues = {
    context: promptContext,
    format: promptFormat,
    audience: promptAudience,
    constraints: promptConstraints,
    goal: promptGoal
  };

  const ingredientSetters = {
    context: setPromptContext,
    format: setPromptFormat,
    audience: setPromptAudience,
    constraints: setPromptConstraints,
    goal: setPromptGoal
  };

  const difficultyFieldOrder = {
    easy: ['context', 'audience', 'goal'],
    medium: ['context', 'format', 'audience', 'goal'],
    hard: ['context', 'format', 'audience', 'constraints', 'goal']
  };

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

  // Build full prompt from components
  const buildFullPrompt = () => {
    const parts = [];
    
    if (promptContext) parts.push(`CONTEXT: ${promptContext}`);
    if (promptFormat) parts.push(`FORMAT: ${promptFormat}`);
    if (promptAudience) parts.push(`AUDIENCE: ${promptAudience}`);
    if (promptConstraints) parts.push(`CONSTRAINTS: ${promptConstraints}`);
    if (promptGoal) parts.push(`GOAL: ${promptGoal}`);
    
    if (parts.length === 0) return '';

    return parts.join('\n\n');
  };

  const applyPresetToField = (field, preset) => {
    const setter = ingredientSetters[field];
    const currentValue = ingredientValues[field] || '';
    if (!setter || !preset?.snippet) return;

    const currentSelections = selectedPresets[field] || [];
    const limit = chipRule.perFieldLimit || 0;
    if (limit > 0 && !currentSelections.includes(preset.id) && currentSelections.length >= limit) {
      alert(`You already locked ${limit} chip${limit === 1 ? '' : 's'} for ${field}. Clear a slot by editing the text, or switch fields.`);
      return;
    }

    const alreadyIncluded = currentValue.toLowerCase().includes(preset.snippet.toLowerCase());
    const updatedValue = alreadyIncluded
      ? currentValue
      : currentValue.trim().length > 0
        ? `${currentValue.trim()}\n${preset.snippet}`
        : preset.snippet;

    setter(updatedValue);
    if (!currentSelections.includes(preset.id)) {
      setSelectedPresets(prev => ({ ...prev, [field]: [...currentSelections, preset.id] }));
    }
  };

  useEffect(() => {
    setSelectedPresets({
      context: [],
      format: [],
      audience: [],
      constraints: [],
      goal: []
    });
  }, [selectedDifficulty]);

  useEffect(() => {
    setSelectedPresets({
      context: [],
      format: [],
      audience: [],
      constraints: [],
      goal: []
    });
  }, [scenario]);

  const chipsPlayed = Object.values(selectedPresets).reduce((sum, list) => sum + (list?.length || 0), 0);
  const baseFieldsFilled = promptContext && promptFormat && promptAudience && promptConstraints && promptGoal;
  const readyToGenerate = baseFieldsFilled && chipsPlayed >= (chipRule.minTotalSelections || 0);

  useEffect(() => {
    loadLeaderboard();
  }, []);

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
      category: "Context",
      questions: ["What does Claude need to know about the company?", "What are the specific facts?", "What's at stake?"]
    },
    {
      category: "Format",
      questions: ["What structure works best?", "How long should it be?", "Any specific sections needed?"]
    },
    {
      category: "Audience",
      questions: ["Who's reading this?", "What's their perspective?", "What tone will land?"]
    },
    {
      category: "Constraints",
      questions: ["What must be avoided?", "What are the limitations?", "Any specific requirements?"]
    },
    {
      category: "Goal",
      questions: ["What's the desired outcome?", "What action should they take?", "How will success be measured?"]
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

  const getScoreColor = (score) => {
    if (score >= 18) return 'text-green-600';
    if (score >= 15) return 'text-blue-600';
    if (score >= 12) return 'text-yellow-600';
    return 'text-orange-600';
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
            context: promptContext,
            format: promptFormat,
            audience: promptAudience,
            constraints: promptConstraints,
            goal: promptGoal
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

  const toggleCollapse = (field) => {
    setCollapsed(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderTopicInput = () => {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-200">
          <div className="text-center mb-6">
            <Lightbulb className="mx-auto mb-4 text-purple-600" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Make it relevant</h2>
            <p className="text-gray-600">What project or topic are you working on right now? We'll tailor an {config.label.toLowerCase()} scenario to match.</p>
            <p className="text-xs text-gray-500 mt-2">{config.instructions}</p>
          </div>

          <textarea
            value={userTopic}
            onChange={(e) => setUserTopic(e.target.value)}
            placeholder="e.g., 'Customer onboarding for new CRM rollout' or 'Back-to-school email for parents' or 'leave blank for a surprise scenario'"
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm resize-none mb-4"
          />

          <button
            onClick={() => generateScenario(userTopic)}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            Generate My Scenario
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 font-medium">Creating your scenario...</p>
        </div>
      </div>
    );
  };

  const renderScenario = () => {
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
              onClick={() => setStage('write-prompt')}
              className="flex-1 bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              Start Building My Prompt
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => {
                setUserTopic('');
                setStage('topic-input');
              }}
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

  const renderWritePrompt = () => {
    const activePresets = ingredientPresets[selectedDifficulty] || ingredientPresets.easy;
    const chipRule = scenario?.chipRule || { minTotalSelections: 0 };
    const totalChipSelections = Object.values(selectedPresets).filter(Boolean).length;
    const shouldShowChipSections =
      selectedDifficulty !== 'hard' && (chipRule?.minTotalSelections ?? 0) > 0;
    const difficultyCopy = {
      easy: {
        title: 'Easy',
        description: 'Use suggested ingredient chips to remix Round 2 and get unstuck fast.'
      },
      medium: {
        title: 'Medium',
        description: 'Still get scaffolding, but add your own spin by combining chips.'
      },
      hard: {
        title: 'Hard',
        description: 'No chips, no hints—freeform drafting for leaderboard glory.'
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Scenario reminder */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <Zap className="text-orange-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 mb-2">Your Scenario</h3>
              <p className="text-sm text-orange-800 leading-relaxed mb-3">
                {scenario?.situation}
              </p>
              <div className="bg-white border-l-4 border-orange-400 rounded p-3">
                <p className="text-xs font-semibold text-orange-900 mb-1">Your challenge:</p>
                <p className="text-sm text-orange-800">{scenario?.requirement}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6 mb-6 border border-purple-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Build Your Prompt</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800 mb-4">
            <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
              <p className="font-semibold text-purple-900 mb-1">Level style</p>
              <p className="leading-snug">{config.playstyle}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
              <p className="font-semibold text-orange-900 mb-1">Keep in mind</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{config.instructions}</li>
                <li>Keep it scannable; avoid filler words.</li>
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-dashed border-purple-300 mb-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-purple-900">Chip draft</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                {Math.min(chipsPlayed, chipRule.minTotalSelections || 0)} / {chipRule.minTotalSelections || 0} needed
              </span>
              {chipRule.perFieldLimit > 0 && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  Max {chipRule.perFieldLimit} per category
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{chipRule.label}</p>
            {chipRule.minTotalSelections > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-2 transition-all"
                  style={{ width: `${Math.min(100, Math.round((chipsPlayed / chipRule.minTotalSelections) * 100))}%` }}
                ></div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2"
          >
            <Lightbulb size={16} />
            {showHints ? 'Hide' : 'Show'} helpful questions
          </button>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="text-green-600" size={18} />
            <p className="font-semibold text-gray-900">Task block</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs uppercase font-bold text-green-800 mb-1">Deliverable</p>
              <p className="leading-snug">{scenario?.requirement || 'Spell out what you need written or outlined.'}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs uppercase font-bold text-blue-800 mb-1">Timing</p>
              <p className="leading-snug">{scenario?.urgency || 'Note when this is due and why the timing matters.'}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs uppercase font-bold text-purple-800 mb-1">Audience</p>
              <p className="leading-snug">{scenario?.sector ? `Write for folks in ${scenario.sector}.` : 'Call out who will read this.'}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-xs uppercase font-bold text-orange-800 mb-1">Must include</p>
              <p className="leading-snug">{scenario?.focus || 'Include the key facts from the scenario without adding extras.'}</p>
            </div>
          </div>
        </div>

        {/* Hints section */}
        {showHints && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Questions to guide you:</h3>
            <div className="grid gap-4">
              {allHints.map((hint, idx) => (
                <div key={idx} className="border-l-4 border-purple-300 pl-4">
                  <p className="font-semibold text-purple-900 mb-2">{hint.category}</p>
                  <ul className="space-y-1">
                    {hint.questions.map((q, qIdx) => (
                      <li key={qIdx} className="text-sm text-gray-600">• {q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg border border-amber-200 p-4 mb-6">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-semibold text-sm">
                <Lightbulb size={16} /> Quick nudges
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {(mediumHintList.length > 0 ? mediumHintList : ['Call out one priority to balance tradeoffs.', 'Add a format or tone detail that matters for the audience.']).map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {shouldShowChipSections && (
          <div className="bg-white rounded-lg border-2 border-orange-200 p-5 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-orange-500" size={18} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Chip draft progress</p>
                <p className="text-xs text-gray-600">
                  {totalChipSelections} / {chipRule.minTotalSelections} chips played
                </p>
              </div>
            </div>

            {totalChipSelections < chipRule.minTotalSelections ? (
              <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md p-3">
                Play at least {chipRule.minTotalSelections} preset chips to level up this draft.
              </p>
            ) : (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
                Nice! You’ve explored enough chips—keep refining the text before generating.
              </p>
            )}
          </div>
        )}

        {/* Ingredient fields */}
        <div className="mb-6">
          <IngredientField
            field="context"
            number={1}
            title="Context"
            placeholder="What background information does Claude need?"
            hint="Set the stage. What's happening? What's the company? What's the situation?"
            value={promptContext}
            onChange={setPromptContext}
            presets={activePresets?.context || []}
            onPresetSelect={applyPresetToField}
            selectedPresets={selectedPresets}
            difficulty={selectedDifficulty}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            perFieldLimit={chipRule.perFieldLimit}
          />

          <IngredientField
            field="format"
            number={2}
            title="Format"
            placeholder="What structure should the output have?"
            hint="Be specific about length, style, sections, or structure."
            value={promptFormat}
            onChange={setPromptFormat}
            presets={activePresets?.format || []}
            onPresetSelect={applyPresetToField}
            selectedPresets={selectedPresets}
            difficulty={selectedDifficulty}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            perFieldLimit={chipRule.perFieldLimit}
          />

          <IngredientField
            field="audience"
            number={3}
            title="Audience"
            placeholder="Who will read this and what do they care about?"
            hint="Who's this for? What's their perspective? What tone will work?"
            value={promptAudience}
            onChange={setPromptAudience}
            presets={activePresets?.audience || []}
            onPresetSelect={applyPresetToField}
            selectedPresets={selectedPresets}
            difficulty={selectedDifficulty}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            perFieldLimit={chipRule.perFieldLimit}
          />

          <IngredientField
            field="constraints"
            number={4}
            title="Constraints"
            placeholder="What should be avoided or what are the limits?"
            hint="What can't you say? What must be avoided? Any requirements or limitations?"
            value={promptConstraints}
            onChange={setPromptConstraints}
            presets={activePresets?.constraints || []}
            onPresetSelect={applyPresetToField}
            selectedPresets={selectedPresets}
            difficulty={selectedDifficulty}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            perFieldLimit={chipRule.perFieldLimit}
          />

          <IngredientField
            field="goal"
            number={5}
            title="Goal"
            placeholder="What should this accomplish?"
            hint="What's the desired outcome? What action should readers take? How do you measure success?"
            value={promptGoal}
            onChange={setPromptGoal}
            presets={activePresets?.goal || []}
            onPresetSelect={applyPresetToField}
            selectedPresets={selectedPresets}
            difficulty={selectedDifficulty}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            perFieldLimit={chipRule.perFieldLimit}
          />
        </div>

        {/* Preview */}
        {baseFieldsFilled && (
          <div className="bg-white rounded-lg border-2 border-purple-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="text-purple-600" size={20} />
              Your Complete Prompt
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {buildFullPrompt()}
            </div>
          </div>
        )}

        {/* Generate button */}
        {!readyToGenerate && chipRule.minTotalSelections > 0 && (
          <p className="text-xs text-orange-700 mb-2">Play at least {chipRule.minTotalSelections} chips and fill each ingredient before generating.</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => setStage('scenario')}
            className="bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Scenario
          </button>
          <button
            onClick={handleGenerate}
            disabled={!readyToGenerate}
            className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
              readyToGenerate
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Zap size={20} />
            Generate & See Results
          </button>
        </div>

        {shouldShowChipSections && totalChipSelections < chipRule.minTotalSelections && (
          <div className="mt-3 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md p-3 flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5" />
            <p className="leading-snug">Play chips before generating to meet the level requirements.</p>
          </div>
        )}
      </div>
    );
  };

  const renderGenerating = () => {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 font-medium mb-2">{generationStep}</p>
          <p className="text-sm text-gray-500">This may take a moment...</p>
        </div>
      </div>
    );
  };

  const getScoreBgColor = (score) => {
    if (score >= 85) return 'bg-green-50 border-green-300';
    if (score >= 70) return 'bg-blue-50 border-blue-300';
    if (score >= 50) return 'bg-yellow-50 border-yellow-300';
    return 'bg-orange-50 border-orange-300';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Expert';
    if (score >= 70) return 'Proficient';
    if (score >= 50) return 'Developing';
    return 'Needs Work';
  };

  const renderResults = () => {
    if (!evaluation || !scenario || !simulation || !generatedOutput) return null;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Scenario reference - compact */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 border border-gray-300">
          <p className="text-xs text-gray-600 uppercase font-semibold mb-0.5">Scenario</p>
          <p className="text-sm font-semibold text-gray-900">{scenario.title}</p>
        </div>

        {/* What Claude Generated - now at top, open by default */}
        <details open className="bg-white rounded-lg shadow-md border-2 border-purple-200 mb-6">
          <summary className="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            What Claude Generated
            <span className="ml-auto text-gray-400 text-sm">Click to collapse</span>
          </summary>
          <div className="p-6 border-t border-gray-200">
            <div className="text-gray-800">
              {renderMarkdown(generatedOutput.content)}
            </div>
          </div>
        </details>

        {/* THE REVEAL - Simulation first (the payoff) */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎬</span>
            <h2 className="text-2xl font-bold text-orange-900">What Happened</h2>
          </div>

          {/* First Gate */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-sm">First Gate</span>
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {highlightQuotes(simulation.first_gate)}
            </p>
          </div>

          {/* Where it Goes */}
          {simulation.where_it_goes && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-sm">The Real Test</span>
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {highlightQuotes(simulation.where_it_goes)}
              </p>
            </div>
          )}

          {/* Consequences */}
          {simulation.consequences && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm">The Fallout</span>
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {highlightQuotes(simulation.consequences)}
              </p>
            </div>
          )}

          {/* Best Quote */}
          {simulation.best_quote && (
            <div className="mt-4 pt-4 border-t-2 border-orange-300">
              <p className="text-xs font-semibold text-orange-900 uppercase mb-2">Quote of the Day</p>
              <blockquote className="text-base italic text-gray-900 font-medium">
                "{simulation.best_quote}"
              </blockquote>
            </div>
          )}
        </div>

        {/* Score - simplified, more visual */}
        <div className={`rounded-xl p-6 mb-6 border-2 ${getScoreBgColor(evaluation.score)}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Your Score</h2>
              <p className={`text-base font-semibold ${getScoreColor(evaluation.score)}`}>
                {getScoreLabel(evaluation.score)}
              </p>
            </div>
            <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(evaluation.score)}`}>
              {evaluation.score}
            </div>
          </div>
          
          {/* Score bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                evaluation.score >= 85 ? 'bg-green-500' :
                evaluation.score >= 70 ? 'bg-blue-500' :
                evaluation.score >= 50 ? 'bg-yellow-500' :
                'bg-orange-500'
              }`}
              style={{ width: `${evaluation.score}%` }}
            />
          </div>
        </div>

        {/* What Went Wrong - new section */}
        {simulation.analysis && (
          <details open className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
            <summary className="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-600" />
              What Went Wrong (or Right)
              <span className="ml-auto text-gray-400 text-sm">Click to collapse</span>
            </summary>
            <div className="p-4 border-t border-gray-200">
              <p className="text-gray-800 leading-relaxed">
                {simulation.analysis}
              </p>
            </div>
          </details>
        )}

        {/* Why it happened - ingredient breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h3 className="font-bold text-xl mb-4 text-gray-900">Why It Went That Way</h3>
          <p className="text-gray-600 text-sm mb-6">Here's how each part of your prompt affected the outcome:</p>
          
          <div className="space-y-3">
            {evaluation.ingredients?.context && (
              <div className={`${ingredientColors.context.bg} border-2 ${ingredientColors.context.border} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`${ingredientColors.context.label} px-3 py-1 rounded text-xs font-bold`}>
                    Context
                  </div>
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
                  <div className={`${ingredientColors.format.label} px-3 py-1 rounded text-xs font-bold`}>
                    Format
                  </div>
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
                  <div className={`${ingredientColors.audience.label} px-3 py-1 rounded text-xs font-bold`}>
                    Audience
                  </div>
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
                  <div className={`${ingredientColors.constraints.label} px-3 py-1 rounded text-xs font-bold`}>
                    Constraints
                  </div>
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
                  <div className={`${ingredientColors.goal.label} px-3 py-1 rounded text-xs font-bold`}>
                    Goal
                  </div>
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

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-xl shadow-lg p-6 sm:p-8 text-center border border-purple-200">
          <Trophy className="mx-auto mb-4 text-orange-600" size={48} />
          <h3 className="text-2xl font-bold mb-3 text-gray-900">Round Complete</h3>
          <p className="text-gray-700 mb-6">
            {evaluation.score >= 75 
              ? "Strong work. Try a new scenario to test your skills."
              : "Keep practicing. Each scenario will help you improve."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setStage('write-prompt');
                setPromptContext('');
                setPromptFormat('');
                setPromptAudience('');
                setPromptConstraints('');
                setPromptGoal('');
                setCollapsed({
                  context: false,
                  format: false,
                  audience: false,
                  constraints: false,
                  goal: false
                });
                setUserPrompt('');
                setGeneratedOutput(null);
                setSimulation(null);
                setEvaluation(null);
                setGenerationStep('');
              }}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Try This Scenario Again
            </button>
            <button
              onClick={() => {
                setUserTopic('');
                setStage('topic-input');
                setPromptContext('');
                setPromptFormat('');
                setPromptAudience('');
                setPromptConstraints('');
                setPromptGoal('');
                setCollapsed({
                  context: false,
                  format: false,
                  audience: false,
                  constraints: false,
                  goal: false
                });
                setUserPrompt('');
                setGeneratedOutput(null);
                setSimulation(null);
                setEvaluation(null);
                setGenerationStep('');
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              New Scenario
            </button>
            <button
              onClick={() => setStage('leaderboard')}
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

  const renderLeaderboard = () => {
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
                      idx === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400' :
                      idx === 1 ? 'bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300' :
                      idx === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300' :
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-500 text-white' :
                        idx === 1 ? 'bg-gray-400 text-white' :
                        idx === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>{animal}</span>
                          <span>Player {(entry.id % 1000).toString().padStart(3, '0')}</span>
                        </div>
                        <div className="text-xs text-gray-600">{entry.scenarioType}{entry.difficulty ? ` • ${entry.difficulty}` : ''} • {new Date(entry.timestamp).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold ${
                      entry.score >= 85 ? 'text-green-600' :
                      entry.score >= 70 ? 'text-blue-600' :
                      entry.score >= 50 ? 'text-yellow-600' :
                      'text-orange-600'
                    }`}>
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
            onClick={() => {
              setUserTopic('');
              setStage('topic-input');
              setPromptContext('');
              setPromptFormat('');
              setPromptAudience('');
              setPromptConstraints('');
              setPromptGoal('');
              setCollapsed({
                context: false,
                format: false,
                audience: false,
                constraints: false,
                goal: false
              });
              setUserPrompt('');
              setGeneratedOutput(null);
              setSimulation(null);
              setEvaluation(null);
              setGenerationStep('');
            }}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Try Another Scenario
          </button>
        </div>
      </div>
    );
  };

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

      {stage === 'topic-input' && renderTopicInput()}
      {stage === 'loading' && renderLoading()}
      {stage === 'scenario' && renderScenario()}
      {stage === 'write-prompt' && renderWritePrompt()}
      {stage === 'generating' && renderGenerating()}
      {stage === 'results' && renderResults()}
      {stage === 'leaderboard' && renderLeaderboard()}
    </div>
  );
};

export default Round3Game;
