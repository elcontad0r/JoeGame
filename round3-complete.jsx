import React, { useState, useEffect } from 'react';
import { AlertCircle, Sparkles, Zap, Trophy, TrendingUp, CheckCircle, Lightbulb, ArrowRight, RefreshCw, Edit2, ChevronUp } from 'lucide-react';

const ingredientColors = {
  context: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', label: 'bg-orange-200 text-orange-900' },
  format: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', label: 'bg-yellow-200 text-yellow-900' },
  audience: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', label: 'bg-green-200 text-green-900' },
  constraints: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', label: 'bg-blue-200 text-blue-900' },
  goal: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', label: 'bg-purple-200 text-purple-900' }
};

const IngredientField = ({ field, number, title, placeholder, value, onChange, hint, collapsed, onToggleCollapse }) => {
  const isCollapsed = collapsed[field];
  const colors = ingredientColors[field];
  const hasContent = value.trim().length > 0;

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

const Round3Game = ({ onBack }) => {
  const [stage, setStage] = useState('loading');
  const [scenario, setScenario] = useState(null);
  const [promptContext, setPromptContext] = useState('');
  const [promptFormat, setPromptFormat] = useState('');
  const [promptAudience, setPromptAudience] = useState('');
  const [promptConstraints, setPromptConstraints] = useState('');
  const [promptGoal, setPromptGoal] = useState('');
  const [collapsed, setCollapsed] = useState({
    context: false,
    format: false,
    audience: false,
    constraints: false,
    goal: false
  });
  const [userPrompt, setUserPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(null); // Now structured
  const [simulation, setSimulation] = useState(null); // Now structured
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  // Build full prompt from components
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
      questions: ["Time pressure?", "Length limits?", "Approval requirements?"]
    },
    {
      category: "Goal",
      questions: ["What outcome do you want?", "What should readers believe?", "What's the strategic positioning?"]
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
      // Step 1: Generate output - request structured JSON
      const outputResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${fullPrompt}

IMPORTANT: Return your response as a JSON object with this structure:
{
  "content": "the actual content you generated"
}

Make the content excellent, but wrap it in this JSON structure. Do not include any text outside the JSON.`
        })
      });

      if (!outputResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const outputData = await outputResponse.json();
      
      // Parse the JSON response
      let parsedOutput;
      try {
        // Strip markdown code fences if present
        let outputText = outputData.output.trim();
        outputText = outputText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedOutput = JSON.parse(outputText);
      } catch (e) {
        // Fallback: treat as plain text
        parsedOutput = { content: outputData.output };
      }
      
      setGeneratedOutput(parsedOutput);

      // Step 2: Simulate scenario outcome - request structured JSON
      setGenerationStep('Simulating what happens...');
      const simPrompt = `You're simulating what happens when this content gets used in the actual scenario.

SCENARIO: ${scenario.situation}
TASK: ${scenario.requirement}

THE CONTENT GENERATED:
${parsedOutput.content}

Show what happens in three acts:

1. THE FIRST GATE - Partner/exec skims it. Do they send it up or kick it back?
2. WHERE IT GOES - Someone with stakes reads it carefully. What do they notice?
3. THE CONSEQUENCES - Be specific about what breaks (or works). Include at least one direct quote.

Tone: Veep meets West Wing. Smart people under pressure. If it's solid, they use it. If it's generic, someone notices and exploits it.

IMPORTANT: Return as JSON with this EXACT structure:
{
  "first_gate": "What happens when the exec reviews it",
  "where_it_goes": "What happens when it reaches the real audience",
  "consequences": "Specific outcomes with at least one quote"
}

Do not include any text outside the JSON.`;

      const simResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: simPrompt })
      });

      if (!simResponse.ok) {
        throw new Error('Failed to generate simulation');
      }

      const simData = await simResponse.json();
      
      // Parse simulation JSON
      let parsedSim;
      try {
        let simText = simData.output.trim();
        simText = simText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedSim = JSON.parse(simText);
      } catch (e) {
        // Fallback: treat as single block
        parsedSim = {
          first_gate: simData.output,
          where_it_goes: "",
          consequences: ""
        };
      }
      
      setSimulation(parsedSim);

      // Step 3: Evaluate prompt
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

  const toggleCollapse = (field) => {
    setCollapsed({ ...collapsed, [field]: !collapsed[field] });
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
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setStage('write-prompt')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              Write Your Prompt <ArrowRight size={20} />
            </button>
            <button
              onClick={generateScenario}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Reminder banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-blue-900 font-semibold mb-1">Your Challenge: {scenario.requirement}</p>
              <p className="text-xs text-blue-800">{scenario.situation}</p>
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
          <div className="bg-purple-50 rounded-lg p-6 mb-6 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-4">What makes a strong prompt:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hints.map((hint, idx) => (
                <div key={idx}>
                  <div className="font-semibold text-sm text-purple-800 mb-2">{hint.category}</div>
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

        {/* Ingredient Fields */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-4">Build your prompt - fill in each component:</h3>
          
          <IngredientField
            field="context"
            number={1}
            title="Context"
            hint="What specific details does Claude need? Company info, numbers, operational constraints..."
            placeholder="e.g., 'Company: MidAtlantic Manufacturing, 12 facilities (PA/OH/WV), 2,400 employees, $38-42M investment needed...'"
            value={promptContext}
            onChange={setPromptContext}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="format"
            number={2}
            title="Format"
            hint="What structure and style should the output have?"
            placeholder="e.g., 'Press statement format with clear sections, bullet points for key facts, under 300 words'"
            value={promptFormat}
            onChange={setPromptFormat}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="audience"
            number={3}
            title="Audience"
            hint="Who will read this and what do they need?"
            placeholder="e.g., 'Media/journalists covering business and policy, need credible facts and company perspective'"
            value={promptAudience}
            onChange={setPromptAudience}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="constraints"
            number={4}
            title="Constraints"
            hint="Time limits, length requirements, approval process..."
            placeholder="e.g., 'CEO needs to read in 2 minutes before press call, must avoid technical jargon'"
            value={promptConstraints}
            onChange={setPromptConstraints}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="goal"
            number={5}
            title="Goal"
            hint="What outcome do you want? What should readers believe or do?"
            placeholder="e.g., 'Position company as responsible corporate citizen seeking reasonable implementation timeline, not exemption'"
            value={promptGoal}
            onChange={setPromptGoal}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />
        </div>

        {/* Generate button */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
          <button
            onClick={handleGenerate}
            disabled={!allFieldsFilled || isGenerating}
            className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
              allFieldsFilled && !isGenerating
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
          {!allFieldsFilled && (
            <p className="text-sm text-gray-600 text-center mt-3">Fill in all 5 components to generate</p>
          )}
        </div>
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
    if (!evaluation || !scenario || !simulation || !generatedOutput) return null;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Scenario reference - compact */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 border border-gray-300">
          <p className="text-xs text-gray-600 uppercase font-semibold mb-0.5">Scenario</p>
          <p className="text-sm font-semibold text-gray-900">{scenario.title}</p>
        </div>

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
            <p className="text-gray-800 leading-relaxed">{simulation.first_gate}</p>
          </div>

          {/* Where it Goes */}
          {simulation.where_it_goes && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-sm">The Real Test</span>
              </h3>
              <p className="text-gray-800 leading-relaxed">{simulation.where_it_goes}</p>
            </div>
          )}

          {/* Consequences */}
          {simulation.consequences && (
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-sm">The Fallout</span>
              </h3>
              <p className="text-gray-800 leading-relaxed">{simulation.consequences}</p>
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

        {/* What you made - collapsible by default */}
        <details className="bg-white rounded-lg shadow-md border border-gray-200 mb-6">
          <summary className="p-4 cursor-pointer hover:bg-gray-50 font-semibold text-gray-900 flex items-center gap-2">
            <Sparkles size={18} className="text-orange-600" />
            What Claude Generated
            <span className="ml-auto text-gray-400 text-sm">Click to view</span>
          </summary>
          <div className="p-4 border-t border-gray-200">
            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
              {generatedOutput.content}
            </div>
          </div>
        </details>

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
                generateScenario();
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
                );
              })}
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
              generateScenario();
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
