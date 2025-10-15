import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ArrowLeft, Clock, CheckCircle, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const Round1GameV3 = ({ onComplete, onBack }) => {
  const [stage, setStage] = useState('scenario');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showJoePrompt, setShowJoePrompt] = useState(true);
  const [showBetterPrompt, setShowBetterPrompt] = useState(true);

  const formatOutput = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^[A-Z][A-Z\s:]+$/)) {
        return <div key={i} className="font-bold text-gray-900 mt-3 first:mt-0">{line}</div>;
      }
      if (line.match(/^(For|Cost|Timeline|Risk):/)) {
        return <div key={i} className="text-gray-700">{line}</div>;
      }
      if (line.match(/^\d+\.\s+[A-Z]/)) {
        const parts = line.match(/^(\d+\.\s+)(.+)$/);
        if (parts) {
          return <div key={i} className="font-bold text-gray-900 mt-3">{parts[1]}{parts[2]}</div>;
        }
      }
      if (line.match(/^Option\s+\d+:/)) {
        return <div key={i} className="font-bold text-gray-900 mt-3">{line}</div>;
      }
      if (line.match(/^Core approach:/)) {
        return <div key={i} className="text-gray-700 italic">{line}</div>;
      }
      if (line.match(/^[•✓✗]/)) {
        return <div key={i} className="text-gray-700 ml-2">{line}</div>;
      }
      if (line.trim()) {
        return <div key={i} className="text-gray-700">{line}</div>;
      }
      return <div key={i} className="h-2"></div>;
    });
  };

  const scenario = {
    title: "Emergency: New EPA Rule Dropped",
    urgency: "Partner meeting in 15 minutes",
    situation: "EPA just released new air quality standards. Your client MidAtlantic Manufacturing has 12 coating facilities—8 of them now need ~$40M in retrofits by Jan 2027. CEO is panicking. Partner needs a briefing doc NOW.",
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Give AI Your Context",
      subtitle: "Generic prompts get generic garbage",
      joePrompt: "Write a brief about the new EPA air quality rule and how it affects manufacturing companies.",
      joeProblem: "Could be about anyone, anywhere. Zero specifics.",
      addition: "Add client details + real constraints",
      betterPrompt: `You're advising MidAtlantic Manufacturing's CEO who just learned about new EPA air quality standards.

Context:
- 12 coating facilities across 5 states
- 8 facilities emit >25 tons/year VOCs (currently legal)
- New rule: 85% VOC reduction required by Jan 2027
- Initial estimate: $38-42M compliance cost
- CEO meeting with board in 2 hours

Write a 1-page executive brief that:
1. Explains the rule change (what changed and why it matters)
2. Our specific exposure (which facilities, timeline pressure)
3. Three response options with pros/cons/rough costs
4. Your recommendation with reasoning

Format for scanning: section headers, bullets, keep dense.`,
      outputBefore: `The EPA has recently updated its air quality standards, introducing stricter limits on volatile organic compounds (VOCs) for manufacturing facilities. Companies will need to evaluate their current emissions levels and determine appropriate compliance pathways.

Key considerations include:
• Assessment of current emissions across all facilities
• Review of available control technologies
• Timeline for implementation
• Cost-benefit analysis of various approaches

Manufacturers should consider engaging with environmental consultants to develop a comprehensive compliance strategy that balances regulatory requirements with operational needs.`,
      outputAfter: `EXECUTIVE BRIEF: EPA VOC Standards
For: MidAtlantic Manufacturing CEO | Board Meeting: Today, 2pm

WHAT CHANGED
• EPA dropped VOC limits from 250 ppm to 35 ppm (86% reduction)
• Takes effect January 2027—only 26 months away
• Targets coating operations >25 tons/year
• 8 of our 12 facilities immediately affected

WHY THIS HURTS
• Normal retrofit timeline: 24-30 months (we have 26)
• Our 8 facilities are big emitters (40-80 tons/year each)
• Cannot run coating operations during retrofit (3-4 weeks per facility)
• Trade group estimates 15-20% of suppliers will struggle to comply → supply chain risk

RESPONSE OPTIONS

1. FULL COMPLIANCE NOW
• Install thermal oxidizers at all 8 facilities
• Cost: $38-42M | Timeline: 26 months (tight but possible)
✓ Zero regulatory risk, demonstrates leadership
✗ Entire capital budget for 2 years

2. STAGED COMPLIANCE
• Retrofit 5 worst facilities now, delay 3 others
• Cost: $24-28M upfront | Total: $40M over 3 years
✓ Spreads capital impact
✗ Regulatory exposure on 3 facilities (penalties ~$37K/day)

3. TECHNOLOGY BET
• Install newer bio-filtration systems (unproven at our scale)
• Cost: $22-26M | Timeline: 18-24 months
✓ 35% cheaper, faster installation
✗ HIGH RISK: Only 2 facilities this size using it

RECOMMENDATION: Full Compliance (Option 1)
Board needs to approve $40M tonight. Penalties and supply chain disruption from delay cost more than the capital hit.`
    },
    {
      id: 'constraints',
      title: "Tell AI Your Constraints",
      subtitle: "Tradeoffs matter more than options",
      joePrompt: "What options do we have for responding to this EPA rule?",
      joeProblem: "Generic list with no thought about tradeoffs or real-world friction",
      addition: "Add actual operating constraints",
      betterPrompt: `Analyze MidAtlantic's response options to the EPA VOC rule. Consider:

Our constraints:
- Capital budget this year: $50M (already allocated)
- Can't shut down more than 2 facilities simultaneously (supply chain)
- Trade association is organizing legal challenge
- 3 facilities are in attainment areas, 5 in non-attainment

Give me 3-4 strategic options beyond just "comply" or "sue." For each:
- Name it (2-3 words)
- Core approach
- Pros (✓) and Cons (✗) with specifics
- Ballpark cost and timeline
- Risk level (Low/Med/High)

End with which you'd recommend and one-sentence why.`,
      outputBefore: `There are several potential approaches to address the new EPA regulations:

1. Full Compliance
Install necessary equipment to meet the new standards across all affected facilities.

2. Legal Challenge
Work with industry groups to challenge the rule through administrative or judicial processes.

3. Partial Implementation
Prioritize compliance at the most critical facilities while exploring options for others.

4. Technology Solutions
Investigate emerging technologies that might offer more cost-effective compliance pathways.

Each approach has different costs, timelines, and risk profiles that should be carefully evaluated.`,
      outputAfter: `STRATEGIC OPTIONS ANALYSIS

Option 1: PARALLEL TRACK
Core approach: Start compliance prep while joining legal challenge
✓ Preserves legal rights without delaying engineering
✓ If challenge fails, we're ahead of competitors
✗ Spend $4-6M on engineering before knowing legal outcome
Cost: $42M total | Timeline: 26 months | Risk: MEDIUM

Option 2: CONSOLIDATION PLAY
Core approach: Close 3 facilities, shift production to compliant sites
✓ Only retrofit 5 facilities instead of 8 (~$12M savings)
✓ Permanently lower emissions footprint
✗ 180 job cuts (political/community relations hit)
✗ Stranded real estate assets (~$15M)
Cost: $28M + $15M stranded | Timeline: 18 months | Risk: MEDIUM-HIGH

Option 3: PHASED TECHNOLOGY BET
Core approach: Install bio-filtration at 3 facilities (test), thermal oxidizers at 5 (proven)
✓ Tests cheaper technology with safety net
✓ If bio works, save $8-10M on future retrofits
✗ Bio-filtration unproven at our coating volumes
Cost: $35-38M | Timeline: 28 months | Risk: MEDIUM

RECOMMENDATION: Phased Technology Bet (Option 3)
Balances capital constraints, tests promising tech with proven backup, and stays inside supply chain limits—worth the 2-month timeline squeeze.`
    },
    {
      id: 'role',
      title: "Define the Role & Audience",
      subtitle: "Same facts, different framing for different people",
      joePrompt: "Explain the EPA rule details.",
      joeProblem: "Gets a textbook explanation nobody can use in a meeting",
      addition: "Specify who needs this and how they'll use it",
      betterPrompt: `Brief your partner before the MidAtlantic CEO call. They're smart but haven't followed EPA stuff.

They need to know:
- What actually changed (not the whole rule, just what's new)
- Why EPA did this now (any legal/political context?)
- Timeline and key dates
- Ballpark costs for typical 50-person coating facility

Format:
- "WHAT CHANGED" (3-4 bullets max)
- "WHY NOW" (2-3 bullets)
- "KEY DATES" section
- "TYPICAL FACILITY COST" (one line)

Partner needs to sound informed in 90 seconds. Skip anything that won't come up in the call.`,
      outputBefore: `EPA Air Quality Standards Update

The Environmental Protection Agency (EPA) has issued a final rule revising the National Ambient Air Quality Standards (NAAQS) for volatile organic compounds. This rulemaking follows the Clean Air Act requirement for periodic review of air quality standards.

The updated standards reflect the latest scientific evidence regarding VOC emissions and their impact on air quality and public health. Facilities will need to implement Best Available Control Technology (BACT) or install emission control systems to achieve compliance.

The rule was published in the Federal Register and will become effective following the standard 60-day comment period.`,
      outputAfter: `PARTNER BRIEF: EPA VOC Rule

WHAT CHANGED
• VOC limit dropped from 250 ppm to 35 ppm (86% cut)
• Hits coating facilities >25 tons/year—mostly auto, aerospace, industrial coating
• Compliance deadline: January 1, 2027 (26 months)
• No grandfathering, no phase-in

WHY NOW
• EPA under court order from 2022 Sierra Club settlement
• New science links VOCs to ozone formation + respiratory issues in kids
• Biden admin's last big air rule before potential 2025 turnover

KEY DATES
• Jan 1, 2027: Compliance deadline (hard date)
• Q4 2025: EPA expects states to update implementation plans
• Equipment lead times: 12-14 months for thermal oxidizers

TYPICAL FACILITY COST
$4-6M for mid-size coating operation (thermal oxidizer + installation)—MidAtlantic has 8 affected facilities, so multiply it out.

CLIENT SPECIFIC
MidAtlantic's challenge is timeline, not cost—they need to retrofit 8 facilities in 26 months without disrupting production. That's the squeeze point.`
    }
  ];

  const lesson = lessons[currentLesson];

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
          <span className="text-sm font-medium">~4 minutes</span>
        </div>
        <h3 className="text-xl font-semibold mb-3">Joe (senior partner) tried using Claude...</h3>
        <p className="text-gray-700 mb-2">He got generic nonsense. You'll see exactly where it broke.</p>
        <p className="text-sm text-gray-600 mb-4">3 quick examples showing the difference between "meh" and "actually helpful"</p>
        <button
          onClick={() => setStage('lessons')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Show Me What Broke <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          {lessons.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === currentLesson ? 'w-12 bg-blue-600' :
                idx < currentLesson ? 'w-2 bg-green-500' :
                'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Example {currentLesson + 1} of {lessons.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mb-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
              {currentLesson + 1}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
              <p className="text-sm text-gray-600">{lesson.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Joe's attempt - collapsible */}
        <div className="mb-8">
          <button
            onClick={() => setShowJoePrompt(!showJoePrompt)}
            className="w-full bg-red-50 border-2 border-red-500 rounded-lg p-4 text-left hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <span className="font-bold text-red-900">Joe's Vague Prompt</span>
              </div>
              {showJoePrompt ? <ChevronUp size={20} className="text-red-600" /> : <ChevronDown size={20} className="text-red-600" />}
            </div>
          </button>
          
          {showJoePrompt && (
            <div className="mt-3 space-y-4">
              <div className="font-mono text-sm bg-gray-50 p-4 rounded border-2 border-red-200 text-gray-800">
                "{lesson.joePrompt}"
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-xs text-red-700 font-semibold mb-3">What Claude produced:</p>
                <div className="text-sm leading-relaxed bg-white p-4 rounded border border-red-100 max-h-64 overflow-y-auto">
                  {formatOutput(lesson.outputBefore)}
                </div>
              </div>
              <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                <p className="text-sm text-red-900">
                  <span className="font-bold">Why this sucks:</span> {lesson.joeProblem}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* The fix */}
        <div className="flex items-center justify-center my-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-bold shadow-lg flex items-center gap-2">
            <Zap size={20} />
            {lesson.addition}
          </div>
        </div>

        {/* Better version - collapsible */}
        <div>
          <button
            onClick={() => setShowBetterPrompt(!showBetterPrompt)}
            className="w-full bg-green-50 border-2 border-green-500 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-bold text-green-900">Better Prompt</span>
              </div>
              {showBetterPrompt ? <ChevronUp size={20} className="text-green-600" /> : <ChevronDown size={20} className="text-green-600" />}
            </div>
          </button>
          
          {showBetterPrompt && (
            <div className="mt-3 space-y-4">
              <div className="font-mono text-xs sm:text-sm bg-gray-50 p-4 rounded border-2 border-green-300 leading-relaxed max-h-64 overflow-y-auto">
                {lesson.betterPrompt.split('\n').map((line, i) => (
                  <div key={i} className="text-gray-800">{line}</div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-xs text-green-700 font-semibold mb-3">What Claude produced:</p>
                <div className="text-sm leading-relaxed bg-white p-4 rounded border border-green-100 max-h-96 overflow-y-auto">
                  {formatOutput(lesson.outputAfter)}
                </div>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                <p className="text-sm text-green-900 font-bold">
                  ✓ Actually useful: specific analysis, real recommendations, strategic thinking
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => {
            if (currentLesson > 0) {
              setCurrentLesson(currentLesson - 1);
              setShowJoePrompt(true);
              setShowBetterPrompt(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentLesson === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            currentLesson === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>

        {currentLesson < lessons.length - 1 ? (
          <button
            onClick={() => {
              setCurrentLesson(currentLesson + 1);
              setShowJoePrompt(true);
              setShowBetterPrompt(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Next Example <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={() => setStage('complete')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            See the Pattern <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* The Pattern */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white mb-8">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h3 className="text-3xl font-bold mb-3 text-center">You Spotted It</h3>
        <p className="text-xl mb-8 text-center text-green-50">
          Same AI. Better instructions. Actually useful output.
        </p>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-lg font-bold mb-4 text-center">The three things that matter:</div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <div className="font-bold text-lg">Context beats vagueness</div>
                <div className="text-green-50">Client name, numbers, timeline, constraints—specifics let AI analyze instead of just summarize</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <div className="font-bold text-lg">Constraints drive strategy</div>
                <div className="text-green-50">Budget limits, timeline pressure, political considerations—AI navigates tradeoffs if you tell it what matters</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <div className="font-bold text-lg">Role = relevance</div>
                <div className="text-green-50">Who's reading this? What do they need? How will they use it? Answer these and output quality jumps</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-green-100 italic">
            Joe's not dumb. His prompts were just lazy. Don't be Joe.
          </p>
        </div>
      </div>

      {/* Next step */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Step 1 Complete ✓</h2>
        <p className="text-gray-600 mb-6">
          You've seen what breaks and how to fix it. Now try building one yourself.
        </p>
        <button
          onClick={onComplete}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2 shadow-lg"
        >
          Start Step 2 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <div className="text-center">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Step 1: Observe
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            See What Joe Did Wrong
          </h1>
          <p className="text-gray-600">Same AI, different results—it's all in the setup</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'lessons' && renderLessons()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round1GameV3;
