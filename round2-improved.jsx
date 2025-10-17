import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle, Zap, RefreshCw } from 'lucide-react';

const Round2GameV2 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [selections, setSelections] = useState({
    context: null,
    format: null,
    audience: null,
    constraints: null,
    goal: null
  });

  const scenario = {
    title: "Plot Twist: Client Needs Hill Talking Points",
    urgency: "Senator's office just called - meeting in 2 hours",
    situation: "Your MidAtlantic Manufacturing client's CEO is getting pulled into an emergency meeting with Senator Casey's office about the EPA rule. They need crisp talking points for a 15-minute conversation."
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState('');

  const ingredients = {
    context: {
      title: "Context",
      options: [
        {
          id: 'jobs',
          label: "Jobs & Economic Impact",
          promptText: "MidAtlantic Manufacturing: 12 facilities across PA/OH/WV, 2,400 direct jobs at risk, $38-42M compliance cost. Frame as workforce and regional economic impact.",
        },
        {
          id: 'compliance',
          label: "Compliance Timeline",
          promptText: "MidAtlantic Manufacturing: 8 of 12 facilities need major upgrades, requires 24+ months but EPA gives only 15 months. Frame as impossible timeline.",
        },
        {
          id: 'competitive',
          label: "Regional Competitiveness",
          promptText: "MidAtlantic Manufacturing competes with facilities in states with more lenient timelines. Frame as unfair competitive disadvantage for PA.",
        }
      ]
    },
    format: {
      title: "Format",
      options: [
        {
          id: 'talking-points',
          label: "Talking Points List",
          promptText: "Bullet-point talking points: concise statements with data, organized by topic. One page maximum.",
        },
        {
          id: 'qa-prep',
          label: "Q&A Brief",
          promptText: "Question-and-answer format: 5-7 anticipated questions with 2-3 sentence responses each.",
        },
        {
          id: 'memo',
          label: "Executive Memo",
          promptText: "Memo format: 2-3 sentence executive summary at top, then key points with section headers.",
        }
      ]
    },
    audience: {
      title: "Audience",
      options: [
        {
          id: 'chief-of-staff',
          label: "Chief of Staff",
          promptText: "Senator Casey's Chief of Staff - focus on political implications and constituent impact. Understands both policy and politics.",
        },
        {
          id: 'leg-director',
          label: "Legislative Director",
          promptText: "Legislative Director - focus on policy mechanics, amendment possibilities, and legislative vehicles. Needs technical precision.",
        },
        {
          id: 'comms-director',
          label: "Communications Director",
          promptText: "Communications Director - focus on messaging frames and public narrative. Needs quotable, clear language.",
        }
      ]
    },
    constraints: {
      title: "Constraints",
      options: [
        {
          id: 'elevator',
          label: "2-Min Hallway",
          promptText: "Unplanned hallway stop - CEO has 2 minutes max, standing up. Need 3 crisp points, no nuance.",
        },
        {
          id: 'sit-down',
          label: "15-Min Meeting",
          promptText: "Scheduled 15-minute office meeting - CEO sits down with staffer. Time for discussion but need focus.",
        },
        {
          id: 'send-ahead',
          label: "Email Before",
          promptText: "Send materials 24 hours before meeting. Staff reads in advance, CEO discusses in person later. Can be more detailed.",
        }
      ]
    },
    goal: {
      title: "Goal",
      options: [
        {
          id: 'delay',
          label: "Delay Implementation",
          promptText: "Primary ask: Co-sponsor amendment extending timeline from 15 to 30 months. Justify why current timeline is unworkable.",
        },
        {
          id: 'funding',
          label: "Secure Funding",
          promptText: "Primary ask: Support $500M appropriations for compliance assistance fund. Show how funding enables compliance without job losses.",
        },
        {
          id: 'epa-meeting',
          label: "EPA Access",
          promptText: "Primary ask: Facilitate meeting with EPA Administrator on regional variance. Position as working within framework, not obstructing.",
        }
      ]
    }
  };

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown) => {
    let html = markdown;
    
    // Headers (do these first)
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>');
    
    // Lists - handle both * and -
    html = html.replace(/^[\*\-] (.+)$/gm, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li class="ml-4">.*<\/li>\n?)+/g, '<ul class="list-disc list-inside space-y-1 mb-3">$&</ul>');
    
    // Paragraphs - split on double newlines
    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    html = '<p class="mb-3">' + html + '</p>';
    
    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-3"><\/p>/g, '');
    
    return html;
  };

  const generateWithClaude = async () => {
    setIsGenerating(true);
    
    const basePrompt = buildPrompt();
    const prompt = `${basePrompt}

Write this content clearly and professionally. Use markdown formatting:
- Use ## for main section headers
- Use **bold** for emphasis on key points
- Use bullet points (- or *) for lists
- Use clear paragraph breaks

Return as JSON:
{
  "content": "your markdown content here"
}`;
  
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      let parsed;
      try {
        let outputText = data.output.trim();
        outputText = outputText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsed = JSON.parse(outputText);
        
        // Convert markdown to HTML
        const htmlContent = markdownToHtml(parsed.content);
        setOutput(htmlContent);
      } catch (e) {
        // Fallback: try to convert the raw output
        setOutput(markdownToHtml(data.output));
      }
    } catch (error) {
      console.error("Error:", error);
      setOutput("<p class='text-red-600'>Error generating output. Please try again.</p>");
    } finally {
      setIsGenerating(false);
    }
  };

  const buildPrompt = () => {
    let prompt = "Write talking points for a Hill meeting about the EPA air quality rule.\n\n";
    
    if (selections.context) {
      prompt += `Context: ${ingredients.context.options.find(o => o.id === selections.context).promptText}\n\n`;
    }
    if (selections.format) {
      prompt += `Format: ${ingredients.format.options.find(o => o.id === selections.format).promptText}\n\n`;
    }
    if (selections.audience) {
      prompt += `Audience: ${ingredients.audience.options.find(o => o.id === selections.audience).promptText}\n\n`;
    }
    if (selections.constraints) {
      prompt += `Constraints: ${ingredients.constraints.options.find(o => o.id === selections.constraints).promptText}\n\n`;
    }
    if (selections.goal) {
      prompt += `Goal: ${ingredients.goal.options.find(o => o.id === selections.goal).promptText}`;
    }
    
    return prompt;
  };

  const allSelected = Object.values(selections).every(v => v !== null);
  const selectedCount = Object.values(selections).filter(v => v !== null).length;

  const renderScenario = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{scenario.title}</h2>
            <p className="text-blue-800 font-semibold mb-2">{scenario.urgency}</p>
            <p className="text-blue-900">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Build Your Prompt</h3>
        <p className="text-gray-700 mb-4">
          Pick 5 ingredients. Watch how your choices shape the output.
        </p>
        <button
          onClick={() => setStage('builder')}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          Start <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const IngredientCard = ({ ingredientKey, data }) => {
    const selected = selections[ingredientKey];
    
    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
        <h4 className="font-bold text-gray-900 mb-3">{data.title}</h4>
        <div className="space-y-2">
          {data.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelections({ ...selections, [ingredientKey]: option.id })}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selected === option.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-sm">{option.label}</span>
                {selected === option.id && (
                  <CheckCircle size={18} className="text-purple-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPrompt = () => {
    const colors = {
      context: 'bg-orange-50 border-orange-300',
      format: 'bg-yellow-50 border-yellow-300',
      audience: 'bg-green-50 border-green-300',
      constraints: 'bg-blue-50 border-blue-300',
      goal: 'bg-purple-50 border-purple-300'
    };

    return (
      <div className="space-y-3">
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-3">
          <p className="text-sm font-medium text-gray-700">
            Write talking points for a Hill meeting about the EPA air quality rule.
          </p>
        </div>
        
        {Object.entries(selections).map(([key, value]) => {
          if (!value) return null;
          const option = ingredients[key].options.find(o => o.id === value);
          return (
            <div key={key} className={`${colors[key]} border-2 rounded-lg p-3`}>
              <div className="text-xs font-bold text-gray-700 mb-1">{ingredients[key].title.toUpperCase()}</div>
              <p className="text-sm font-medium text-gray-800">{option.promptText}</p>
            </div>
          );
        })}
        
        {selectedCount === 0 && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
            <p className="text-sm text-gray-500">Select ingredients to build your prompt</p>
          </div>
        )}
      </div>
    );
  };

  const renderBuilder = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-purple-600" size={20} />
            <div>
              <h2 className="font-bold">Prompt Builder</h2>
              <p className="text-xs text-gray-600">{selectedCount}/5 selected</p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelections({ context: null, format: null, audience: null, constraints: null, goal: null });
              setOutput('');
            }}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Ingredients */}
          <div className="space-y-4">
            <IngredientCard ingredientKey="context" data={ingredients.context} />
            <IngredientCard ingredientKey="format" data={ingredients.format} />
            <IngredientCard ingredientKey="audience" data={ingredients.audience} />
            <IngredientCard ingredientKey="constraints" data={ingredients.constraints} />
            <IngredientCard ingredientKey="goal" data={ingredients.goal} />
          </div>

          {/* Right: Prompt (sticky on desktop) */}
          <div>
            <div className="lg:sticky lg:top-4">
              <div className="bg-white rounded-lg shadow-lg p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Your Prompt</span>
                </h3>
                <div className="max-h-[600px] overflow-y-auto">
                  {renderPrompt()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output (appears above generate button) */}
        {output && (
          <div className="bg-white rounded-lg shadow-xl border-2 border-purple-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Zap size={20} className="text-purple-600" />
                Output
              </h3>
              <button
                onClick={generateWithClaude}
                disabled={isGenerating}
                className="text-sm text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <RefreshCw size={14} />
                Regenerate
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-[500px] overflow-y-auto">
              <div 
                className="text-gray-800 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: output }}
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-900">
                💡 Change any ingredient above and regenerate to see how output shifts
              </p>
            </div>
          </div>
        )}

        {/* Generate Button - always visible, stays in same place */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                {output ? 'Regenerate Output' : 'Generate Output'}
              </>
            )}
          </button>
        </div>

        {/* Continue Button - only shows after output */}
        {output && !isGenerating && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 text-center border-2 border-green-200">
            <CheckCircle className="mx-auto mb-3 text-green-600" size={32} />
            <h4 className="font-bold text-lg mb-2">Ready to continue?</h4>
            <p className="text-sm text-gray-700 mb-4">
              Experiment more, or move on when you've seen enough
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
    );
  };

  const renderComplete = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white text-center mb-6">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-bold mb-2">Nice Work</h2>
        <p className="text-green-50">You saw how strategic choices shape output</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">The 5 Ingredients:</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold mb-1">Context</div>
            <div className="text-gray-600">Different framings get different results - jobs vs timeline vs fairness</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold mb-1">Format</div>
            <div className="text-gray-600">Structure matters - talking points vs Q&A vs memo</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold mb-1">Audience</div>
            <div className="text-gray-600">Reader shapes content - political vs policy vs messaging</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold mb-1">Constraints</div>
            <div className="text-gray-600">Real limits drive structure - 2 min vs 15 min vs email</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="font-semibold mb-1">Goal</div>
            <div className="text-gray-600">Clear asks get concrete results - delay vs funding vs access</div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-3">Round 2 Complete</h3>
        <p className="text-gray-700 mb-6">Next: Write your own prompt from scratch</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setStage('builder')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700"
          >
            Try Again
          </button>
          <button
            onClick={() => onComplete && onComplete()}
            className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            Start Round 3 <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto mb-8 px-4 text-center">
        <div className="inline-block bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Round 2 of 3
        </div>
        <h1 className="text-4xl font-bold mb-2">Prompt Builder</h1>
        <p className="text-gray-600">See how strategic choices change output</p>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'builder' && renderBuilder()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round2GameV2;
