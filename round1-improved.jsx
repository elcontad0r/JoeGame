import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ArrowRight, ArrowLeft, Clock, CheckCircle, X, Lightbulb, ArrowDown } from 'lucide-react';

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
      badSnippet: {
        label: "What Joe Got",
        text: `The EPA has recently updated its air quality standards, introducing stricter limits on volatile organic compounds (VOCs) for manufacturing facilities. Companies will need to evaluate their current emissions levels and determine appropriate compliance pathways.

Key considerations include:
• Assessment of current emissions across all facilities
• Review of available control technologies  
• Timeline for implementation
• Cost-benefit analysis of various approaches

Manufacturers should consider engaging with environmental consultants to develop a comprehensive compliance strategy...`,
        problem: "Generic. Could apply to anyone. No urgency. No decisions."
      },
      
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
      goodSnippet: {
        label: "What You Get",
        text: `EXECUTIVE BRIEF: EPA VOC Standards
For: MidAtlantic Manufacturing CEO | Board Meeting: Today, 2pm

WHAT CHANGED
• EPA dropped VOC limits from 250 ppm to 35 ppm (86% reduction)
• Takes effect January 2027—only 26 months away
• 8 of our 12 facilities immediately affected

WHY THIS HURTS  
• Normal retrofit timeline: 24-30 months (we have 26)
• Our 8 facilities are big emitters (40-80 tons/year each)
• Cannot run coating during retrofit (3-4 weeks per facility)

RECOMMENDATION: Full Compliance (Option 1)
Board needs to approve $40M tonight. Penalties and supply chain disruption cost more than the capital hit.`,
        benefit: "Specific. Urgent. Actionable. Ready for the board meeting."
      }
    },
    {
      id: 'constraints',
      title: "Constraints drive strategy",
      lesson: "Generic options lists miss real tradeoffs. Add budget limits, operational constraints, and context.",
      
      badPrompt: "What options do we have for responding to this EPA rule?",
      badSnippet: {
        label: "What Joe Got",
        text: `There are several potential approaches to address the new EPA regulations:

1. Full Compliance
Install necessary equipment to meet the new standards across all affected facilities.

2. Legal Challenge
Work with industry groups to challenge the rule through administrative or judicial processes.

3. Partial Implementation
Prioritize compliance at the most critical facilities while exploring options for others.

4. Technology Solutions
Investigate emerging technologies that might offer more cost-effective compliance pathways.

Each approach has different costs, timelines, and risk profiles that should be carefully evaluated.`,
        problem: "Everything sounds equally reasonable. No real tradeoffs. Can't make a decision."
      },
      
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
      goodSnippet: {
        label: "What You Get",
        text: `STRATEGIC OPTIONS ANALYSIS

Option 1: PARALLEL TRACK
Start compliance prep while joining legal challenge
✓ Preserves legal rights without delaying engineering
✓ If challenge fails, we're ahead of competitors
✗ Spend $4-6M on engineering before knowing outcome
Cost: $42M total | Timeline: 26 months | Risk: MEDIUM

Option 2: CONSOLIDATION PLAY
Close 3 facilities, shift production to compliant sites
✓ Only retrofit 5 facilities instead of 8 (~$12M savings)
✗ 180 job cuts (political/community relations hit)
✗ Stranded real estate assets (~$15M)
Cost: $28M + $15M stranded | Timeline: 18 months | Risk: MEDIUM-HIGH

RECOMMENDATION: Geofence Strategy
Prioritizes highest enforcement risk while preserving optionality if legal challenge succeeds.`,
        benefit: "Real tradeoffs. Actual costs. Clear risks. Can defend a choice."
      }
    },
    {
      id: 'role',
      title: "Role shapes relevance",
      lesson: "Same info, different audiences. Define who needs this and how they'll use it.",
      
      badPrompt: "Summarize MidAtlantic's EPA situation for the leadership team.",
      badSnippet: {
        label: "What Joe Got",
        text: `EPA Air Quality Rule Impact Summary

The Environmental Protection Agency has introduced new regulations regarding volatile organic compound (VOC) emissions that will have significant implications for MidAtlantic Manufacturing's operations.

Affected Facilities:
Eight of our twelve coating facilities will need to implement compliance measures. These facilities currently emit VOCs at levels that, while legal under existing rules, will exceed the new standards.

Financial Impact:
Initial estimates suggest total compliance costs between $38-42 million across all affected facilities. This represents a significant capital expenditure that will need to be planned and budgeted appropriately.

Timeline:
The compliance deadline is January 2027, providing approximately 26 months for implementation...

Leadership should consider forming a cross-functional task force to develop a detailed compliance strategy.`,
        problem: "Same generic summary for everyone. CEO and Ops VP need totally different things."
      },
      
      goodPrompt: `Create two versions of the EPA situation update—same facts, different audiences:

VERSION 1 - For CEO (Board presentation tonight)
• Opens with bottom-line impact ($, timeline, risk)
• 3 options with clear recommendation
• Max 1 page, dense format

VERSION 2 - For Ops VP (Needs to brief facility managers tomorrow)
• Opens with what's actually changing technically
• Implementation logistics (downtime, staffing, sequencing)
• What managers need to prepare their teams for
• Max 2 pages, can be detailed

Use the same EPA facts but frame them for how each person needs to USE the info.`,
      goodSnippet: {
        label: "What You Get",
        text: `VERSION 1: FOR CEO
EPA VOC Rule — Board Decision Tonight

BOTTOM LINE
Need $40M board approval tonight. 8 facilities face Jan 2027 deadline. Delay = $37K/day penalties.

Board Ask: Approve $40M. Alternative is regulatory exposure + supply chain chaos worth more than the savings.

---

VERSION 2: FOR OPS VP  
EPA VOC Rule — Facility Manager Brief

WHAT'S CHANGING TECHNICALLY
• Current: 250 ppm VOC limit (we run 180-280 ppm)
• New: 35 ppm limit starting Jan 2027
• Likely solution: Thermal oxidizers at each site

IMPLEMENTATION REALITY
• Timeline: 26 months total. Install = 3-4 weeks downtime per facility
• Sequencing: Can only do 2 facilities at once (supply chain)
• Staffing: Need 2-3 additional operators per site (24/7 monitoring)
• Energy: +40% natural gas usage per facility

NEXT STEPS FOR YOUR TEAM
Facility managers meeting next week. Bring: site layouts, utility specs, production schedules.`,
        benefit: "CEO gets decision points. Ops gets implementation reality. Same facts, useful framing."
      }
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLesson, stage]);

  const renderScenario = () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">{scenario.title}</h2>
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-4">
              <Clock size={18} />
              <span>{scenario.urgency}</span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-3">You're About to See Joe Mess This Up</h3>
        <p className="text-base mb-5 text-blue-50">
          Joe's been "using AI" for months. Watch what he does with this situation, then see what actually works.
        </p>
        <button
          onClick={() => setStage('lessons')}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
        >
          Show Me <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderLessons = () => {
    const lesson = lessons[currentLesson];
    
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={contentRef}>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Example {currentLesson + 1} of {lessons.length}
            </span>
            <span className="text-sm text-gray-500">{lesson.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentLesson + 1) / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        {/* BEFORE Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <X className="text-red-600" size={20} />
            <h3 className="font-bold text-red-900 text-xl">BEFORE (What Joe did)</h3>
          </div>

          {/* Joe's Prompt */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-3">
            <div className="text-xs font-semibold text-red-700 mb-2 uppercase tracking-wide">Joe's Prompt</div>
            <div className="text-sm text-gray-800 leading-relaxed">
              "{lesson.badPrompt}"
            </div>
          </div>

          {/* Bad Output Snippet */}
          <div className="bg-white border-2 border-red-200 rounded-lg p-5 mb-3">
            <div className="text-xs font-semibold text-red-700 mb-3 uppercase tracking-wide">{lesson.badSnippet.label}</div>
            <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {lesson.badSnippet.text}
            </div>
          </div>

          {/* Problem callout */}
          <div className="bg-red-50 border-l-4 border-red-400 rounded-r p-3 text-sm text-red-800">
            <span className="font-semibold">Why this fails:</span> {lesson.badSnippet.problem}
          </div>
        </div>

        {/* Arrow + Lesson Callout */}
        <div className="flex justify-center my-6">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full p-3">
            <ArrowDown size={24} />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-5 mb-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-blue-600 flex-shrink-0 mt-0.5" size={22} />
            <div>
              <div className="font-bold text-blue-900 mb-1">The Fix</div>
              <p className="text-blue-800 text-sm leading-relaxed">{lesson.lesson}</p>
            </div>
          </div>
        </div>

        {/* AFTER Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="font-bold text-green-900 text-xl">AFTER (Better way)</h3>
          </div>

          {/* Better Prompt */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-3">
            <div className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Better Prompt</div>
            <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {lesson.goodPrompt}
            </div>
          </div>

          {/* Good Output Snippet */}
          <div className="bg-white border-2 border-green-300 rounded-lg p-5 mb-3">
            <div className="text-xs font-semibold text-green-700 mb-3 uppercase tracking-wide">{lesson.goodSnippet.label}</div>
            <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {lesson.goodSnippet.text}
            </div>
          </div>

          {/* Benefit callout */}
          <div className="bg-green-50 border-l-4 border-green-400 rounded-r p-3 text-sm text-green-800">
            <span className="font-semibold">Why this works:</span> {lesson.goodSnippet.benefit}
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
  };

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
