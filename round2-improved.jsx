import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, Zap, RefreshCw, X } from 'lucide-react';

const Round2GameV2 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [selections, setSelections] = useState({
    context: null,
    format: null,
    audience: null,
    constraints: null,
    goal: null
  });
  const [showOutput, setShowOutput] = useState(false);

  const scenario = {
    title: "Plot Twist: Client Needs Hill Talking Points",
    urgency: "Senator's office just called - meeting in 2 hours",
    situation: "Your MidAtlantic Manufacturing client's CEO is getting pulled into an emergency meeting with Senator Casey's office about the EPA rule. They need crisp talking points for a 15-minute conversation."
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');

  const ingredients = {
    context: {
      title: "Strategic Angle",
      subtitle: "How should we frame this?",
      options: [
        {
          id: 'jobs',
          label: "Jobs & Economic Impact",
          promptText: "MidAtlantic Manufacturing: 12 facilities across PA/OH/WV, 2,400 direct jobs at risk, $38-42M compliance cost burden. Focus on workforce and economic impact to the region.",
          hint: "Economic argument"
        },
        {
          id: 'compliance',
          label: "Compliance Timeline",
          promptText: "MidAtlantic Manufacturing: 8 of 12 facilities need major upgrades, requires 24+ months but EPA timeline gives only 15 months. Focus on impossibility of current timeline.",
          hint: "Procedural argument"
        },
        {
          id: 'competitive',
          label: "Regional Competitiveness",
          promptText: "MidAtlantic Manufacturing competes with facilities in non-attainment states with more lenient timelines. This rule creates unfair competitive disadvantage for PA manufacturers.",
          hint: "Fairness argument"
        }
      ]
    },
    format: {
      title: "Document Type",
      subtitle: "What format works best?",
      options: [
        {
          id: 'talking-points',
          label: "Talking Points",
          promptText: "Bullet-point talking points: concise statements with supporting data, organized by topic. Maximum 1 page.",
          hint: "Quick reference"
        },
        {
          id: 'qa-prep',
          label: "Q&A Brief",
          promptText: "Q&A format: anticipated questions with prepared answers. Include 5-7 likely questions with 2-3 sentence responses each.",
          hint: "Defensive prep"
        },
        {
          id: 'memo',
          label: "Executive Memo",
          promptText: "Brief memo format: 2-3 sentence executive summary, then key points with headers. Professional document structure.",
          hint: "Formal document"
        }
      ]
    },
    audience: {
      title: "Primary Reader",
      subtitle: "Who needs this most?",
      options: [
        {
          id: 'chief-of-staff',
          label: "Chief of Staff",
          promptText: "Senator Casey's Chief of Staff - focus on political implications, constituent impact, and strategic positioning. Understands both policy and politics.",
          hint: "Political strategy"
        },
        {
          id: 'leg-director',
          label: "Legislative Director",
          promptText: "Legislative Director - focus on policy mechanics, amendment language possibilities, and legislative vehicles. Needs technical accuracy.",
          hint: "Policy mechanics"
        },
        {
          id: 'comms-director',
          label: "Communications Director",
          promptText: "Communications Director - focus on messaging frames, constituent stories, and public narrative. Needs quotable language.",
          hint: "Public messaging"
        }
      ]
    },
    constraints: {
      title: "Meeting Context",
      subtitle: "What's the situation?",
      options: [
        {
          id: 'elevator',
          label: "2-Minute Hallway Stop",
          promptText: "Unplanned hallway conversation - CEO has 2 minutes max. Need 3 crisp points that can be delivered standing up. No time for nuance.",
          hint: "Ultra-brief"
        },
        {
          id: 'sit-down',
          label: "15-Minute Sit-Down",
          promptText: "Scheduled 15-minute office meeting - CEO will sit down with staffer. Time for proper discussion but still need to be efficient and focused.",
          hint: "Standard meeting"
        },
        {
          id: 'send-ahead',
          label: "Email Before Meeting",
          promptText: "Sending materials 24 hours before in-person meeting. Staff will read in advance. Can be more detailed, CEO will discuss in person later.",
          hint: "Advance prep"
        }
      ]
    },
    goal: {
      title: "Desired Outcome",
      subtitle: "What do we need?",
      options: [
        {
          id: 'delay',
          label: "Delay Implementation",
          promptText: "Primary ask: Co-sponsor amendment extending compliance timeline from 15 to 30 months. Provide technical justification for why current timeline is unworkable.",
          hint: "Timeline extension"
        },
        {
          id: 'funding',
          label: "Secure Funding",
          promptText: "Primary ask: Support appropriations rider for $500M compliance assistance fund. Show how funding makes compliance achievable without job losses.",
          hint: "Financial support"
        },
        {
          id: 'epa-meeting',
          label: "EPA Meeting Access",
          promptText: "Primary ask: Facilitate meeting with EPA Administrator to discuss regional variance provision. Position as wanting to work within framework, not obstruct.",
          hint: "Agency access"
        }
      ]
    }
  };

  const generateWithClaude = async () => {
    setIsGenerating(true);
    setShowOutput(true);
    
    const basePrompt = buildPrompt();
    const prompt = `${basePrompt}

Write this content clearly and professionally. Use proper structure with clear sections, bullet points where appropriate, and good formatting. Make it practical and immediately usable.

CRITICAL: Return ONLY plain text. Do NOT use any markdown formatting:
- No ** for bold
- No * for italic  
- No __ for underline
- No # for headers
- No \` for code

Instead:
- Use ALL CAPS for section headers
- Use bullet points (•) or dashes (-) for lists
- Use clear line breaks and spacing for structure
- Just write clean, formatted text

Return your response as a JSON object:
{
  "content": "your talking points here"
}`;
  
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      let parsed;
      try {
        let outputText = data.output.trim();
        outputText = outputText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(outputText);
        
        // Aggressively strip any markdown that snuck through
        let content = parsed.content;
        content = content
          .replace(/\*\*(.+?)\*\*/g, '$1')  // bold
          .replace(/\*(.+?)\*/g, '$1')       // italic
          .replace(/__(.+?)__/g, '$1')       // underline
          .replace(/`(.+?)`/g, '$1')         // inline code
          .replace(/^#{1,6}\s+/gm, '')       // headers (keep text, remove #)
          .replace(/^\s*[-*+]\s+/gm, '• ');  // bullets
        
        setOutput(content);
      } catch (e) {
        setOutput(data.output);
      }
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
      prompt += `Strategic Angle: ${option.promptText}\n\n`;
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
      prompt += `Context: ${option.promptText}\n\n`;
    }
    
    if (selections.goal) {
      const option = ingredients.goal.options.find(o => o.id === selections.goal);
      prompt += `Goal: ${option.promptText}`;
    }
    
    return prompt;
  };

  const handleSelection = (ingredientKey, optionId) => {
    setSelections({ ...selections, [ingredientKey]: optionId });
  };

  const allSelected = Object.values(selections).every(v => v !== null);

  const renderScenario = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={24} />
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{scenario.title}</h2>
            <p className="text-blue-800 font-semibold mb-2">{scenario.urgency}</p>
            <p className="text-blue-900">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Build Your Prompt</h3>
        <p className="text-gray-700 mb-4">
          Pick 5 ingredients and see how your choices change the output.
        </p>
        <button
          onClick={() => setStage('builder')}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          Start Building <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const IngredientSelector = ({ ingredientKey, data }) => {
    const selected = selections[ingredientKey];
    
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <div className="mb-3">
          <h4 className="font-bold text-gray-900">{data.title}</h4>
          <p className="text-xs text-gray-600">{data.subtitle}</p>
        </div>
        
        <div className="space-y-2">
          {data.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelection(ingredientKey, option.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selected === option.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.hint}</div>
                </div>
                {selected === option.id && (
                  <CheckCircle size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPromptPreview = () => {
    const sections = [];
    
    if (selections.context) {
      const option = ingredients.context.options.find(o => o.id === selections.context);
      sections.push({ label: 'Angle', text: option.label });
    }
    if (selections.format) {
      const option = ingredients.format.options.find(o => o.id === selections.format);
      sections.push({ label: 'Format', text: option.label });
    }
    if (selections.audience) {
      const option = ingredients.audience.options.find(o => o.id === selections.audience);
      sections.push({ label: 'Reader', text: option.label });
    }
    if (selections.constraints) {
      const option = ingredients.constraints.options.find(o => o.id === selections.constraints);
      sections.push({ label: 'Context', text: option.label });
    }
    if (selections.goal) {
      const option = ingredients.goal.options.find(o => o.id === selections.goal);
      sections.push({ label: 'Goal', text: option.label });
    }

    return (
      <div className="space-y-2">
        {sections.map((section, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-medium w-16">{section.label}:</span>
            <span className="text-gray-900">{section.text}</span>
          </div>
        ))}
        {sections.length === 0 && (
          <p className="text-sm text-gray-500 italic">Make selections to build prompt...</p>
        )}
      </div>
    );
  };

  const renderBuilder = () => {
    const selectedCount = Object.values(selections).filter(v => v !== null).length;
    
    return (
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Fixed Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="text-purple-600" size={20} />
                <h2 className="text-lg font-bold">Prompt Builder</h2>
              </div>
              <button
                onClick={() => {
                  setSelections({
                    context: null,
                    format: null,
                    audience: null,
                    constraints: null,
                    goal: null
                  });
                  setOutput('');
                  setShowOutput(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            </div>
            
            {/* Prompt Preview */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-2">
                YOUR PROMPT ({selectedCount}/5):
              </div>
              {renderPromptPreview()}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <IngredientSelector ingredientKey="context" data={ingredients.context} />
            <IngredientSelector ingredientKey="format" data={ingredients.format} />
            <IngredientSelector ingredientKey="audience" data={ingredients.audience} />
            <IngredientSelector ingredientKey="constraints" data={ingredients.constraints} />
            <IngredientSelector ingredientKey="goal" data={ingredients.goal} />
            
            {/* Generate Button in Grid */}
            <div className="lg:col-span-2">
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
                    Generate Output
                    {!allSelected && <span className="text-sm ml-2">({selectedCount}/5)</span>}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Next Step */}
          {output && !isGenerating && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 text-center border-2 border-green-200">
              <p className="text-sm text-gray-700 mb-4">
                Try changing ingredients and regenerating, or continue when ready
              </p>
              <button
                onClick={() => setStage('complete')}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Output Modal */}
        {showOutput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Zap size={20} className="text-purple-600" />
                  Claude's Output
                </h3>
                <div className="flex items-center gap-2">
                  {!isGenerating && (
                    <button
                      onClick={generateWithClaude}
                      className="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                    >
                      <RefreshCw size={14} />
                      Regenerate
                    </button>
                  )}
                  <button
                    onClick={() => setShowOutput(false)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isGenerating ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm font-mono">
                      {output}
                    </div>
                  </div>
                )}
              </div>

              {!isGenerating && (
                <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                  <p className="text-sm text-yellow-900">
                    💡 <strong>Experiment:</strong> Close this and change any ingredient, then regenerate
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComplete = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white text-center mb-6">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-bold mb-2">You Built a Real Prompt</h2>
        <p className="text-green-50">
          You saw how strategic choices shape the output
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">The 5 Ingredients:</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Strategic Angle</div>
            <div className="text-gray-600">Different framings get different results - jobs vs timeline vs fairness</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Document Type</div>
            <div className="text-gray-600">Format matters - talking points vs Q&A vs memo serve different needs</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Primary Reader</div>
            <div className="text-gray-600">Audience shapes content - political vs policy vs messaging focus</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Meeting Context</div>
            <div className="text-gray-600">Real constraints drive structure - 2 minutes vs 15 minutes vs advance prep</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Desired Outcome</div>
            <div className="text-gray-600">Clear goals get concrete results - delay vs funding vs access</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-3">Round 2 Complete</h3>
        <p className="text-gray-700 mb-6">
          Next: Write your own prompt from scratch
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setStage('builder')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => onComplete && onComplete()}
            className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-2"
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
            Round 2 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Prompt Builder
          </h1>
          <p className="text-gray-600">See how strategic choices change the output</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'builder' && renderBuilder()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round2GameV2;
