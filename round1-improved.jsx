import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ArrowLeft, Clock, CheckCircle, X } from 'lucide-react';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [currentLesson, setCurrentLesson] = useState(0);

  const scenario = {
    title: "Emergency: New EPA Rule Dropped",
    urgency: "Partner meeting in 15 minutes",
    situation: "EPA just released new air quality standards. Your client MidAtlantic Manufacturing has 12 coating facilities—8 of them now need ~$40M in retrofits by Jan 2027. CEO is panicking. Partner needs a briefing doc NOW.",
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Context beats vagueness",
      joePrompt: "Write a brief about the new EPA air quality rule and how it affects manufacturing companies.",
      joeProblem: "No client details, no constraints, nothing specific",
      whatToAdd: "Add real context: client name, numbers, timeline, constraints",
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
- Assessment of current emissions across all facilities
- Review of available control technologies
- Timeline for implementation
- Cost-benefit analysis of various approaches

Manufacturers should consider engaging with environmental consultants to develop a comprehensive compliance strategy that balances regulatory requirements with operational needs.`,
      outputAfter: `EXECUTIVE BRIEF: EPA VOC Standards
For: MidAtlantic Manufacturing CEO | Board Meeting: Today, 2pm

WHAT CHANGED
- EPA dropped VOC limits from 250 ppm to 35 ppm (86% reduction)
- Takes effect January 2027—only 26 months away
- Targets coating operations >25 tons/year
- 8 of our 12 facilities immediately affected

WHY THIS HURTS
- Normal retrofit timeline: 24-30 months (we have 26)
- Our 8 facilities are big emitters (40-80 tons/year each)
- Cannot run coating operations during retrofit (3-4 weeks per facility)
- Trade group estimates 15-20% of suppliers will struggle to comply → supply chain risk

RESPONSE OPTIONS

1. FULL COMPLIANCE NOW
Install thermal oxidizers at all 8 facilities
Cost: $38-42M | Timeline: 26 months (tight but possible)
✓ Zero regulatory risk, demonstrates leadership
✗ Entire capital budget for 2 years

2. STAGED COMPLIANCE
Retrofit 5 worst facilities now, delay 3 others
Cost: $24-28M upfront | Total: $40M over 3 years
✓ Spreads capital impact
✗ Regulatory exposure on 3 facilities (penalties ~$37K/day)

3. TECHNOLOGY BET
Install newer bio-filtration systems (unproven at our scale)
Cost: $22-26M | Timeline: 18-24 months
✓ 35% cheaper, faster installation
✗ HIGH RISK: Only 2 facilities this size using it

RECOMMENDATION: Full Compliance (Option 1)
Board needs to approve $40M tonight. Penalties and supply chain disruption from delay cost more than the capital hit.`
    },
    {
      id: 'constraints',
      title: "Constraints drive strategy",
      joePrompt: "What options do we have for responding to this EPA rule?",
      joeProblem: "Generic list with no real-world thinking",
      whatToAdd: "Add operating constraints: budget, capacity limits, political context",
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
      title: "Role shapes relevance",
      joePrompt: "Explain the EPA rule details.",
      joeProblem: "Textbook explanation nobody can use",
      whatToAdd: "Specify who needs this and how they'll use it",
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
- VOC limit dropped from 250 ppm to 35 ppm (86% cut)
- Hits coating facilities >25 tons/year—mostly auto, aerospace, industrial coating
- Compliance deadline: January 1, 2027 (26 months)
- No grandfathering, no phase-in

WHY NOW
- EPA under court order from 2022 Sierra Club settlement
- New science links VOCs to ozone formation + respiratory issues in kids
- Biden admin's last big air rule before potential 2025 turnover

KEY DATES
- Jan 1, 2027: Compliance deadline (hard date)
- Q4 2025: EPA expects states to update implementation plans
- Equipment lead times: 12-14 months for thermal oxidizers

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
            <p className="text-red-800 font-semibold mb-2">{scenario.urgency}</p>
            <p className="text-red-900">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Clock size={18} />
          <span className="text-sm font-medium">~4 minutes</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">Joe (senior partner) tried using Claude...</h3>
        <p className="text-gray-700 mb-4">He got generic nonsense. You'll see exactly where it broke and how to fix it.</p>
        <button
          onClick={() => setStage('lessons')}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          Show Me <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
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

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
      </div>

      {/* Bad Prompt */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-red-900">Joe's Prompt</h3>
          <X className="text-red-600" size={20} />
        </div>
        <div className="bg-white border border-red-200 rounded p-4 mb-4">
          <p className="font-mono text-sm text-gray-800">"{lesson.joePrompt}"</p>
        </div>
      </div>

      {/* Bad Output */}
      <div className="bg-white border-2 border-red-300 rounded-lg p-5 mb-6">
        <h4 className="text-sm font-semibold text-red-700 mb-3">What Claude produced:</h4>
        <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {lesson.outputBefore}
        </div>
      </div>

      {/* Problem */}
      <div className="bg-red-100 border-l-4 border-red-500 rounded-r p-4 mb-8">
        <p className="text-red-900">
          <span className="font-bold">Why this is useless:</span> {lesson.joeProblem}
        </p>
      </div>

      {/* The Fix */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-6 mb-8 text-center">
        <p className="text-lg font-bold mb-2">The fix:</p>
        <p className="text-xl">{lesson.whatToAdd}</p>
      </div>

      {/* Better Prompt */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-green-900">Better Prompt</h3>
          <CheckCircle className="text-green-600" size={20} />
        </div>
        <div className="bg-white border border-green-200 rounded p-4">
          <pre className="font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
            {lesson.betterPrompt}
          </pre>
        </div>
      </div>

      {/* Better Output */}
      <div className="bg-white border-2 border-green-300 rounded-lg p-5 mb-6">
        <h4 className="text-sm font-semibold text-green-700 mb-3">What Claude produced:</h4>
        <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed font-mono">
          {lesson.outputAfter}
        </div>
      </div>

      {/* Why It Works */}
      <div className="bg-green-100 border-l-4 border-green-500 rounded-r p-4 mb-8">
        <p className="text-green-900 font-bold">
          ✓ Actually useful: specific, strategic, actionable
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            if (currentLesson > 0) {
              setCurrentLesson(currentLesson - 1);
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Next <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={() => setStage('complete')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Continue <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white mb-8">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h3 className="text-3xl font-bold mb-2 text-center">You Spotted It</h3>
        <p className="text-xl mb-6 text-center text-green-50">
          Same AI. Better instructions. Actually useful output.
        </p>
        
        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-lg font-bold mb-4">The three things that matter:</div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <div className="font-bold">Context beats vagueness</div>
                <div className="text-green-50 text-sm">Specifics let AI analyze instead of summarize</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <div className="font-bold">Constraints drive strategy</div>
                <div className="text-green-50 text-sm">AI navigates tradeoffs when you tell it what matters</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <div className="font-bold">Role shapes relevance</div>
                <div className="text-green-50 text-sm">Define who needs this and how they'll use it</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Round 1 Complete</h2>
        <p className="text-gray-600 mb-6">
          You've seen what breaks and how to fix it. Now try building one yourself.
        </p>
        <button
          onClick={onComplete}
          className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
        >
          Start Round 2 <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto mb-8 px-4 text-center">
        <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Round 1 of 3
        </div>
        <h1 className="text-4xl font-bold mb-2">See What Joe Did Wrong</h1>
        <p className="text-gray-600">Same AI, different results—it's all in the setup</p>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'lessons' && renderLessons()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round1GameV3;
