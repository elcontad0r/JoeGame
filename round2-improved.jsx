import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ArrowRight, Sparkles, Zap, TrendingUp, Info } from 'lucide-react';

const Round2Game = () => {
  const [stage, setStage] = useState('scenario');
  const [selectedContext, setSelectedContext] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedAudience, setSelectedAudience] = useState(null);
  const [selectedConstraints, setSelectedConstraints] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const scenario = {
    title: "Plot Twist: Client Needs Hill Talking Points",
    urgency: "Senator's office just called - meeting in 2 hours",
    situation: "Your MidAtlantic Manufacturing client's CEO is getting pulled into an emergency meeting with Senator Casey's office about the EPA rule. They need crisp talking points for a 15-minute conversation. CEO is not a policy expert - needs it simple but credible.",
    newRequirement: "Talking points for Hill meeting"
  };

  const contextOptions = [
    {
      id: 'industry-macro',
      label: "Industry-Level Context",
      description: "Regional manufacturing impact, sector trends, competitive dynamics",
      quality: "medium",
      content: "Regional manufacturing sector context, competitive landscape"
    },
    {
      id: 'client-detailed',
      label: "Client Operations Detail",
      description: "Facility locations, employee count, revenue, specific operational constraints",
      quality: "strong",
      content: "MidAtlantic Manufacturing: 12 facilities (PA, OH, WV), 8 affected, 2,400 jobs, $38-42M cost, 15-month timeline vs 24+ needed"
    },
    {
      id: 'regulatory-history',
      label: "Regulatory Background",
      description: "Past EPA rules, compliance track record, previous interactions",
      quality: "weak",
      content: "Historical context on EPA regulations"
    },
    {
      id: 'financial-impact',
      label: "Financial Analysis",
      description: "Cost breakdowns, ROI implications, balance sheet impact",
      quality: "medium",
      content: "Detailed financial analysis of compliance costs"
    }
  ];

  const formatOptions = [
    {
      id: 'narrative',
      label: "Narrative Brief",
      description: "Flowing story that builds the argument",
      quality: "weak"
    },
    {
      id: 'hierarchical-bullets',
      label: "Hierarchical Bullets",
      description: "Main points with nested sub-points and evidence",
      quality: "strong"
    },
    {
      id: 'exec-summary',
      label: "Executive Summary Style",
      description: "Dense paragraph upfront, then supporting detail",
      quality: "medium"
    },
    {
      id: 'one-pager',
      label: "Structured One-Pager",
      description: "Sections with headers, mixed bullets and paragraphs",
      quality: "strong"
    }
  ];

  const audienceOptions = [
    {
      id: 'technical-staff',
      label: "Policy Specialists",
      description: "Senate committee staff who know regulations inside-out",
      quality: "weak"
    },
    {
      id: 'senior-staff',
      label: "Senior Legislative Staff",
      description: "Chief of Staff level, strategic thinkers, politically savvy",
      quality: "strong"
    },
    {
      id: 'general-audience',
      label: "Mixed Audience",
      description: "Could be staff or Senator, prepare for various levels",
      quality: "medium"
    },
    {
      id: 'senator-direct',
      label: "Senator Directly",
      description: "Principal, not staff - highest-level strategic framing",
      quality: "medium"
    }
  ];

  const constraintOptions = [
    {
      id: 'time-only',
      label: "15-Minute Meeting Window",
      description: "Just note the time constraint",
      quality: "weak"
    },
    {
      id: 'comprehensive',
      label: "Time + Reading Speed + Format",
      description: "15 min meeting, CEO scans in car (2 min), max 400 words",
      quality: "strong"
    },
    {
      id: 'ceo-prep',
      label: "CEO Prep Requirements",
      description: "Non-expert CEO, needs simple language, avoid jargon",
      quality: "strong"
    },
    {
      id: 'political-context',
      label: "Political Timing",
      description: "Senator up for re-election, focus on jobs/economy angle",
      quality: "medium"
    }
  ];

  const goalOptions = [
    {
      id: 'inform',
      label: "Inform About Impact",
      description: "Educate on what the rule means for the client",
      quality: "weak"
    },
    {
      id: 'specific-ask',
      label: "Get Specific Commitments",
      description: "Timeline extension support, appropriations language, EPA meeting",
      quality: "strong"
    },
    {
      id: 'relationship',
      label: "Build Relationship",
      description: "Establish ongoing dialogue, position as reliable partner",
      quality: "weak"
    },
    {
      id: 'strategic-positioning',
      label: "Strategic Positioning",
      description: "Frame as jobs issue, align with Senator's priorities, create action pathway",
      quality: "strong"
    }
  ];

  const allSelected = selectedContext && selectedFormat && selectedAudience && selectedConstraints && selectedGoal;

  // Calculate preview score
  const calculatePreviewScore = () => {
    if (!allSelected) return null;

    const contextObj = contextOptions.find(c => c.id === selectedContext);
    const formatObj = formatOptions.find(f => f.id === selectedFormat);
    const audienceObj = audienceOptions.find(a => a.id === selectedAudience);
    const constraintObj = constraintOptions.find(c => c.id === selectedConstraints);
    const goalObj = goalOptions.find(g => g.id === selectedGoal);

    let score = 0;
    if (contextObj.quality === 'strong') score += 25;
    else if (contextObj.quality === 'medium') score += 15;
    else score += 5;

    if (formatObj.quality === 'strong') score += 25;
    else if (formatObj.quality === 'medium') score += 15;
    else score += 5;

    if (audienceObj.quality === 'strong') score += 20;
    else if (audienceObj.quality === 'medium') score += 12;
    else score += 5;

    if (constraintObj.quality === 'strong') score += 15;
    else if (constraintObj.quality === 'medium') score += 10;
    else score += 5;

    if (goalObj.quality === 'strong') score += 15;
    else if (goalObj.quality === 'medium') score += 8;
    else score += 3;

    return score;
  };

  const previewScore = calculatePreviewScore();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStage('generating');

    await new Promise(resolve => setTimeout(resolve, 2000));

    const contextObj = contextOptions.find(c => c.id === selectedContext);
    const formatObj = formatOptions.find(f => f.id === selectedFormat);
    const goalObj = goalOptions.find(g => g.id === selectedGoal);

    let output = "";

    if (contextObj.quality === 'strong' && formatObj.quality === 'strong' && goalObj.quality === 'strong') {
      output = `HILL MEETING TALKING POINTS
Senator Casey's Office | EPA Air Quality Rule
MidAtlantic Manufacturing

EXECUTIVE SUMMARY
MidAtlantic Manufacturing: 12 facilities (PA/OH/WV), 8 affected by new VOC limits, 2,400 jobs, $38-42M compliance cost. Timeline compressed to 15 months vs 24+ needed. Seeking Senator's support for implementation flexibility and appropriations language.

KEY IMPACTS
• Capital Investment: $38-42M for scrubber systems across 8 facilities
• Jobs at Risk: 2,400 employees across affected plants
• Timeline Gap: 15-month window vs 24+ months needed
• Geographic Footprint: Concentrated in PA facilities

STRATEGIC POSITIONING
• Environmental Commitment: Not seeking exemption, just realistic timeline
• Economic Impact: Preserves manufacturing base and middle-class jobs
• Political Alignment: Jobs preservation aligns with Senator's manufacturing caucus work

SPECIFIC REQUESTS
1. Co-sponsor timeline extension language (18-month addition)
2. Support appropriations rider for compliance cost-sharing grants
3. Facilitate meeting between MidAtlantic CEO and EPA Administrator
4. Include in Senator's next manufacturing roundtable

ANTICIPATED PUSHBACK
Q: "Why can't you just comply?"
A: Engineering capacity bottleneck—scrubbers need 8-mo fabrication + 3-4 week shutdown per site

Q: "What if we do nothing?"
A: $25K/day penalties starting Feb 2027 → facility closures more economical

NEXT STEPS
• Follow-up meeting with Chief of Staff in 2 weeks
• Written ask memo within 48 hours
• Coordinate with Manufacturing Caucus staff`;
    } else if (contextObj.quality === 'strong' && formatObj.quality === 'strong') {
      output = `MEETING BRIEFING: EPA Rule Impact
MidAtlantic Manufacturing

COMPANY OVERVIEW
• 12 facilities across PA, OH, WV
• 2,400 employees at affected sites
• $38-42M estimated compliance investment
• 15-month implementation timeline

REGULATORY IMPACT
• New VOC emission limits (250 ppm → 35 ppm)
• 8 of 12 facilities require upgrades
• Compliance deadline: January 1, 2027
• Penalty structure: $25K/day for non-compliance

OPERATIONAL CHALLENGES
• Equipment lead times exceed available timeline
• Need 3-4 week shutdown per facility for installation
• Engineering capacity constraints across industry

COMPANY POSITION
• Committed to environmental compliance
• Seeking dialogue on implementation timeline
• Open to phased approach with accountability milestones`;
    } else if (formatObj.quality === 'strong') {
      output = `TALKING POINTS: EPA Air Quality Rule

SITUATION
• New EPA standards affecting manufacturing sector
• Implementation timeline creating industry challenges
• Regional economic implications

COMPANY PERSPECTIVE  
• Manufacturing operations face significant compliance costs
• Timeline compressed relative to typical regulatory transitions
• Seeking constructive dialogue with regulators

KEY POINTS
• Environmental goals are shared priorities
• Implementation feasibility is a practical concern
• Regional employment considerations are relevant

REQUEST
• Senator's awareness of manufacturing sector concerns
• Potential engagement with EPA leadership
• Consideration of industry coalition perspectives`;
    } else {
      output = `EPA Air Quality Rule Discussion Points

The EPA has introduced new air quality standards that affect manufacturing companies in the region. These regulations require facilities to make changes to their operations and invest in new equipment to meet the updated emission requirements.

Manufacturing businesses are evaluating what these new rules mean for their operations. The timeline for compliance is shorter than what many companies typically face, which creates some operational planning challenges.

Our company is looking at what needs to be done to meet the new standards. We want to work constructively with regulators while also considering the practical aspects of implementation.

We hope to have productive conversations with the Senator's office about these industry concerns. Many companies in the manufacturing sector are dealing with similar challenges.`;
    }

    setGeneratedOutput(output);
    evaluateOutput(output);
  };

  const evaluateOutput = (output) => {
    const contextObj = contextOptions.find(c => c.id === selectedContext);
    const formatObj = formatOptions.find(f => f.id === selectedFormat);
    const audienceObj = audienceOptions.find(a => a.id === selectedAudience);
    const constraintObj = constraintOptions.find(c => c.id === selectedConstraints);
    const goalObj = goalOptions.find(g => g.id === selectedGoal);

    const score = previewScore;
    const strengths = [];
    const improvements = [];

    if (contextObj.quality === 'strong') {
      strengths.push("Specific operational details make this concrete and credible");
    } else if (contextObj.quality === 'medium') {
      improvements.push("More specific client details would strengthen credibility");
    } else {
      improvements.push("Missing critical client-specific context");
    }

    if (formatObj.quality === 'strong') {
      strengths.push("Format is scannable and appropriate for time pressure");
    } else {
      improvements.push("Format doesn't match the quick-scan use case");
    }

    if (audienceObj.quality === 'strong') {
      strengths.push("Correctly targeted for senior staff level");
    } else if (audienceObj.quality === 'weak') {
      improvements.push("Audience framing could be more precise");
    }

    if (constraintObj.quality === 'strong') {
      strengths.push("Thoughtful constraints shape the output appropriately");
    }

    if (goalObj.quality === 'strong') {
      strengths.push("Clear, actionable objective drives strategic content");
    } else if (goalObj.quality === 'weak') {
      improvements.push("Goal isn't specific enough to drive useful output");
    }

    let verdict = "";
    if (score >= 85) {
      verdict = "Excellent. You understand how to craft prompts for real business scenarios.";
    } else if (score >= 70) {
      verdict = "Solid work. A few refinements would make this even more effective.";
    } else if (score >= 50) {
      verdict = "Decent foundation, but missing some key elements for this use case.";
    } else {
      verdict = "This needs work. Think about what makes talking points actually usable.";
    }

    setEvaluation({ score, strengths, improvements, verdict });
    setIsGenerating(false);
    setStage('results');
  };

  const renderScenario = () => (
    <div className="max-w-4xl mx-auto p-6">
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
        <h3 className="text-xl font-semibold mb-4">Now it's your turn to build the prompt</h3>
        <p className="text-gray-600 mb-6">You learned what makes good prompts in Round 1. Now let's apply it with some guidance.</p>
        <button
          onClick={() => setStage('build-prompt')}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Build Your Prompt <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const ChoiceSection = ({ number, title, options, selected, onSelect }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span className="bg-purple-100 text-purple-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">{number}</span>
        {title}
      </h3>
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selected === option.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold mb-1">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
              {selected === option.id && (
                <CheckCircle className="text-purple-600 flex-shrink-0 ml-2" size={20} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderBuildPrompt = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">Build Your Prompt</h2>
        <p className="text-gray-700">Choose the components. Think about what will make this actually useful.</p>
      </div>

      <ChoiceSection
        number={1}
        title="What context should Claude have?"
        options={contextOptions}
        selected={selectedContext}
        onSelect={setSelectedContext}
      />

      <ChoiceSection
        number={2}
        title="What format should the output use?"
        options={formatOptions}
        selected={selectedFormat}
        onSelect={setSelectedFormat}
      />

      <ChoiceSection
        number={3}
        title="Who's the audience?"
        options={audienceOptions}
        selected={selectedAudience}
        onSelect={setSelectedAudience}
      />

      <ChoiceSection
        number={4}
        title="What constraints matter?"
        options={constraintOptions}
        selected={selectedConstraints}
        onSelect={setSelectedConstraints}
      />

      <ChoiceSection
        number={5}
        title="What's the goal of this meeting?"
        options={goalOptions}
        selected={selectedGoal}
        onSelect={setSelectedGoal}
      />

      {/* Score preview */}
      {allSelected && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-900">Estimated Prompt Quality:</span>
            </div>
            <div className={`text-3xl font-bold ${
              previewScore >= 80 ? 'text-green-600' : 
              previewScore >= 60 ? 'text-yellow-600' : 
              'text-orange-600'
            }`}>
              {previewScore}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {previewScore >= 80 && "Strong choices - this should produce high-quality output"}
            {previewScore >= 60 && previewScore < 80 && "Decent selections - output will be usable but could be better"}
            {previewScore < 60 && "Weak combination - consider revising your choices"}
          </p>
        </div>
      )}

      {/* Generate Button */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6">
        <button
          onClick={handleGenerate}
          disabled={!allSelected || isGenerating}
          className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
            allSelected && !isGenerating
              ? 'bg-green-600 text-white hover:bg-green-700'
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
          <p className="text-sm text-gray-600 text-center mt-3">Select all five components to generate</p>
        )}
      </div>
    </div>
  );

  const renderGenerating = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
        </div>
        <h2 className="text-2xl font-bold mb-3">Claude is working…</h2>
        <p className="text-gray-600">Generating your talking points</p>
      </div>
    </div>
  );

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-300';
    if (score >= 60) return 'bg-yellow-50 border-yellow-300';
    return 'bg-orange-50 border-orange-300';
  };

  const renderResults = () => {
    if (!evaluation) return null;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Score Card */}
        <div className={`rounded-lg p-6 mb-6 border-2 ${getScoreBgColor(evaluation.score)}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Score</h2>
            <div className={`text-5xl font-bold ${getScoreColor(evaluation.score)}`}>
              {evaluation.score}
            </div>
          </div>
          <p className="text-gray-700 italic">{evaluation.verdict}</p>
        </div>

        {/* Generated Output */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600" />
            What Claude Generated:
          </h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
            {generatedOutput}
          </div>
        </div>

        {/* Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {evaluation.strengths.length > 0 && (
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

          {evaluation.improvements.length > 0 && (
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

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-3">Round 2 Complete</h3>
          <p className="text-gray-700 mb-6">
            {evaluation.score >= 80 
              ? "Excellent work! You've got the hang of this."
              : "Good effort! Want to try again with different choices, or move to Round 3?"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => {
                setStage('build-prompt');
                setSelectedContext(null);
                setSelectedFormat(null);
                setSelectedAudience(null);
                setSelectedConstraints(null);
                setSelectedGoal(null);
                setGeneratedOutput('');
                setEvaluation(null);
              }}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => alert('Round 3 coming up!')}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
            >
              Ready for Round 3 →
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto mb-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Prompting Game: Round 2</h1>
          <p className="text-gray-600">Build Your Prompt</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'build-prompt' && renderBuildPrompt()}
      {stage === 'generating' && renderGenerating()}
      {stage === 'results' && renderResults()}
    </div>
  );
};

export default Round2Game;
