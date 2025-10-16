import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Sparkles, Zap, Trophy, TrendingUp, CheckCircle, Lightbulb, ArrowRight, RefreshCw, Edit2, ChevronDown, ChevronRight } from 'lucide-react';

const ingredientColors = {
  context: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', label: 'bg-orange-200 text-orange-900' },
  format: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', label: 'bg-yellow-200 text-yellow-900' },
  audience: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', label: 'bg-green-200 text-green-900' },
  constraints: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', label: 'bg-blue-200 text-blue-900' },
  goal: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', label: 'bg-purple-200 text-purple-900' }
};

const ProgressiveIngredient = ({ 
  field, 
  number, 
  title, 
  hint, 
  placeholder, 
  value, 
  onChange,
  isActive,
  isCompleted,
  onComplete,
  onExpand
}) => {
  const colors = ingredientColors[field];
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isActive]);

  // Completed collapsed state
  if (isCompleted && !isActive) {
    return (
      <div 
        className={`${colors.bg} border-l-4 ${colors.border} rounded-r-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-all`}
        onClick={onExpand}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`${colors.label} w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
              {number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-gray-900 mb-1">{title}</div>
              <p className={`text-xs ${colors.text} line-clamp-2`}>
                {value}
              </p>
            </div>
          </div>
          <ChevronDown size={18} className={`${colors.text} flex-shrink-0 mt-1`} />
        </div>
      </div>
    );
  }

  // Not started yet (locked)
  if (!isActive && !isCompleted) {
    return (
      <div className="bg-gray-100 border-l-4 border-gray-300 rounded-r-lg p-4 mb-3 opacity-60">
        <div className="flex items-center gap-3">
          <div className="bg-gray-300 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
            {number}
          </div>
          <div className="font-semibold text-sm text-gray-600">{title}</div>
        </div>
      </div>
    );
  }

  // Active/editing state
  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-5 mb-3 shadow-lg transition-all`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`${colors.label} w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
          {number}
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{hint}</p>
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-32 p-3 border-2 ${colors.border} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-sm resize-none transition-all`}
      />
      
      {value.trim() && (
        <div className="flex justify-end mt-3">
          <button
            onClick={onComplete}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const Round3Game = ({ onBack }) => {
  const [stage, setStage] = useState('loading');
  const [scenario, setScenario] = useState(null);
  const [promptContext, setPromptContext] = useState('');
  const [promptFormat, setPromptFormat] = useState('');
  const [promptAudience, setPromptAudience] = useState('');
  const [promptConstraints, setPromptConstraints] = useState('');
  const [promptGoal, setPromptGoal] = useState('');
  const [activeIngredient, setActiveIngredient] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [simulation, setSimulation] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  const ingredients = [
    { field: 'context', value: promptContext, setter: setPromptContext },
    { field: 'format', value: promptFormat, setter: setPromptFormat },
    { field: 'audience', value: promptAudience, setter: setPromptAudience },
    { field: 'constraints', value: promptConstraints, setter: setPromptConstraints },
    { field: 'goal', value: promptGoal, setter: setPromptGoal }
  ];

  const ingredientConfigs = [
    { 
      field: 'context', 
      title: 'Context', 
      hint: 'What specific details does Claude need?',
      placeholder: 'e.g., "Company: MidAtlantic Manufacturing, 12 facilities (PA/OH/WV), 2,400 employees, $38-42M investment needed..."'
    },
    { 
      field: 'format', 
      title: 'Format', 
      hint: 'What structure and style should the output have?',
      placeholder: 'e.g., "Press statement format with clear sections, bullet points for key facts, under 300 words"'
    },
    { 
      field: 'audience', 
      title: 'Audience', 
      hint: 'Who will read this and what do they need?',
      placeholder: 'e.g., "Media/journalists covering business and policy, need credible facts and company perspective"'
    },
    { 
      field: 'constraints', 
      title: 'Constraints', 
      hint: 'Time limits, length requirements, approval process...',
      placeholder: 'e.g., "CEO needs to read in 2 minutes before press call, must avoid technical jargon"'
    },
    { 
      field: 'goal', 
      title: 'Goal', 
      hint: 'What outcome do you want?',
      placeholder: 'e.g., "Position company as responsible corporate citizen seeking reasonable implementation timeline, not exemption"'
    }
  ];

  const scrollToElement = (index) => {
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-ingredient]');
      if (elements[index]) {
        elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleComplete = (index) => {
    if (index < ingredients.length - 1) {
      setActiveIngredient(index + 1);
      scrollToElement(index + 1);
    }
  };

  const handleExpand = (index) => {
    setActiveIngredient(index);
    scrollToElement(index);
  };

  const buildFullPrompt = () => {
    const parts = [];
    
    if (promptContext) parts.push(`CONTEXT: ${promptContext}`);
    if (promptFormat) parts.push(`FORMAT: ${promptFormat}`);
    if (promptAudience) parts.push(`AUDIENCE: ${promptAudience}`);
    if (promptConstraints) parts.push(`CONSTRAINTS: ${promptConstraints}`);
    if (promptGoal) parts.push(`GOAL: ${promptGoal}`);
    
    if (parts.length === 0) return '';
    
    return `Create ${scenario?.requirement || 'content'} for this situation: ${scenario?.situation || ''}

${parts.join('\n\n')}`;
  };

  const allFieldsFilled = promptContext && promptFormat && promptAudience && promptConstraints && promptGoal;

  const formatSimulation = (text) => {
    if (!text) return '';
    
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Match section headers including markdown bold markers
      if (trimmed.match(/^(\*\*)?[1-3]\.?\s*(\*\*)?\s*(THE |WHERE )/i) || 
          trimmed.match(/^(\*\*)?(THE FIRST GATE|WHERE IT GOES|THE CONSEQUENCES)(\*\*)?/i)) {
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Clean up the header - remove markdown and numbering
        let cleanHeader = trimmed
          .replace(/^\*\*/g, '')
          .replace(/\*\*$/g, '')
          .replace(/^[1-3]\.?\s*/g, '');
        
        let type = 'default';
        if (trimmed.match(/FIRST GATE|1\./i)) {
          type = 'gate';
        } else if (trimmed.match(/WHERE IT GOES|2\./i)) {
          type = 'destination';
        } else if (trimmed.match(/CONSEQUENCES|3\./i)) {
          type = 'consequences';
        }
        
        currentSection = { 
          header: cleanHeader,
          content: [],
          type
        };
      } else if (trimmed && currentSection) {
        currentSection.content.push(trimmed);
      } else if (trimmed && !currentSection) {
        if (!sections.length || sections[sections.length - 1].type !== 'intro') {
          sections.push({ type: 'intro', content: [trimmed] });
        } else {
          sections[sections.length - 1].content.push(trimmed);
        }
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    const findQuotes = (text) => {
      const quoteMatch = text.match(/[""]([^""]+)[""]/);
      if (quoteMatch) {
        return {
          before: text.substring(0, quoteMatch.index),
          quote: quoteMatch[1],
          after: text.substring(quoteMatch.index + quoteMatch[0].length)
        };
      }
      return null;
    };
    
    return (
      <div className="space-y-5">
        {sections.map((section, idx) => {
          if (section.type === 'intro') {
            return (
              <div key={idx} className="text-gray-800 leading-relaxed">
                {section.content.map((line, i) => (
                  <p key={i} className="mb-3 text-base">{line}</p>
                ))}
              </div>
            );
          }
          
          const colorScheme = {
            gate: { 
              bg: 'bg-blue-50', 
              border: 'border-blue-500', 
              dot: 'bg-blue-500',
              text: 'text-blue-900',
              header: 'text-blue-800'
            },
            destination: { 
              bg: 'bg-purple-50', 
              border: 'border-purple-500', 
              dot: 'bg-purple-500',
              text: 'text-purple-900',
              header: 'text-purple-800'
            },
            consequences: { 
              bg: 'bg-orange-50', 
              border: 'border-orange-500', 
              dot: 'bg-orange-500',
              text: 'text-orange-900',
              header: 'text-orange-800'
            },
            default: { 
              bg: 'bg-gray-50', 
              border: 'border-gray-500', 
              dot: 'bg-gray-500',
              text: 'text-gray-900',
              header: 'text-gray-800'
            }
          }[section.type];
          
          const contentText = section.content.join(' ');
          const quoteData = findQuotes(contentText);
          
          return (
            <div key={idx} className={`${colorScheme.bg} border-l-4 ${colorScheme.border} rounded-r-lg p-5`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${colorScheme.dot} w-3 h-3 rounded-full flex-shrink-0`}></div>
                <h4 className={`font-bold ${colorScheme.header} uppercase text-xs tracking-wide`}>
                  {section.header}
                </h4>
              </div>
              
              <div className={`${colorScheme.text} leading-relaxed pl-6`}>
                {quoteData ? (
                  <>
                    {quoteData.before && <p className="mb-4">{quoteData.before}</p>}
                    <blockquote className="bg-white bg-opacity-70 border-l-4 border-gray-400 pl-4 py-3 my-4 italic text-gray-700">
                      "{quoteData.quote}"
                    </blockquote>
                    {quoteData.after && <p className="mt-4">{quoteData.after}</p>}
                  </>
                ) : (
                  section.content.map((line, i) => (
                    <p key={i} className={i < section.content.length - 1 ? 'mb-3' : ''}>
                      {line}
                    </p>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const formatGeneratedContent = (text) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    let lastWasEmpty = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        lastWasEmpty = true;
        if (inList) {
          html += '</ul>\n';
          inList = false;
        }
        continue;
      }
      
      if (inList && !line.match(/^[-•·*]\s/)) {
        html += '</ul>\n';
        inList = false;
      }
      
      if (line.match(/^[-•·*]\s/)) {
        if (!inList) {
          html += '<ul>\n';
          inList = true;
        }
        html += `<li>${line.replace(/^[-•·*]\s/, '')}</li>\n`;
        lastWasEmpty = false;
      }
      else if ((line === line.toUpperCase() && line.split(/\s+/).length >= 2) || 
               (line.length < 50 && line.match(/^[A-Z][^:]*:$/))) {
        html += `<h3 class="font-bold mt-3 mb-1 text-sm">${line}</h3>\n`;
        lastWasEmpty = false;
      }
      else if (line.match(/^[A-Z][A-Z\s]+:/)) {
        const parts = line.split(':');
        html += `<p class="mt-2 text-sm"><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</p>\n`;
        lastWasEmpty = false;
      }
      else {
        const className = lastWasEmpty ? ' class="mt-2 text-sm"' : ' class="text-sm"';
        html += `<p${className}>${line}</p>\n`;
        lastWasEmpty = false;
      }
    }
    
    if (inList) html += '</ul>\n';
    return html;
  };

  useEffect(() => {
    generateScenario();
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
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    const stored = localStorage.getItem('ai-game-leaderboard');
    const current = stored ? JSON.parse(stored) : [];
    const updated = [...current, entry].sort((a, b) => b.score - a.score).slice(0, 50);
    
    localStorage.setItem('ai-game-leaderboard', JSON.stringify(updated));
    setLeaderboard(updated);
  };

  const generateScenario = async () => {
    setStage('loading');
    
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }

      const data = await response.json();
      setScenario(data.scenario);
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
      questions: ["What does Claude need to know?", "What are the specific facts?", "What's at stake?"]
    },
    {
      category: "Format",
      questions: ["What structure works best?", "How long should it be?", "Any specific sections?"]
    },
    {
      category: "Audience",
      questions: ["Who's reading this?", "What's their perspective?", "What tone will land?"]
    },
    {
      category: "Constraints",
      questions: ["Time pressure?", "Length limits?", "Approval requirements?"]
    },
    {
      category: "Goal",
      questions: ["What outcome do you want?", "What should readers believe?", "What's the positioning?"]
    }
  ];

  const handleGenerate = async () => {
    if (!allFieldsFilled) return;
    
    const fullPrompt = buildFullPrompt();
    setUserPrompt(fullPrompt);
    setIsGenerating(true);
    setGenerationStep('Generating content...');
    setStage('generating');

    try {
      const outputResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      });

      if (!outputResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const outputData = await outputResponse.json();
      setGeneratedOutput(outputData.output);

      setGenerationStep('Simulating what happens...');
      const simPrompt = `You're simulating what happens when this content gets used in the actual scenario. The danger isn't always that someone catches it internally - it's when it gets past that first check and hits the real world.

SCENARIO: ${scenario.situation}
TASK: ${scenario.requirement}

THE CONTENT GENERATED:
${outputData.output}

Show what happens:

1. THE FIRST GATE
Partner/exec is slammed, skims it quickly. Does it LOOK right at a glance? If it seems fine, they send it up. If it's obviously wrong, they kick it back. What happens here?

2. WHERE IT GOES
This gets sent to [the Senator's office / filed in the docket / sent to press / shared with the client / presented to the board]. Now someone with actual stakes - or someone actively hostile - is reading it carefully. What do they notice?

3. THE CONSEQUENCES
Be specific about what breaks:
- Does it get used in a hearing and expose gaps in the argument?
- Does a journalist quote it back and ask why it's so vague?
- Does opposing counsel enter it into record and use it against you?
- Does the CEO get asked about it on a call and not have real answers?
- Does committee staff call it out as generic AI slop?
- Does it create a viral moment that becomes a liability?
- Does it work well enough that you actually win something?

Write 2-3 paragraphs showing the chain of events. Include at least one direct quote from the moment it goes wrong (or right).

Tone guide: Veep meets West Wing meets In The Loop. Smart people under pressure who notice specifics. If the content is solid, they use it and you might win. If it's generic/vague, someone with an incentive to embarrass you WILL notice and exploit it. If it's wrong-tone, you look like you don't understand the room you're in.

Show real consequences:
- Good: "The Senator used your talking points verbatim and they landed. Committee counsel tried to trip her up and she had the specifics to push back. You're in the next meeting."
- Okay: "Chief of staff called you. 'This is... fine. But I had to rewrite half of it because you gave me corporate speak when I needed legislation language. Next time give me something I can actually use.'"
- Bad: "Your CEO got called to testify. Ranking member read your brief out loud, asked why it sounded like a chatbot wrote it, and requested internal communications. Legal wants to talk to you. The stock dropped 4%. There's a meme."

Point to specific elements in the content that caused the outcome. What was missing? What was there? What made the difference?`;

      const simResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: simPrompt })
      });

      if (!simResponse.ok) {
        throw new Error('Failed to generate simulation');
      }

      const simData = await simResponse.json();
      setSimulation(simData.output);

      setGenerationStep('Evaluating your prompt...');
      const evalResponse = await fetch('/api/evaluate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userPrompt: fullPrompt,
          scenario,
          promptComponents: {
            context: promptContext,
            format: promptFormat,
            audience: promptAudience,
            constraints: promptConstraints,
            goal: promptGoal
          }
        })
      });

      if (!evalResponse.ok) {
        throw new Error('Failed to evaluate prompt');
      }

      const evalData = await evalResponse.json();
      setEvaluation(evalData.evaluation);
      
      saveToLeaderboard(evalData.evaluation.score, scenario.sector);
      
      setIsGenerating(false);
      setStage('results');
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
      alert('Generation failed. Please try again.');
      setStage('write-prompt');
    }
  };

  const renderLoading = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Generating your challenge…</h2>
        <p className="text-gray-600">Claude is creating a unique crisis scenario</p>
      </div>
    </div>
  );

  const renderScenario = () => {
    if (!scenario) return null;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="text-orange-500 mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-orange-900 mb-2">{scenario.title}</h2>
              <p className="text-orange-800 text-lg font-semibold mb-3">{scenario.urgency}</p>
              <p className="text-orange-900 leading-relaxed">{scenario.situation}</p>
              <div className="mt-3 inline-block bg-orange-200 px-3 py-1 rounded-full text-sm font-semibold text-orange-900">
                {scenario.sector}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Time to fly solo</h3>
          <p className="text-gray-600 mb-2">You've learned the components. Now write your own prompt from scratch.</p>
          <p className="text-sm text-gray-500 mb-6">Your task: {scenario.requirement}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStage('write-prompt')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              Write Your Prompt <ArrowRight size={20} />
            </button>
            <button
              onClick={generateScenario}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
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
    if (!scenario) return null;

    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        {/* Scenario reminder */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 sticky top-4 z-10 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-blue-900 font-semibold mb-1">{scenario.requirement}</p>
              <p className="text-xs text-blue-700">{scenario.situation}</p>
            </div>
          </div>
        </div>

        {/* Hint toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-2"
          >
            <Lightbulb size={16} />
            {showHints ? 'Hide' : 'Show'} thinking guide
          </button>
        </div>

        {/* Hints panel */}
        {showHints && (
          <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 text-sm">What makes a strong prompt:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hints.map((hint, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-xs text-purple-800 mb-1.5">{hint.category}</div>
                  <ul className="space-y-1">
                    {hint.questions.map((q, qidx) => (
                      <li key={qidx} className="text-xs text-purple-700 flex items-start gap-2">
                        <span className="text-purple-500 flex-shrink-0">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progressive Ingredients */}
        <div className="mb-6">
          {ingredientConfigs.map((config, index) => (
            <div key={config.field} data-ingredient={index}>
              <ProgressiveIngredient
                {...config}
                number={index + 1}
                value={ingredients[index].value}
                onChange={ingredients[index].setter}
                isActive={activeIngredient === index}
                isCompleted={ingredients[index].value.trim().length > 0}
                onComplete={() => handleComplete(index)}
                onExpand={() => handleExpand(index)}
              />
            </div>
          ))}
        </div>

        {/* Generate button - shows after all filled */}
        {allFieldsFilled && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 sticky bottom-4 animate-fadeIn">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                !isGenerating
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Claude is working...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Generate & See What Happens
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderGenerating = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Claude is working…</h2>
        <div className="space-y-3 mt-6">
          <div className={`flex items-center justify-center gap-3 ${generationStep.includes('Generating content') ? 'text-orange-600 font-semibold' : generationStep ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="text-xl">{generationStep.includes('Generating content') ? '⏳' : generationStep ? '✓' : '○'}</span>
            <span>Generating content</span>
          </div>
          <div className={`flex items-center justify-center gap-3 ${generationStep.includes('Simulating') ? 'text-orange-600 font-semibold' : generationStep.includes('Evaluating') ? 'text-green-600' : 'text-gray-400'}`}>
            <span className="text-xl">{generationStep.includes('Simulating') ? '⏳' : generationStep.includes('Evaluating') ? '✓' : '○'}</span>
            <span>Simulating scenario</span>
          </div>
          <div className={`flex items-center justify-center gap-3 ${generationStep.includes('Evaluating') ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
            <span className="text-xl">{generationStep.includes('Evaluating') ? '⏳' : '○'}</span>
            <span>Evaluating prompt</span>
          </div>
        </div>
      </div>
    </div>
  );

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-orange-600';
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
    if (!evaluation || !scenario) return null;

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Scenario tackled */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 border border-gray-300">
          <p className="text-xs text-gray-600 uppercase font-semibold mb-0.5">Scenario Tackled</p>
          <p className="text-sm font-semibold text-gray-900">{scenario.title}</p>
        </div>

        {/* Generated Output */}
        <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-orange-600" />
            What Claude Generated
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed formatted-content">
            <style>{`
              .formatted-content p { margin-bottom: 0.75rem; line-height: 1.6; }
              .formatted-content p:last-child { margin-bottom: 0; }
              .formatted-content h3 { font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
              .formatted-content ul { margin: 0.5rem 0 0.75rem 1.5rem; list-style-type: disc; }
              .formatted-content li { margin-bottom: 0.5rem; line-height: 1.5; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: formatGeneratedContent(generatedOutput) }} />
          </div>
        </div>

        {/* Transition */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="text-sm font-semibold">Then this happened</span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>
        </div>

        {/* Simulation - THE PAYOFF */}
        {simulation && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-5 sm:p-6 mb-6">
            <h3 className="font-bold text-xl mb-5 text-orange-900">
              How It Played Out
            </h3>
            <div className="bg-white rounded-lg p-5 text-gray-900 leading-relaxed">
              {formatSimulation(simulation)}
            </div>
          </div>
        )}

        {/* Connecting text */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
          <p className="text-sm sm:text-base text-blue-900 font-semibold">
            Here's why it went that way:
          </p>
        </div>

        {/* Score Card */}
        <div className={`rounded-lg p-5 sm:p-6 mb-6 border-2 ${getScoreBgColor(evaluation.score)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Your Score</h2>
              <p className={`text-base sm:text-lg font-semibold ${getScoreColor(evaluation.score)}`}>
                {getScoreLabel(evaluation.score)}
              </p>
            </div>
            <div className={`text-5xl sm:text-6xl font-bold ${getScoreColor(evaluation.score)}`}>
              {evaluation.score}
            </div>
          </div>
        </div>

        {/* Ingredient Breakdown */}
        {evaluation.ingredients && (
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-6 mb-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4">What Made Your Prompt Strong (or Weak):</h3>
            <div className="space-y-3">
              {Object.entries(evaluation.ingredients).map(([key, data]) => {
                const colors = ingredientColors[key];
                return (
                  <div key={key} className={`${colors.bg} border-l-4 ${colors.border} rounded-r-lg p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`${colors.label} px-3 py-1 rounded text-xs sm:text-sm font-bold capitalize`}>
                        {key}
                      </div>
                      <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(data.score)}`}>
                        {data.score}/20
                      </div>
                    </div>
                    <p className={`text-xs sm:text-sm ${colors.text} leading-relaxed`}>
                      {data.feedback}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg shadow-lg p-6 sm:p-8 text-center">
          <Trophy className="mx-auto mb-4 text-orange-600" size={40} />
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Round Complete!</h3>
          <p className="text-sm sm:text-base text-gray-700 mb-6">
            {evaluation.score >= 75 
              ? "Strong work. Try a new scenario to test your skills."
              : "Keep practicing. Each scenario will help you improve."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setStage('write-prompt');
                setPromptContext('');
                setPromptFormat('');
                setPromptAudience('');
                setPromptConstraints('');
                setPromptGoal('');
                setActiveIngredient(0);
                setUserPrompt('');
                setGeneratedOutput('');
                setSimulation(null);
                setEvaluation(null);
                setGenerationStep('');
              }}
              className="bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              Try This Scenario Again
            </button>
            <button
              onClick={() => {
                setPromptContext('');
                setPromptFormat('');
                setPromptAudience('');
                setPromptConstraints('');
                setPromptGoal('');
                setActiveIngredient(0);
                setUserPrompt('');
                setGeneratedOutput('');
                setSimulation(null);
                setEvaluation(null);
                setGenerationStep('');
                generateScenario();
              }}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              New Scenario
            </button>
            <button
              onClick={() => setStage('leaderboard')}
              className="bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Trophy size={18} />
              Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => (
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
            {leaderboard.slice(0, 20).map((entry, idx) => (
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
                    <div className="font-semibold text-gray-900">Player {entry.id % 1000}</div>
                    <div className="text-xs text-gray-600">{entry.scenarioType} • {new Date(entry.timestamp).toLocaleDateString()}</div>
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
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            setPromptContext('');
            setPromptFormat('');
            setPromptAudience('');
            setPromptConstraints('');
            setPromptGoal('');
            setActiveIngredient(0);
            setUserPrompt('');
            setGeneratedOutput('');
            setSimulation(null);
            setEvaluation(null);
            setGenerationStep('');
            generateScenario();
          }}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          Try Another Scenario
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto mb-6 px-4">
        <div className="text-center">
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Round 3 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Freestyle Challenge</h1>
          <p className="text-gray-600">Write your own prompt & see how it plays out</p>
        </div>
      </div>

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
