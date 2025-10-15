import React, { useState } from 'react';
import { AlertCircle, ArrowRight, ArrowDown, Clock, CheckCircle, Zap } from 'lucide-react';

const Round1GameV2 = ({ onComplete, onBack }) => {
  const [stage, setStage] = useState('scenario');

  const formatOutput = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // All caps headers (like "EXECUTIVE BRIEF:", "WHAT CHANGED", etc)
      if (line.match(/^[A-Z][A-Z\s:]+$/)) {
        return <div key={i} className="font-bold text-gray-900 mt-3 first:mt-0">{line}</div>;
      }
      // Section headers with context (like "For: MidAtlantic Manufacturing CEO")
      if (line.match(/^(For|Cost|Timeline|Risk):/)) {
        return <div key={i} className="text-gray-700">{line}</div>;
      }
      // Numbered options (like "1. FULL COMPLIANCE")
      if (line.match(/^\d+\.\s+[A-Z]/)) {
        const parts = line.match(/^(\d+\.\s+)(.+)$/);
        if (parts) {
          return <div key={i} className="font-bold text-gray-900 mt-3">{parts[1]}{parts[2]}</div>;
        }
      }
      // Option headers (like "Option 1: PARALLEL TRACK")
      if (line.match(/^Option\s+\d+:/)) {
        return <div key={i} className="font-bold text-gray-900 mt-3">{line}</div>;
      }
      // Core approach lines
      if (line.match(/^Core approach:/)) {
        return <div key={i} className="text-gray-700 italic">{line}</div>;
      }
      // Bullet points with checkmarks/x marks
      if (line.match(/^[•✓✗]/)) {
        return <div key={i} className="text-gray-700 ml-2">{line}</div>;
      }
      // Regular text
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
    client: "MidAtlantic Manufacturing"
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Give AI Your Context",
      joePrompt: "Write a brief about the new EPA air quality rule and how it affects manufacturing companies.",
      joeProblem: "Too generic—could be about anyone, anywhere",
      addition: "Add client specifics + constraints",
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
      highlight: [],
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
✓ May unlock "green" customers
✗ Entire capital budget for 2 years
✗ Complex sequencing to avoid supply disruptions

2. STAGED COMPLIANCE
• Retrofit 5 worst facilities now, delay 3 others
• Cost: $24-28M upfront | Total: $40M over 3 years
✓ Spreads capital impact
✓ Tests technology on smaller batch first
✗ Regulatory exposure on 3 facilities (penalties ~$37K/day)
✗ Doesn't solve timeline crunch

3. TECHNOLOGY BET
• Install newer bio-filtration systems (unproven at our scale)
• Cost: $22-26M | Timeline: 18-24 months
✓ 35% cheaper, faster installation
✓ Lower operating costs (no natural gas)
✗ HIGH RISK: Only 2 facilities this size using it
✗ If it fails, no time for Plan B

RECOMMENDATION: Full Compliance (Option 1)
Board needs to approve $40M tonight. Penalties and supply chain disruption from delay cost more than the capital hit. Legal challenge unlikely to succeed—EPA has clean record on air rules.

NEXT STEPS (if board approves)
• Engage Burns & McDonnell for engineering (2 weeks)
• Lock in equipment orders (12-week lead time)
• Notify customers of Q2 2026 capacity constraints`
    },
    {
      id: 'constraints',
      title: "Give AI Your Constraints",
      joePrompt: "What options do we have for responding to this EPA rule?",
      joeProblem: "Generic options with no thought about tradeoffs",
      addition: "Add real-world constraints",
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
      highlight: [],
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
Core approach: Start compliance prep while joining trade association legal challenge
✓ Preserves legal rights without delaying engineering
✓ If challenge fails, we're ahead of competitors
✓ Demonstrates good faith to regulators
✗ Spend $4-6M on engineering before knowing legal outcome
✗ Trade association wants members to delay compliance (creates tension)
Cost: $42M total | Timeline: 26 months | Risk: MEDIUM

Option 2: CONSOLIDATION PLAY
Core approach: Close 3 facilities in non-attainment areas, shift production to compliant facilities
✓ Only need to retrofit 5 facilities instead of 8 (~$12M savings)
✓ Permanently lower emissions footprint
✓ May qualify for EPA SmartWay partnership benefits
✗ 180 job cuts (political/community relations hit)
✗ Stranded real estate assets (~$15M)
✗ Remaining facilities run at 95%+ capacity (fragile)
Cost: $28M + $15M stranded assets | Timeline: 18 months | Risk: MEDIUM-HIGH

Option 3: ACQUIRE COMPLIANT CAPACITY
Core approach: Buy recently-compliant competitor, shift volume, divest dirty facilities
✓ Immediate compliance (if deal closes by Q3 2025)
✓ Potential market share gain
✗ Requires finding willing seller
✗ Integration complexity
✗ Likely $80-120M total cost
Cost: $80-120M | Timeline: 12-18 months | Risk: HIGH

Option 4: PHASED TECHNOLOGY BET
Core approach: Install bio-filtration at 3 facilities (test), thermal oxidizers at 5 (proven)
✓ Tests cheaper technology with safety net
✓ If bio works, save $8-10M on future retrofits
✓ Spreads capital over 2 budget cycles
✗ Still need to sequence carefully (can only shut 2 at once)
✗ Bio-filtration unproven at our coating volumes
Cost: $35-38M | Timeline: 28 months | Risk: MEDIUM

RECOMMENDATION: Phased Technology Bet (Option 4)
Balances capital constraints, tests promising tech with proven backup, and stays inside your supply chain limits—worth the 2-month timeline squeeze.`
    },
    {
      id: 'role',
      title: "Tell AI Its Role",
      joePrompt: "Explain the EPA rule details.",
      joeProblem: "Gets a textbook explanation, not a briefing",
      addition: "Define the role and audience",
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
      highlight: [],
      outputBefore: `EPA Air Quality Standards Update

The Environmental Protection Agency (EPA) has issued a final rule revising the National Ambient Air Quality Standards (NAAQS) for volatile organic compounds. This rulemaking follows the Clean Air Act requirement for periodic review of air quality standards.

The updated standards reflect the latest scientific evidence regarding VOC emissions and their impact on air quality and public health. Facilities will need to implement Best Available Control Technology (BACT) or install emission control systems to achieve compliance.

The rule was published in the Federal Register and will become effective following the standard 60-day comment period. Affected sources should review their current permits and begin planning for necessary upgrades.`,
      outputAfter: `PARTNER BRIEF: EPA VOC Rule

WHAT CHANGED
• VOC limit dropped from 250 ppm to 35 ppm (86% cut)
• Hits coating facilities >25 tons/year—mostly auto, aerospace, industrial coating
• Compliance deadline: January 1, 2027 (26 months)
• No grandfathering, no phase-in

WHY NOW
• EPA under court order from 2022 Sierra Club settlement (they missed 2020 deadline)
• New science links VOCs to ozone formation + respiratory issues in kids
• Biden admin's last big air rule before potential 2025 turnover

KEY DATES
• Jan 1, 2027: Compliance deadline (hard date)
• Q4 2025: EPA expects states to update implementation plans
• Equipment lead times: 12-14 months for thermal oxidizers (most common fix)

TYPICAL FACILITY COST
$4-6M for mid-size coating operation (thermal oxidizer + installation)—MidAtlantic has 8 affected facilities, so multiply it out.

CLIENT SPECIFIC
MidAtlantic's challenge is timeline, not cost—they need to retrofit 8 facilities in 26 months without disrupting production. That's the squeeze point CEO will focus on.`
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
          <span className="text-sm font-medium">~4 minutes</span>
        </div>
        <h3 className="text-xl font-semibold mb-3">Your colleague Joe tried using Claude...</h3>
        <p className="text-gray-700 mb-2">He got generic garbage. You'll see why—and how to fix it.</p>
        <p className="text-sm text-gray-600 mb-4">Scroll through 3 quick before/after examples that show the real difference</p>
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
      {/* Lessons */}
      <div className="space-y-12 mb-12">
        {lessons.map((lesson, idx) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                {idx + 1}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{lesson.title}</h3>
            </div>

            {/* Joe's attempt */}
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg mb-6">
              <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Joe's Vague Prompt:
              </h4>
              <div className="font-mono text-sm bg-white p-4 rounded border border-red-200 text-gray-800 mb-4">
                "{lesson.joePrompt}"
              </div>
              <div className="bg-white border border-red-200 rounded p-4">
                <p className="text-xs text-red-700 font-semibold mb-3">Claude's response:</p>
                <div className="text-sm leading-relaxed">
                  {formatOutput(lesson.outputBefore)}
                </div>
              </div>
              <p className="text-sm text-red-800 font-semibold mt-3">
                Problem: {lesson.joeProblem}
              </p>
            </div>

            {/* The transformation */}
            <div className="flex items-center justify-center my-8">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 sm:w-20 bg-gray-300"></div>
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 whitespace-nowrap">
                  <Zap size={16} />
                  {lesson.addition}
                </div>
                <div className="h-px w-12 sm:w-20 bg-gray-300"></div>
              </div>
            </div>

            {/* Better version */}
            <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle size={18} />
                Better Prompt (with context):
              </h4>
              <div className="font-mono text-sm bg-white p-4 rounded border border-green-300 mb-4 leading-relaxed max-h-64 overflow-y-auto">
                {lesson.betterPrompt.split('\n').map((line, i) => {
                  let hasHighlight = false;
                  lesson.highlight.forEach(phrase => {
                    if (line.includes(phrase)) hasHighlight = true;
                  });
                  
                  if (hasHighlight) {
                    let result = line;
                    lesson.highlight.forEach(phrase => {
                      if (line.includes(phrase)) {
                        result = result.replace(phrase, `<mark class="bg-yellow-200 px-1 font-semibold">${phrase}</mark>`);
                      }
                    });
                    return <div key={i} className="text-gray-800" dangerouslySetInnerHTML={{__html: result}} />;
                  }
                  return <div key={i} className="text-gray-800">{line}</div>;
                })}
              </div>
              <div className="bg-white border border-green-300 rounded p-4">
                <p className="text-xs text-green-700 font-semibold mb-3">Claude's response:</p>
                <div className="text-sm leading-relaxed max-h-96 overflow-y-auto">
                  {formatOutput(lesson.outputAfter)}
                </div>
              </div>
              <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4">
                <p className="text-sm text-green-900 font-semibold">
                  ✓ Now you get: Real analysis, specific recommendations, actual strategic thinking
                </p>
              </div>
            </div>

            {/* Separator arrow for all but last */}
            {idx < lessons.length - 1 && (
              <div className="flex justify-center mt-10">
                <div className="text-center">
                  <ArrowDown className="text-gray-400 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-500">Keep scrolling</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-xl p-8 text-white mb-8">
        <CheckCircle className="mx-auto mb-4" size={48} />
        <h3 className="text-2xl font-bold mb-3 text-center">The Pattern</h3>
        <p className="text-lg mb-6 text-center text-green-50">
          Same AI. Better instructions. Actually useful output.
        </p>
        <div className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-base font-semibold mb-3">The three fixes that matter:</div>
          <div className="space-y-3 text-green-50">
            <div className="flex items-start gap-3">
              <div className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <div>
                <div className="font-semibold">Give AI your context</div>
                <div className="text-sm">Client name, numbers, timeline, constraints—specifics let AI analyze, not just summarize</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <div>
                <div className="font-semibold">Add your constraints</div>
                <div className="text-sm">Budget, timeline, political considerations—AI can navigate tradeoffs if you tell it what matters</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white bg-opacity-30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <div>
                <div className="font-semibold">Define the role</div>
                <div className="text-sm">Who's the audience? What do they need? How will they use it? Role clarity = output relevance</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-green-100">
            You just saw AI go from "meh" to "holy shit, that's actually helpful"
          </p>
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
        <p className="text-gray-600 mb-2">
          You've seen the difference. Now let's have you try it.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Next: Build a prompt yourself with live feedback
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onComplete}
            className="bg-purple-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
          >
            Start Round 2 <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <div className="text-center">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Round 1 of 3
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Learn AI Prompting by Comparison
          </h1>
          <p className="text-gray-600">See what breaks and how to fix it</p>
        </div>
      </div>

      {stage === 'scenario' && renderScenario()}
      {stage === 'lessons' && renderLessons()}
      {stage === 'complete' && renderComplete()}
    </div>
  );
};

export default Round1GameV2;
