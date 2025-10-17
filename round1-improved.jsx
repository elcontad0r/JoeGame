import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ArrowRight, ArrowLeft, Clock, CheckCircle, X, Lightbulb } from 'lucide-react';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [currentLesson, setCurrentLesson] = useState(0);
  const contentRef = useRef(null);

  const scenario = {
    title: "Emergency: New EPA Rule Dropped",
    urgency: "Partner meeting in 15 minutes",
    situation: "EPA just released new air quality standards. Your client MidAtlantic Manufacturing has 12 coating facilities—8 of them now need ~$40M in retrofits by Jan 2027. CEO is panicking. Partner needs a briefing doc NOW.",
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Context beats vagueness",
      lesson: "Generic questions → generic answers. Add client details, numbers, and constraints.",
      
      badPrompt: "Write a brief about the new EPA air quality rule and how it affects manufacturing companies.",
      badOutput: `<p class="mb-3">The EPA has recently updated its air quality standards, introducing stricter limits on volatile organic compounds (VOCs) for manufacturing facilities. Companies will need to evaluate their current emissions levels and determine appropriate compliance pathways.</p>

<p class="mb-2 font-semibold">Key considerations include:</p>
<ul class="list-disc list-inside space-y-1 mb-3">
<li>Assessment of current emissions across all facilities</li>
<li>Review of available control technologies</li>
<li>Timeline for implementation</li>
<li>Cost-benefit analysis of various approaches</li>
</ul>

<p>Manufacturers should consider engaging with environmental consultants to develop a comprehensive compliance strategy that balances regulatory requirements with operational needs.</p>`,
      
      goodPrompt: `You're advising MidAtlantic Manufacturing's CEO who just learned about new EPA air quality standards.

Context:
• 12 coating facilities across 5 states
• 8 facilities emit >25 tons/year VOCs (currently legal)
• New rule: 85% VOC reduction required by Jan 2027
• Initial estimate: $38-42M compliance cost
• CEO meeting with board in 2 hours

Write a 1-page executive brief that:
1. Explains the rule change (what changed and why it matters)
2. Our specific exposure (which facilities, timeline pressure)
3. Three response options with pros/cons/rough costs
4. Your recommendation with reasoning

Format for scanning: section headers, bullets, keep dense.`,
      goodOutput: `<div class="space-y-4">
<div>
<h3 class="font-bold text-base mb-1">EXECUTIVE BRIEF: EPA VOC Standards</h3>
<p class="text-sm text-gray-600">For: MidAtlantic Manufacturing CEO | Board Meeting: Today, 2pm</p>
</div>

<div>
<h4 class="font-semibold text-sm mb-1.5">WHAT CHANGED</h4>
<ul class="space-y-1 text-sm">
<li>• EPA dropped VOC limits from 250 ppm to 35 ppm (86% reduction)</li>
<li>• Takes effect January 2027—only 26 months away</li>
<li>• Targets coating operations >25 tons/year</li>
<li>• 8 of our 12 facilities immediately affected</li>
</ul>
</div>

<div>
<h4 class="font-semibold text-sm mb-1.5">WHY THIS HURTS</h4>
<ul class="space-y-1 text-sm">
<li>• Normal retrofit timeline: 24-30 months (we have 26)</li>
<li>• Our 8 facilities are big emitters (40-80 tons/year each)</li>
<li>• Cannot run coating during retrofit (3-4 weeks per facility)</li>
<li>• 15-20% of suppliers will struggle → supply chain risk</li>
</ul>
</div>

<div>
<h4 class="font-semibold text-sm mb-2">RESPONSE OPTIONS</h4>

<div class="mb-3 pb-3 border-b border-gray-200">
<p class="font-semibold text-sm mb-1">1. FULL COMPLIANCE NOW</p>
<p class="text-sm mb-1">Install thermal oxidizers at all 8 facilities</p>
<p class="text-sm mb-1">Cost: $38-42M | Timeline: 26 months (tight but possible)</p>
<p class="text-sm text-green-700">✓ Zero regulatory risk, demonstrates leadership</p>
<p class="text-sm text-red-700">✗ Entire capital budget for 2 years</p>
</div>

<div class="mb-3 pb-3 border-b border-gray-200">
<p class="font-semibold text-sm mb-1">2. STAGED COMPLIANCE</p>
<p class="text-sm mb-1">Retrofit 5 worst facilities now, delay 3 others</p>
<p class="text-sm mb-1">Cost: $24-28M upfront | Total: $40M over 3 years</p>
<p class="text-sm text-green-700">✓ Spreads capital impact</p>
<p class="text-sm text-red-700">✗ Regulatory exposure on 3 facilities (penalties ~$37K/day)</p>
</div>

<div class="mb-3">
<p class="font-semibold text-sm mb-1">3. TECHNOLOGY BET</p>
<p class="text-sm mb-1">Install newer bio-filtration (unproven at our scale)</p>
<p class="text-sm mb-1">Cost: $22-26M | Timeline: 18-24 months</p>
<p class="text-sm text-green-700">✓ 35% cheaper, faster installation</p>
<p class="text-sm text-red-700">✗ HIGH RISK: Only 2 facilities this size using it</p>
</div>
</div>

<div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
<p class="font-semibold text-sm mb-1">RECOMMENDATION: Full Compliance (Option 1)</p>
<p class="text-sm">Board needs to approve $40M tonight. Penalties and supply chain disruption cost more than the capital hit.</p>
</div>
</div>`
    },
    {
      id: 'constraints',
      title: "Constraints drive strategy",
      lesson: "Generic options lists miss real tradeoffs. Add budget limits, operational constraints, and context.",
      
      badPrompt: "What options do we have for responding to this EPA rule?",
      badOutput: `<p class="mb-3">There are several potential approaches to address the new EPA regulations:</p>

<div class="space-y-3 mb-3">
<div>
<p class="font-semibold mb-1">1. Full Compliance</p>
<p>Install necessary equipment to meet the new standards across all affected facilities.</p>
</div>

<div>
<p class="font-semibold mb-1">2. Legal Challenge</p>
<p>Work with industry groups to challenge the rule through administrative or judicial processes.</p>
</div>

<div>
<p class="font-semibold mb-1">3. Partial Implementation</p>
<p>Prioritize compliance at the most critical facilities while exploring options for others.</p>
</div>

<div>
<p class="font-semibold mb-1">4. Technology Solutions</p>
<p>Investigate emerging technologies that might offer more cost-effective compliance pathways.</p>
</div>
</div>

<p>Each approach has different costs, timelines, and risk profiles that should be carefully evaluated.</p>`,
      
      goodPrompt: `Analyze MidAtlantic's response options to the EPA VOC rule. Consider:

Our constraints:
• Capital budget this year: $50M (already allocated)
• Can't shut down more than 2 facilities simultaneously (supply chain)
• Trade association is organizing legal challenge
• 3 facilities are in attainment areas, 5 in non-attainment

Give me 3-4 strategic options beyond just 'comply' or 'sue.' For each:
• Name it (2-3 words)
• Core approach
• Pros (✓) and Cons (✗) with specifics
• Ballpark cost and timeline
• Risk level (Low/Med/High)

End with which you'd recommend and one-sentence why.`,
      goodOutput: `<div class="space-y-4">
<h3 class="font-bold text-base mb-3">STRATEGIC OPTIONS ANALYSIS</h3>

<div class="border-l-4 border-blue-500 pl-3 pb-3">
<p class="font-semibold text-sm mb-1">Option 1: PARALLEL TRACK</p>
<p class="text-sm mb-2"><em>Core approach:</em> Start compliance prep while joining legal challenge</p>
<p class="text-sm text-green-700">✓ Preserves legal rights without delaying engineering</p>
<p class="text-sm text-green-700">✓ If challenge fails, we're ahead of competitors</p>
<p class="text-sm text-red-700 mb-2">✗ Spend $4-6M on engineering before knowing outcome</p>
<p class="text-sm font-medium">Cost: $42M total | Timeline: 26 months | Risk: <span class="text-orange-600">MEDIUM</span></p>
</div>

<div class="border-l-4 border-orange-500 pl-3 pb-3">
<p class="font-semibold text-sm mb-1">Option 2: CONSOLIDATION PLAY</p>
<p class="text-sm mb-2"><em>Core approach:</em> Close 3 facilities, shift production to compliant sites</p>
<p class="text-sm text-green-700">✓ Only retrofit 5 facilities instead of 8 (~$12M savings)</p>
<p class="text-sm text-green-700">✓ Permanently lower emissions footprint</p>
<p class="text-sm text-red-700">✗ 180 job cuts (political/community relations hit)</p>
<p class="text-sm text-red-700 mb-2">✗ Stranded real estate assets (~$15M)</p>
<p class="text-sm font-medium">Cost: $28M + $15M stranded | Timeline: 18 months | Risk: <span class="text-red-600">MEDIUM-HIGH</span></p>
</div>

<div class="border-l-4 border-green-500 pl-3 pb-3">
<p class="font-semibold text-sm mb-1">Option 3: PHASED TECHNOLOGY BET</p>
<p class="text-sm mb-2"><em>Core approach:</em> Install bio-filtration at 3 facilities (test), thermal oxidizers at 5 (proven)</p>
<p class="text-sm text-green-700">✓ Tests cheaper technology with safety net</p>
<p class="text-sm text-green-700">✓ If bio works, save $8-10M on future retrofits</p>
<p class="text-sm text-red-700 mb-2">✗ Bio-filtration unproven at our coating volumes</p>
<p class="text-sm font-medium">Cost: $35-38M | Timeline: 28 months | Risk: <span class="text-orange-600">MEDIUM</span></p>
</div>

<div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
<p class="font-semibold text-sm mb-1">RECOMMENDATION: Phased Technology Bet (Option 3)</p>
<p class="text-sm">Balances capital constraints, tests promising tech with proven backup, stays inside supply chain limits—worth the 2-month timeline squeeze.</p>
</div>
</div>`
    },
    {
      id: 'role',
      title: "Role shapes relevance",
      lesson: "Academic explanations waste time. Define who needs this and how they'll use it.",
      
      badPrompt: "Explain the EPA rule details.",
      badOutput: `<h3 class="font-semibold text-base mb-3">EPA Air Quality Standards Update</h3>

<p class="mb-3">The Environmental Protection Agency (EPA) has issued a final rule revising the National Ambient Air Quality Standards (NAAQS) for volatile organic compounds. This rulemaking follows the Clean Air Act requirement for periodic review of air quality standards.</p>

<p class="mb-3">The updated standards reflect the latest scientific evidence regarding VOC emissions and their impact on air quality and public health. Facilities will need to implement Best Available Control Technology (BACT) or install emission control systems to achieve compliance.</p>

<p>The rule was published in the Federal Register and will become effective following the standard 60-day comment period.</p>`,
      
      goodPrompt: `Brief your partner before the MidAtlantic CEO call. They're smart but haven't followed EPA stuff.

They need to know:
• What actually changed (not the whole rule, just what's new)
• Why EPA did this now (any legal/political context?)
• Timeline and key dates
• Ballpark costs for typical 50-person coating facility

Format:
• 'WHAT CHANGED' (3-4 bullets max)
• 'WHY NOW' (2-3 bullets)
• 'KEY DATES' section
• 'TYPICAL FACILITY COST' (one line)

Partner needs to sound informed in 90 seconds. Skip anything that won't come up in the call.`,
      goodOutput: `<div class="space-y-3">
<h3 class="font-bold text-base mb-3">PARTNER BRIEF: EPA VOC Rule</h3>

<div>
<h4 class="font-semibold text-sm mb-1.5">WHAT CHANGED</h4>
<ul class="space-y-1 text-sm">
<li>• VOC limit dropped from 250 ppm to 35 ppm (86% cut)</li>
<li>• Hits coating facilities >25 tons/year—auto, aerospace, industrial</li>
<li>• Compliance deadline: January 1, 2027 (26 months)</li>
<li>• No grandfathering, no phase-in</li>
</ul>
</div>

<div>
<h4 class="font-semibold text-sm mb-1.5">WHY NOW</h4>
<ul class="space-y-1 text-sm">
<li>• EPA under court order from 2022 Sierra Club settlement</li>
<li>• New science links VOCs to ozone + respiratory issues in kids</li>
<li>• Biden admin's last big air rule before potential 2025 turnover</li>
</ul>
</div>

<div>
<h4 class="font-semibold text-sm mb-1.5">KEY DATES</h4>
<ul class="space-y-1 text-sm">
<li>• Jan 1, 2027: Compliance deadline (hard date)</li>
<li>• Q4 2025: EPA expects states to update implementation plans</li>
<li>• Equipment lead times: 12-14 months for thermal oxidizers</li>
</ul>
</div>

<div>
<h4 class="font-semibold text-sm mb-1.5">TYPICAL FACILITY COST</h4>
<p class="text-sm">$4-6M for mid-size coating operation (thermal oxidizer + installation)—MidAtlantic has 8 affected facilities, so multiply it out.</p>
</div>

<div class="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
<h4 class="font-semibold text-sm mb-1">CLIENT SPECIFIC</h4>
<p class="text-sm">MidAtlantic's challenge is timeline, not cost—they need to retrofit 8 facilities in 26 months without disrupting production. That's the squeeze point.</p>
</div>
</div>`
    }
  ];

  const lesson = lessons[currentLesson];

  // Scroll to content when lesson changes
  useEffect(() => {
    if (contentRef.current && stage === 'lessons') {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentLesson, stage]);

  const renderScenario = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={22} />
          <div>
            <h2 className="text-xl font-bold text-red-900 mb-1">{scenario.title}</h2>
            <p className="text-red-700 font-semibold text-sm mb-2">{scenario.urgency}</p>
            <p className="text-red-900 text-sm leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-2">Joe (senior partner) tried using Claude...</h3>
        <p className="text-gray-700 text-sm mb-4">
          He got generic nonsense. See the before/after and spot the pattern.
        </p>
        <div className="flex items-center gap-3 text-gray-500 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>~4 minutes</span>
          </div>
          <span>•</span>
          <span>3 examples</span>
        </div>
        <button
          onClick={() => setStage('lessons')}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          Show Me <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Progress indicator */}
      <div className="mb-8" ref={contentRef}>
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

      {/* Side-by-side comparison */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* BEFORE Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <X className="text-red-600" size={20} />
            <h3 className="font-bold text-red-900 text-lg">BEFORE (Joe's way)</h3>
          </div>

          {/* Bad Prompt */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wide">Prompt</div>
            <div className="bg-white rounded p-3 text-sm text-gray-800 leading-relaxed">
              "{lesson.badPrompt}"
            </div>
          </div>

          {/* Bad Output */}
          <div className="bg-white border-2 border-red-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wide">Output</div>
            <div 
              className="bg-gray-50 rounded p-4 text-gray-700 prose prose-sm max-w-none max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: lesson.badOutput }}
            />
          </div>
        </div>

        {/* AFTER Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="font-bold text-green-900 text-lg">AFTER (Better way)</h3>
          </div>

          {/* Good Prompt */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Prompt</div>
            <div className="bg-white rounded p-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
              {lesson.goodPrompt}
            </div>
          </div>

          {/* Good Output */}
          <div className="bg-white border-2 border-green-300 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Output</div>
            <div 
              className="bg-gray-50 rounded p-4 text-gray-700 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: lesson.goodOutput }}
            />
          </div>
        </div>
      </div>

      {/* Lesson Callout */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5 mb-8">
        <div className="flex items-start gap-3">
          <Lightbulb className="text-blue-600 flex-shrink-0 mt-0.5" size={22} />
          <div>
            <div className="font-bold text-blue-900 mb-1">What changed?</div>
            <p className="text-blue-800 text-sm leading-relaxed">{lesson.lesson}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pb-6">
        <button
          onClick={() => {
            if (currentLesson > 0) {
              setCurrentLesson(currentLesson - 1);
            }
          }}
          disabled={currentLesson === 0}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            currentLesson === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ArrowLeft size={18} />
          Previous
        </button>

        {currentLesson < lessons.length - 1 ? (
          <button
            onClick={() => {
              setCurrentLesson(currentLesson + 1);
            }}
            className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={() => setStage('complete')}
            className="px-8 py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Continue <ArrowRight size={18} />
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
