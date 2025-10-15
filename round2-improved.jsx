import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, Zap, RefreshCw } from 'lucide-react';

const Round2GameV2 = () => {
  const [stage, setStage] = useState('scenario');
  const [selections, setSelections] = useState({
    context: 'detailed',
    format: 'structured',
    audience: 'senior-staff',
    constraints: 'comprehensive',
    goal: 'specific'
  });

  const scenario = {
    title: "Plot Twist: Client Needs Hill Talking Points",
    urgency: "Senator's office just called - meeting in 2 hours",
    situation: "Your MidAtlantic Manufacturing client's CEO is getting pulled into an emergency meeting with Senator Casey's office about the EPA rule. They need crisp talking points for a 15-minute conversation. CEO is not a policy expert - needs it simple but credible."
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);

  const ingredients = {
    context: {
      title: "Context",
      subtitle: "What info about the client?",
      options: [
        {
          id: 'vague',
          label: "High-Level",
          promptText: "Regional manufacturing company affected by EPA standards",
          hint: "Generic industry context"
        },
        {
          id: 'some-detail',
          label: "Some Details",
          promptText: "MidAtlantic Manufacturing, multiple PA facilities, significant compliance costs, timeline constraints",
          hint: "Company name + basics"
        },
        {
          id: 'detailed',
          label: "Fully Specific",
          promptText: "MidAtlantic Manufacturing: 12 facilities (PA/OH/WV), 8 affected, 2,400 jobs, $38-42M cost, need 24+ months but only have 15",
          hint: "All concrete numbers"
        }
      ]
    },
    format: {
      title: "Format",
      subtitle: "How should it be structured?",
      options: [
        {
          id: 'paragraph',
          label: "Paragraphs",
          promptText: "Write in flowing paragraphs",
          hint: "Traditional prose"
        },
        {
          id: 'basic-bullets',
          label: "Basic Bullets",
          promptText: "Use bullet points to organize information",
          hint: "Simple list format"
        },
        {
          id: 'structured',
          label: "Executive Format",
          promptText: "Executive summary (3 sentences), section headers in ALL CAPS, bullet points with sub-bullets, max 400 words, Q&A at bottom",
          hint: "Full scannable structure"
        }
      ]
    },
    audience: {
      title: "Audience",
      subtitle: "Who's reading this?",
      options: [
        {
          id: 'general',
          label: "General",
          promptText: "General audience",
          hint: "No specific reader"
        },
        {
          id: 'hill',
          label: "Hill Staff",
          promptText: "Congressional staff member",
          hint: "Political context"
        },
        {
          id: 'senior-staff',
          label: "Chief of Staff",
          promptText: "Senator Casey's Chief of Staff - strategic thinker, politically savvy, understands both policy and politics",
          hint: "Very specific reader"
        }
      ]
    },
    constraints: {
      title: "Constraints",
      subtitle: "What are the limits?",
      options: [
        {
          id: 'time-only',
          label: "Time Limit",
          promptText: "15-minute meeting window",
          hint: "Just the time"
        },
        {
          id: 'reader-context',
          label: "Reader Prep",
          promptText: "CEO (not policy expert) needs to read this quickly before meeting",
          hint: "Reader constraints"
        },
        {
          id: 'comprehensive',
          label: "Full Reality",
          promptText: "CEO reads in car (2 min), not a policy expert (avoid jargon), 15-min meeting, must be printable on one page",
          hint: "All practical limits"
        }
      ]
    },
    goal: {
      title: "Goal",
      subtitle: "What should this accomplish?",
      options: [
        {
          id: 'inform',
          label: "Inform",
          promptText: "Educate on the rule's impact",
          hint: "Share information"
        },
        {
          id: 'dialogue',
          label: "Start Dialogue",
          promptText: "Build relationship with Senator's office and establish ongoing communication",
          hint: "Relationship building"
        },
        {
          id: 'specific',
          label: "Get Commitments",
          promptText: "Get 3 specific commitments: (1) Co-sponsor timeline extension amendment, (2) Support appropriations for compliance grants, (3) Facilitate meeting with EPA Administrator. Frame as jobs issue, not environmental backsliding.",
          hint: "Concrete actionable asks"
        }
      ]
    }
  };

  // Generate output by calling Claude API
  const generateWithClaude = async () => {
    setIsGenerating(true);
    setHasGenerated(true);
    
    const prompt = buildPrompt();
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const claudeResponse = data.content[0].text;
      setOutput(claudeResponse);
    } catch (error) {
      console.error("Error calling Claude:", error);
      setOutput("Error generating output. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const buildPrompt = () => {
    let prompt = "Write talking points for a Hill meeting about the EPA air quality rule.\n\n";
    
    if (selections.context) {
      const option = ingredients.context.options.find(o => o.id === selections.context);
      prompt += `Context: ${option.promptText}\n\n`;
    }
    
    if (selections.format) {
      const option = ingredients.format.options.find(o => o.id === selections.format);
      prompt += `Format: ${option.promptText}\n\n`;
    }
    
    if (selections.audience) {
      const option = ingredients.audience.options.find(o => o.id === selections.audience);
      prompt += `Audience: ${option.promptText}\n\n`;
    }
    
    if (selections.constraints) {
      const option = ingredients.constraints.options.find(o => o.id === selections.constraints);
      prompt += `Constraints: ${option.promptText}\n\n`;
    }
    
    if (selections.goal) {
      const option = ingredients.goal.options.find(o => o.id === selections.goal);
      prompt += `Goal: ${option.promptText}`;
    }
    
    return prompt;
  };

  const renderScenario = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{scenario.title}</h2>
            <p className="text-blue-800 text-lg font-semibold mb-3">{scenario.urgency}</p>
            <p className="text-blue-900 leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Build Your Prompt</h3>
        <p className="text-gray-700 mb-4">
          You'll see 5 prompt "ingredients" you can adjust. Pick options and watch the prompt and output change in real-time.
        </p>
        <button
          onClick={() => setStage('builder')}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Open Prompt Builder <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const IngredientCard = ({ ingredientKey, data }) => {
    const selected = selections[ingredientKey];
    
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-purple-300 transition-all">
        <div className="mb-3">
          <h4 className="font-bold text-gray-900">{data.title}</h4>
          <p className="text-xs text-gray-600">{data.subtitle}</p>
        </div>
        
        <div className="space-y-2">
          {data.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelections({ ...selections, [ingredientKey]: option.id })}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selected === option.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{option.label}</span>
                {selected === option.id && (
                  <CheckCircle size={16} className="text-purple-600" />
                )}
              </div>
              <div className="text-xs text-gray-600">{option.hint}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBuilder = () => {
    const allSelected = Object.values(selections).every(v => v !== null);
    
    return (
      <div className="w-full px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold">Prompt Builder</h2>
            </div>
            <button
              onClick={() => setSelections({
                context: null,
                format: null,
                audience: null,
                constraints: null,
                goal: null
              })}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>

        {/* Top Grid: Ingredients (left) + Prompt/Generate (right) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Ingredients */}
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">5 Prompt Ingredients</h3>
              <p className="text-xs text-purple-800">
                Pick options below →
              </p>
            </div>

            <IngredientCard ingredientKey="context" data={ingredients.context} />
            <IngredientCard ingredientKey="format" data={ingredients.format} />
            <IngredientCard ingredientKey="audience" data={ingredients.audience} />
            <IngredientCard ingredientKey="constraints" data={ingredients.constraints} />
            <IngredientCard ingredientKey="goal" data={ingredients.goal} />
          </div>

          {/* Right: Prompt + Generate Button */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6 lg:sticky lg:top-4">
              <h3 className="font-bold text-lg mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Your Prompt</span>
              </h3>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 font-mono text-xs max-h-80 overflow-y-auto mb-4">
                <div className="whitespace-pre-wrap text-gray-800">
                  {buildPrompt()}
                </div>
              </div>

              <button
                onClick={generateWithClaude}
                disabled={!allSelected || isGenerating}
                className={`w-full px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                  allSelected && !isGenerating
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Generate with Claude
                  </>
                )}
              </button>

              {!allSelected && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Select all 5 ingredients to generate
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Output (full width) */}
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap size={20} className="text-purple-600" />
            <span>Claude's Output</span>
          </h3>

          {!hasGenerated && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-12 text-center">
              <Zap className="mx-auto mb-3 text-blue-400" size={56} />
              <p className="text-blue-900 font-semibold mb-2 text-lg">Ready to see Claude in action?</p>
              <p className="text-sm text-blue-700">
                {allSelected 
                  ? "Click Generate above to call Claude with your prompt"
                  : "Select all 5 ingredients, then click Generate"}
              </p>
            </div>
          )}

          {hasGenerated && (
            <>
              {isGenerating ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                      {output}
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-yellow-900">
                      💡 <strong>Try experimenting:</strong> Change any ingredient and click Generate again to see how the output changes
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Continue Button */}
        {hasGenerated && !isGenerating && (
          <div className="max-w-7xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 text-center border-2 border-green-200 mt-6">
            <CheckCircle className="mx-auto mb-3 text-green-600" size={32} />
            <h4 className="font-bold text-lg mb-2">Seen how the ingredients work?</h4>
            <p className="text-sm text-gray-700 mb-4">
              Experiment more, or move on when ready
            </p>
            <button
              onClick={() => setStage('complete')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              See What You Learned <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderComplete = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white text-center mb-6">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-bold mb-3">You Built a Real Prompt</h2>
        <p className="text-lg text-green-50">
          You saw how 5 ingredients combine to create useful output
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">The 5 Ingredients:</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <div className="font-semibold text-gray-900">Context</div>
              <div className="text-sm text-gray-600">Specific numbers and constraints beat vague descriptions</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div>
              <div className="font-semibold text-gray-900">Format</div>
              <div className="text-sm text-gray-600">Tell Claude HOW to structure the output (bullets, headers, length)</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div>
              <div className="font-semibold text-gray-900">Audience</div>
              <div className="text-sm text-gray-600">Specify who's reading it and their level of expertise</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              4
            </div>
            <div>
              <div className="font-semibold text-gray-900">Constraints</div>
              <div className="text-sm text-gray-600">Real-world limits (time, complexity, reader preparation)</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              5
            </div>
            <div>
              <div className="font-semibold text-gray-900">Goal</div>
              <div className="text-sm text-gray-600">What should this accomplish? Be specific with asks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-3">Round 2 Complete</h3>
        <p className="text-gray-700 mb-6">
          Next: Write your own prompt from scratch (with structure hints)
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setStage('builder')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Try Different Options
          </button>
          <button
            onClick={() => alert('Moving to Round 3...')}
            className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
          >
            Start Round 3 <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <div className="text-center">
          <div className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Round 2 of 5
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Prompt Builder Playground
          </h1>
          <p className="text-gray-600">Experiment with 5 ingredients and watch the output transform</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'builder' && renderBuilder()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round2GameV2;
