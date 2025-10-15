import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ArrowDown, Clock, CheckCircle } from 'lucide-react';

const Round1GameV2 = () => {
  const [stage, setStage] = useState('scenario'); // scenario, lessons, complete

  const scenario = {
    title: "Emergency: New EPA Rule Dropped",
    urgency: "Partner meeting in 15 minutes",
    situation: "EPA just released new air quality standards that will require your client, MidAtlantic Manufacturing, to retrofit 12 facilities at ~$40M cost. Client CEO is panicking. You need a briefing doc that explains the rule, impact, and potential response strategies.",
    client: "MidAtlantic Manufacturing"
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Add Specifics",
      joePrompt: "Write a brief about the new EPA air quality rule and how it affects manufacturing companies.",
      joeProblem: "Gets generic output that could be about anyone",
      addition: "Add client details and concrete numbers",
      betterPrompt: `Write a brief about the new EPA air quality rule for MidAtlantic Manufacturing's CEO.

Key facts:
- We have 12 coating facilities  
- Rule requires 85% VOC reduction by January 2027
- Estimated compliance cost: $38-42M
- 8 of our 12 facilities emit >25 tons/year VOCs`,
      highlight: ["MidAtlantic Manufacturing's CEO", "12 coating facilities", "85% VOC reduction", "January 2027", "$38-42M", "8 of our 12 facilities"],
      outputBefore: "The EPA has introduced new air quality standards that will impact manufacturing facilities across the United States. Companies will need to evaluate compliance options...",
      outputAfter: "EXECUTIVE BRIEFING: EPA Air Quality Standards\nFor: MidAtlantic Manufacturing CEO\n\nNew EPA standards require 85% reduction in VOC emissions by January 2027. MidAtlantic's 12 coating facilities are directly affected—8 facilities currently emit >25 tons/year VOCs.\n\nEstimated compliance cost: $38-42M."
    },
    {
      id: 'format',
      title: "Specify Format",
      joePrompt: "Explain the details of the rule and what it means for us.",
      joeProblem: "Gets long paragraphs that are hard to scan",
      addition: "Request scannable structure",
      betterPrompt: `Explain the EPA rule details and impact on MidAtlantic Manufacturing.

Format as:
- Clear section headers in ALL CAPS
- Bullet points for key facts
- Pro/con structure for any options
- Keep each bullet to 1-2 lines max

Partner needs to scan this in 30 seconds.`,
      highlight: ["Format as:", "section headers in ALL CAPS", "Bullet points", "Pro/con structure", "scan this in 30 seconds"],
      outputBefore: "The new regulations will require significant changes to manufacturing processes and equipment. Companies will need to consider various approaches to compliance, which may include capital investments, operational modifications, and engagement with regulatory agencies to ensure proper implementation...",
      outputAfter: `RULE DETAILS:
• Effective Date: Jan 1, 2027
• Scope: Facilities emitting >25 tons/year VOCs
• Key Change: Limits reduced from 250 ppm to 35 ppm

IMPACT ON MIDATLANTIC:
• Capital Investment: $38-42M for scrubber systems
• Timeline: 15-month window (normally 24+ months)
• Operational: 3-4 week shutdown per facility`
    },
    {
      id: 'action',
      title: "Demand Action Items",
      joePrompt: "What should we consider doing about this?",
      joeProblem: "Gets vague suggestions with no decision framework",
      addition: "Ask for specific options with trade-offs",
      betterPrompt: `Give me 3 response options for MidAtlantic Manufacturing on the EPA rule.

For each option:
- Name it clearly (2-3 words)
- List 2-3 pros with ✓
- List 2-3 cons with ✗
- Include rough cost/timeline

End with which option you'd recommend and why in one sentence.`,
      highlight: ["3 response options", "2-3 pros with ✓", "2-3 cons with ✗", "rough cost/timeline", "recommend and why"],
      outputBefore: "The company should evaluate compliance pathways and may want to consider legal options. It would be advisable to consult with environmental counsel and potentially engage with the EPA to better understand requirements...",
      outputAfter: `RESPONSE OPTIONS:

1. FULL COMPLIANCE
   ✓ Zero regulatory risk
   ✓ Demonstrates environmental leadership
   ✗ Full $40M cost, tight 15-month timeline
   ✗ Major operational disruption

2. LEGAL CHALLENGE  
   ✓ Could delay 18-24 months
   ✓ Lower initial capital outlay
   ✗ Uncertain outcome
   ✗ Potential reputational risk

3. HYBRID APPROACH (Recommended)
   ✓ Partial compliance shows good faith
   ✓ Preserves legal optionality
   ✗ Still requires ~$20M upfront
   
Recommend Hybrid: Demonstrates willingness to comply while preserving legal options if timeline proves unworkable.`
    }
  ];

  const renderScenario = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">{scenario.title}</h2>
            <p className="text-red-800 text-lg font-semibold mb-3">{scenario.urgency}</p>
            <p className="text-red-900 leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Clock size={18} />
          <span className="text-sm font-medium">~3 minutes</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Joe from your team tried using AI...</h3>
        <p className="text-gray-700 mb-4">See what went wrong and how to fix it (scroll through 3 quick examples)</p>
        <button
          onClick={() => setStage('lessons')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Show Me <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Progress indicator */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 sticky top-4 z-10">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">3 Quick Examples</span>
          <span className="text-gray-500">Scroll through all three ↓</span>
        </div>
        <div className="mt-2 flex gap-2">
          {lessons.map((_, idx) => (
            <div key={idx} className="flex-1 h-1.5 bg-blue-200 rounded-full">
              <div className="h-full bg-blue-600 rounded-full" style={{width: '100%'}}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-12 mb-12">
        {lessons.map((lesson, idx) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                {idx + 1}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
            </div>

            {/* Joe's attempt */}
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg mb-6">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Joe's Rushed Prompt:
              </h4>
              <div className="font-mono text-sm bg-white p-4 rounded border border-red-200 text-gray-800 mb-3">
                {lesson.joePrompt}
              </div>
              <p className="text-sm text-red-800 italic">
                <strong>Problem:</strong> {lesson.joeProblem}
              </p>
              <div className="mt-3 bg-red-100 p-3 rounded text-xs text-gray-700 font-mono">
                {lesson.outputBefore}
              </div>
            </div>

            {/* The transformation */}
            <div className="flex items-center justify-center my-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-16 bg-gray-300"></div>
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
                  {lesson.addition}
                </div>
                <div className="h-px w-16 bg-gray-300"></div>
              </div>
            </div>

            {/* Better version */}
            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle size={18} />
                Better Prompt:
              </h4>
              <div className="font-mono text-sm bg-white p-4 rounded border border-green-300 mb-3 leading-relaxed">
                {lesson.betterPrompt.split('\n').map((line, i) => {
                  let displayLine = line;
                  lesson.highlight.forEach(phrase => {
                    if (line.includes(phrase)) {
                      const parts = line.split(phrase);
                      displayLine = (
                        <span key={i}>
                          {parts[0]}
                          <span className="bg-yellow-200 px-1 font-bold">{phrase}</span>
                          {parts[1]}
                        </span>
                      );
                    }
                  });
                  return <div key={i} className="text-gray-800">{displayLine}</div>;
                })}
              </div>
              <p className="text-sm text-green-800 font-semibold mb-3">
                Now you get:
              </p>
              <div className="bg-green-100 p-4 rounded text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed">
                {lesson.outputAfter}
              </div>
            </div>

            {/* Separator arrow for all but last */}
            {idx < lessons.length - 1 && (
              <div className="flex justify-center mt-8">
                <ArrowDown className="text-gray-400" size={32} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-center text-white mb-8">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-bold mb-3">Pattern Spotted</h3>
        <p className="text-lg mb-2 text-green-50">
          Same AI. Better instructions. Usable output.
        </p>
        <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-sm font-semibold mb-2">The Three Fixes:</div>
          <div className="text-sm space-y-1 text-green-50">
            <div>1. Add specifics (client, numbers, timeline)</div>
            <div>2. Specify format (bullets, headers, structure)</div>
            <div>3. Demand action items (options, pros/cons, recommendation)</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setStage('complete')}
          className="bg-purple-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2 shadow-lg"
        >
          Next Round <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-3">Round 1 Complete</h2>
        <p className="text-gray-600 mb-8">
          Now let's have you build one with guidance...
        </p>
        <button
          onClick={() => alert('Moving to Round 2...')}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
        >
          Start Round 2 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <div className="text-center">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Round 1 of 5
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            AI Prompting: Learn by Comparing
          </h1>
          <p className="text-gray-600">See what goes wrong and how to fix it</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'lessons' && renderLessons()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round1GameV2;
