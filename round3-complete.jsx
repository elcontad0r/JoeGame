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

const Round3Game = ({ onBack }) => {
  const [stage, setStage] = useState('topic-input');
  const [userTopic, setUserTopic] = useState('');
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
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [simulation, setSimulation] = useState(null);
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

  const generateScenario = async (topic) => {
    setStage('loading');
    
    try {
      const response = await fetch('/api/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userTopic: topic })
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
      questions: ["What must be avoided?", "What are the limitations?", "Any specific requirements?"]
    },
    {
      category: "Goal",
      questions: ["What's the desired outcome?", "What action should they take?", "How will success be measured?"]
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 18) return 'text-green-600';
    if (score >= 15) return 'text-blue-600';
    if (score >= 12) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const handleGenerate = async () => {
    if (!allFieldsFilled) return;
    
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
      setGeneratedOutput(generateData.output);
      
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
          scenario: scenario
        })
      });

      if (!evaluateResponse.ok) {
        throw new Error('Evaluation failed');
      }

      const evaluateData = await evaluateResponse.json();
      setEvaluation(evaluateData.evaluation);
      
      saveToLeaderboard(evaluateData.evaluation.score, scenario.type);
      
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
            <p className="text-gray-600">What project or topic are you working on right now?</p>
          </div>

          <textarea
            value={userTopic}
            onChange={(e) => setUserTopic(e.target.value)}
            placeholder="e.g., 'Policy brief on renewable energy subsidies' or 'Messaging strategy for healthcare reform' or 'leave blank for general scenario'"
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Scenario</h2>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-4">
                <p className="text-gray-800 leading-relaxed">{scenario.situation}</p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                <p className="text-sm font-semibold text-purple-900 mb-1">Your challenge:</p>
                <p className="text-gray-800 leading-relaxed">{scenario.requirement}</p>
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
          <p className="text-gray-700 mb-4">
            Fill in each ingredient to create a prompt that will generate great output. The better your prompt, the better your score.
          </p>
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2"
          >
            <Lightbulb size={16} />
            {showHints ? 'Hide' : 'Show'} helpful questions
          </button>
        </div>

        {/* Hints section */}
        {showHints && (
          <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Questions to guide you:</h3>
            <div className="grid gap-4">
              {hints.map((hint, idx) => (
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
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="format"
            number={2}
            title="Format"
            placeholder="What structure should the output have?"
            hint="Be specific about length, style, sections, or structure."
            value={promptFormat}
            onChange={setPromptFormat}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="audience"
            number={3}
            title="Audience"
            placeholder="Who will read this and what do they care about?"
            hint="Who's this for? What's their perspective? What tone will work?"
            value={promptAudience}
            onChange={setPromptAudience}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="constraints"
            number={4}
            title="Constraints"
            placeholder="What should be avoided or what are the limits?"
            hint="What can't you say? What must be avoided? Any requirements or limitations?"
            value={promptConstraints}
            onChange={setPromptConstraints}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />

          <IngredientField
            field="goal"
            number={5}
            title="Goal"
            placeholder="What should this accomplish?"
            hint="What's the desired outcome? What action should readers take? How do you measure success?"
            value={promptGoal}
            onChange={setPromptGoal}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
          />
        </div>

        {/* Preview */}
        {allFieldsFilled && (
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
        <div className="flex gap-3">
          <button
            onClick={() => setStage('scenario')}
            className="bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Scenario
          </button>
          <button
            onClick={handleGenerate}
            disabled={!allFieldsFilled}
            className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
              allFieldsFilled
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Zap size={20} />
            Generate & See Results
          </button>
        </div>
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

  const renderResults = () => {
    if (!evaluation || !generatedOutput || !simulation) return null;

    return (
      <div className="max-w-5xl mx-auto p-6">
        {/* Score card */}
        <div className="bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-xl shadow-2xl p-8 mb-8 text-center">
          <Trophy className="mx-auto mb-4" size={56} />
          <h2 className="text-4xl font-bold mb-2">Score: {evaluation.score}/100</h2>
          <p className="text-xl text-purple-100">{evaluation.summary}</p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Generated Output */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">What Claude Generated</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {highlightQuotes(generatedOutput.content)}
              </p>
            </div>
          </div>

          {/* Simulation */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-orange-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Real-World Result</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-orange-900 mb-2">What happened:</p>
                <p className="text-sm text-gray-800 leading-relaxed">{simulation.outcome}</p>
              </div>
              
              {simulation.strengths && simulation.strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle size={16} />
                    What worked:
                  </p>
                  <ul className="space-y-1">
                    {simulation.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-800">• {strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {simulation.issues && simulation.issues.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    What fell short:
                  </p>
                  <ul className="space-y-1">
                    {simulation.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-gray-800">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ingredient scores */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Prompt Breakdown</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluation.ingredients && evaluation.ingredients.context && (
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

            {evaluation.ingredients && evaluation.ingredients.format && (
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

            {evaluation.ingredients && evaluation.ingredients.audience && (
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

            {evaluation.ingredients && evaluation.ingredients.constraints && (
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

            {evaluation.ingredients && evaluation.ingredients.goal && (
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
          <div className="inline-block bg-orange-100 text-orange-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Round 3 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Freestyle Challenge</h1>
          <p className="text-gray-600">Write your own prompt & see how it plays out</p>
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
