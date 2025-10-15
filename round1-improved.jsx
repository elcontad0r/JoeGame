import React, { useState } from 'react';
import { AlertCircle, CheckCircle, ArrowRight, Sparkles, X, Eye, Zap } from 'lucide-react';

const Round1Game = () => {
  const [stage, setStage] = useState('scenario'); // scenario, comparison, lesson-complete
  const [selectedIssue, setSelectedIssue] = useState(null);

  const scenario = {
    title: "Emergency: New EPA Rule Dropped",
    urgency: "Partner meeting in 15 minutes",
    situation: "EPA just released new air quality standards that will require your client, MidAtlantic Manufacturing, to retrofit 12 facilities at ~$40M cost. Client CEO is panicking. You need a briefing doc that explains the rule, impact, and potential response strategies.",
    client: "MidAtlantic Manufacturing",
    stakes: "High"
  };

  const issues = [
    {
      id: 'context',
      label: "Missing Context",
      joesSection: "The EPA has introduced new air quality standards that will impact manufacturing facilities across the United States.",
      improvedSection: "EXECUTIVE BRIEFING: EPA Air Quality Standards\nFor: MidAtlantic Manufacturing CEO\n\nNew EPA standards require 85% reduction in VOC emissions by January 2027. MidAtlantic's 12 coating facilities are directly affected. Estimated compliance cost: $38-42M.",
      problem: "Too generic - could be about any company",
      fix: "Lead with specific client details and concrete numbers"
    },
    {
      id: 'structure',
      label: "No Structure",
      joesSection: "These regulations aim to reduce emissions and improve environmental outcomes. Manufacturing companies will need to evaluate their current operations and determine what changes are necessary to comply with the new standards.",
      improvedSection: "RULE DETAILS:\n• Effective Date: Jan 1, 2027\n• Scope: Facilities emitting >25 tons/year VOCs (8 of 12 qualify)\n• Key Change: Limits reduced from 250 ppm to 35 ppm\n\nIMPACT ON MIDATLANTIC:\n• Capital Investment: $38-42M for scrubber systems\n• Timeline: 15-month window (normally 24+ months)\n• Operational: 3-4 week shutdown per facility",
      problem: "Vague paragraphs - partner can't scan this quickly",
      fix: "Use clear headers and bullets for scannability"
    },
    {
      id: 'strategy',
      label: "No Strategy",
      joesSection: "This may include equipment upgrades and process modifications. Companies should consider their options for compliance and may want to engage with regulators to understand the requirements better.",
      improvedSection: "RESPONSE OPTIONS:\n\n1. FULL COMPLIANCE\n   ✓ Zero regulatory risk\n   ✗ Full $40M cost, tight timeline\n\n2. LEGAL CHALLENGE\n   ✓ Could buy 18-24 months\n   ✗ Uncertain outcome\n\n3. HYBRID (Recommended)\n   ✓ Partial compliance + litigation\n   ✓ Shows good faith, preserves optionality\n   ✗ Still $20M upfront",
      problem: "Client asks 'what do we do?' and gets nothing",
      fix: "Provide concrete options with pros/cons"
    }
  ];

  const joesPrompt = "Write a brief about the new EPA air quality rule and how it affects manufacturing companies.";

  const renderScenario = () => (
    <div className="max-w-4xl mx-auto p-6">
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

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Let's see how Joe handled this...</h3>
        <button
          onClick={() => setStage('comparison')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          See Joe's Attempt <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="max-w-7xl mx-auto p-6">
      {/* Joe's prompt at top */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-4xl mx-auto">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">Joe's Prompt:</h3>
        <div className="bg-white p-4 rounded border border-gray-200 font-mono text-sm">
          {joesPrompt}
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Joe's output */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            What Joe Got:
          </h3>
          <div className="space-y-4">
            {issues.map((issue, idx) => (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className="p-4 bg-red-50 border-2 border-red-300 rounded-lg cursor-pointer hover:border-red-400 transition-all relative"
              >
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Issue #{idx + 1}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{issue.joesSection}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Better version */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-semibold text-lg mb-4 text-green-700 flex items-center gap-2">
            <CheckCircle size={20} />
            What Better Prompting Gets:
          </h3>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className="p-4 bg-green-50 border-2 border-green-300 rounded-lg cursor-pointer hover:border-green-400 transition-all relative"
              >
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Fixed
                </div>
                <pre className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">
                  {issue.improvedSection}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instruction to click */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
        <p className="text-sm text-blue-900 text-center">
          👆 Click any section to see the specific problem and fix
        </p>
      </div>

      {/* Continue button */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setStage('lesson-complete')}
          className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          I See The Difference <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderDetailModal = () => {
    if (!selectedIssue) return null;
    
    const issue = issues.find(i => i.id === selectedIssue);
    if (!issue) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={() => setSelectedIssue(null)}
      >
        <div 
          className="bg-white rounded-lg max-w-3xl w-full my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-t-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{issue.label}</h3>
                <p className="text-red-100">{issue.problem}</p>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="text-white hover:text-red-100"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content - now in a scrollable div */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* What was wrong */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                Joe's Version:
              </h4>
              <div className="bg-red-50 p-4 rounded border border-red-200 text-sm text-gray-700">
                {issue.joesSection}
              </div>
            </div>

            {/* The fix */}
            <div className="mb-6">
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle size={18} />
                The Fix: {issue.fix}
              </h4>
              <div className="bg-green-50 p-4 rounded border border-green-300 text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {issue.improvedSection}
              </div>
            </div>
          </div>

          {/* Footer button */}
          <div className="p-6 pt-0">
            <button
              onClick={() => setSelectedIssue(null)}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLessonComplete = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg mb-6 text-center">
        <Sparkles className="mx-auto mb-4" size={48} />
        <h2 className="text-3xl font-bold mb-3">You Spotted The Pattern</h2>
        <p className="text-green-100 text-lg">Same AI. Better instructions. Usable output.</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">The Three Core Fixes:</h3>
        <div className="space-y-4">
          {issues.map((issue, idx) => (
            <div key={issue.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">{issue.label}</div>
                <div className="text-sm text-gray-600">{issue.fix}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg p-6 text-center">
        <h3 className="text-2xl font-bold mb-3">Round 1 Complete</h3>
        <p className="text-gray-700 mb-6">
          Now let's have you build a prompt with some guidance...
        </p>
        <button
          onClick={() => alert('Moving to Round 2...')}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
        >
          Ready for Round 2 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto mb-6 px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">AI Prompting Game: Round 1</h1>
          <p className="text-gray-600">Learn by Comparing</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'comparison' && renderComparison()}
      {stage === 'lesson-complete' && renderLessonComplete()}
      
      {renderDetailModal()}
    </div>
  );
};

export default Round1Game;
