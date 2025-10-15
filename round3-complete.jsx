import React, { useState, useEffect } from 'react';
import { AlertCircle, Sparkles, Zap, Trophy, TrendingUp, CheckCircle, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

const Round3Game = ({ onBack }) => {
  const [stage, setStage] = useState('loading');
  const [scenario, setScenario] = useState(null);
  const [promptContext, setPromptContext] = useState('');
  const [promptFormat, setPromptFormat] = useState('');
  const [promptAudience, setPromptAudience] = useState('');
  const [promptConstraints, setPromptConstraints] = useState('');
  const [promptGoal, setPromptGoal] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
      // Fallback scenario
      setScenario({
        title: "Breaking: Consumer Group Launches Campaign",
        urgency: "Response needed in 90 minutes",
        situation: "National consumer advocacy group just released report calling your telecom client 'predatory' for data pricing. Trending on social media. Client needs statement for 3pm press call.",
        requirement: "Draft public statement",
        sector: "telecommunications"
      });
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
    if (userPrompt.length < 20) return;
    
    setIsGenerating(true);
    setStage('generating');

    try {
      // Generate output
      const outputResponse = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });

      if (!outputResponse.ok) {
        throw new Error('Failed to generate content');
      }

      const outputData = await outputResponse.json();
      setGeneratedOutput(outputData.output);

      // Evaluate prompt
      const evalResponse = await fetch('/api/evaluate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userPrompt,
          scenario
        })
      });

      if (!evalResponse.ok) {
        throw new Error('Failed to evaluate prompt');
      }

      const evalData = await evalResponse.json();
      setEvaluation(evalData.evaluation);
      
      // Save to leaderboard
      saveToLeaderboard(evalData.evaluation.score, scenario.sector);
      
      setIsGenerating(false);
      setStage('results');
    } catch (error) {
      console.error('Error:', error);
      setIsGenerating(false);
      // Fallback evaluation
      setEvaluation({
        score: 50,
        strengths: ["Attempted the task"],
        improvements: ["Add more specific context", "Define the desired format", "Specify your audience"],
        verdict: "Good attempt but needs more detail for production-quality output."
      });
      setStage('results');
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

    const fullPrompt = buildFullPrompt();

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Reminder banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
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

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="font-bold text-lg mb-4">Build your prompt - fill in each component:</h3>
          
          {/* Context field */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <label className="font-semibold text-gray-900">Context</label>
            </div>
            <p className="text-xs text-gray-600 mb-2">What specific details does Claude need? Company info, numbers, operational constraints...</p>
            <textarea
              value={promptContext}
              onChange={(e) => setPromptContext(e.target.value)}
              placeholder="e.g., 'Company: MidAtlantic Manufacturing, 12 facilities (PA/OH/WV), 2,400 employees, $38-42M investment needed...'"
              className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          {/* Format field */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <label className="font-semibold text-gray-900">Format</label>
            </div>
            <p className="text-xs text-gray-600 mb-2">What structure and style should the output have?</p>
            <textarea
              value={promptFormat}
              onChange={(e) => setPromptFormat(e.target.value)}
              placeholder="e.g., 'Press statement format with clear sections, bullet points for key facts, under 300 words'"
              className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          {/* Audience field */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <label className="font-semibold text-gray-900">Audience</label>
            </div>
            <p className="text-xs text-gray-600 mb-2">Who will read this and what do they need?</p>
            <textarea
              value={promptAudience}
              onChange={(e) => setPromptAudience(e.target.value)}
              placeholder="e.g., 'Media/journalists covering business and policy, need credible facts and company perspective'"
              className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          {/* Constraints field */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <label className="font-semibold text-gray-900">Constraints</label>
            </div>
            <p className="text-xs text-gray-600 mb-2">Time limits, length requirements, approval process...</p>
            <textarea
              value={promptConstraints}
              onChange={(e) => setPromptConstraints(e.target.value)}
              placeholder="e.g., 'CEO needs to read in 2 minutes before press call, must avoid technical jargon'"
              className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          {/* Goal field */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              <label className="font-semibold text-gray-900">Goal</label>
            </div>
            <p className="text-xs text-gray-600 mb-2">What outcome do you want? What should readers believe or do?</p>
            <textarea
              value={promptGoal}
              onChange={(e) => setPromptGoal(e.target.value)}
              placeholder="e.g., 'Position company as responsible corporate citizen seeking reasonable implementation timeline, not exemption'"
              className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Full prompt preview */}
        {fullPrompt && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-gray-300">
            <h3 className="font-semibold mb-3 text-gray-900">Your Complete Prompt:</h3>
            <div className="bg-white p-4 rounded border border-gray-300 font-mono text-xs leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
              {fullPrompt}
            </div>
            <p className="text-xs text-gray-600 mt-2">{fullPrompt.length} characters</p>
          </div>
        )}

        {/* Generate button */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
          <button
            onClick={() => {
              setUserPrompt(fullPrompt);
              handleGenerate();
            }}
            disabled={!fullPrompt || fullPrompt.length < 50 || isGenerating}
            className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
              fullPrompt && fullPrompt.length >= 50 && !isGenerating
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
                Generate & Score My Prompt
              </>
            )}
          </button>
          {(!fullPrompt || fullPrompt.length < 50) && (
            <p className="text-sm text-gray-600 text-center mt-3">Fill in the components above to build your prompt</p>
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
        <p className="text-gray-600 mb-2">Generating your {scenario?.requirement}</p>
        <p className="text-sm text-gray-500">Then evaluating your prompt quality</p>
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
      <div className="max-w-4xl mx-auto p-6">
        {/* Scenario tackled */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 border border-gray-300">
          <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Scenario Tackled</p>
          <p className="text-sm font-semibold text-gray-900">{scenario.title}</p>
        </div>

        {/* Score Card */}
        <div className={`rounded-lg p-6 mb-6 border-2 ${getScoreBgColor(evaluation.score)}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Score</h2>
              <p className={`text-lg font-semibold ${getScoreColor(evaluation.score)}`}>
                {getScoreLabel(evaluation.score)}
              </p>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(evaluation.score)}`}>
              {evaluation.score}
            </div>
          </div>
          <p className="text-gray-700 italic">{evaluation.verdict}</p>
        </div>

        {/* Your Prompt */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="font-semibold text-lg mb-3">Your Prompt:</h3>
          <div className="bg-white p-4 rounded text-sm font-mono leading-relaxed whitespace-pre-wrap border border-gray-300 max-h-48 overflow-y-auto">
            {userPrompt}
          </div>
        </div>

        {/* Generated Output */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-orange-600" />
            What Claude Generated:
          </h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
            {generatedOutput}
          </div>
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {evaluation.strengths && evaluation.strengths.length > 0 && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle size={20} />
                What Worked:
              </h3>
              <ul className="space-y-2">
                {evaluation.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-green-900 flex items-start gap-2">
                    <span className="text-green-600 flex-shrink-0">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                To Improve:
              </h3>
              <ul className="space-y-2">
                {evaluation.improvements.map((improvement, idx) => (
                  <li key={idx} className="text-sm text-blue-900 flex items-start gap-2">
                    <span className="text-blue-600 flex-shrink-0">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg shadow-lg p-8 text-center">
          <Trophy className="mx-auto mb-4 text-orange-600" size={48} />
          <h3 className="text-2xl font-bold mb-3">Round Complete!</h3>
          <p className="text-gray-700 mb-6">
            {evaluation.score >= 75 
              ? "Strong work. Try a new scenario to test your skills."
              : "Keep practicing. Each scenario will help you improve."}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => {
                setStage('write-prompt');
                setPromptContext('');
                setPromptFormat('');
                setPromptAudience('');
                setPromptConstraints('');
                setPromptGoal('');
                setUserPrompt('');
                setGeneratedOutput('');
                setEvaluation(null);
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
                setUserPrompt('');
                setGeneratedOutput('');
                setEvaluation(null);
                generateScenario();
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              New Scenario
            </button>
            <button
              onClick={() => setStage('leaderboard')}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Trophy size={20} />
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
            setUserPrompt('');
            setGeneratedOutput('');
            setEvaluation(null);
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
      <div className="max-w-6xl mx-auto mb-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Prompting Game: Round 3</h1>
          <p className="text-gray-600">Freestyle - Write Your Own</p>
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
