import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ArrowRight, ArrowLeft, Clock, CheckCircle, X, Lightbulb, ArrowDown } from 'lucide-react';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [currentLesson, setCurrentLesson] = useState(0);
  const contentRef = useRef(null);

  const scenario = {
    title: "Emergency: Data Breach Hits Customer Portal",
    urgency: "Press briefing in 45 minutes",
    situation: "A fintech startup detects a breach on its customer portal affecting 128k users. API keys were exposed, payments paused, and customers are posting screenshots on social. The COO needs to brief the CEO and prep holding statements now.",
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Context beats vagueness",
      lesson: "Generic questions → generic answers. Add facts, numbers, and current constraints.",

      badPrompt: "Write a brief about a data breach and what to do next.",
      badSnippet: {
        label: "What Joe Got",
        text: `A data breach occurs when unauthorized individuals gain access to sensitive information. Companies should quickly assess what was accessed, notify impacted users, and work with cybersecurity experts to close vulnerabilities.

Key steps include:
• Containing the breach
• Notifying stakeholders
• Reviewing legal obligations
• Implementing stronger security measures

Organizations should also consider offering credit monitoring to affected users...`,
        problem: "Reads like a blog post. No facts about the incident, no urgency, no decisions."
      },

      goodPrompt: `You're advising the COO of BrightWallet, a fintech startup.

Current facts:
• Incident: Customer portal breach via exposed API keys
• Impact: 128,400 users; card payments paused for 6 hours; screenshots circulating on Twitter
• Risk: Possible PCI compliance violation; regulators notified but no media statement yet
• Time: CEO press briefing in 45 minutes

Write a 1-page executive brief that:
1) Explains what happened with specific impact numbers
2) Lists immediate containment actions taken (or not)
3) Outlines 3 options for public response (silence, holding statement, full disclosure) with pros/cons
4) Ends with your recommendation + why

Format: section headers, bullets, concise but concrete.`,
      goodSnippet: {
        label: "What You Get",
        text: `EXECUTIVE BRIEF: CUSTOMER PORTAL BREACH
For: CEO | Press Briefing: Today, 10:45 AM

WHAT HAPPENED
• 128,400 user records potentially accessed; API keys exposed for ~3 hours overnight
• Payments paused at 7:10 AM; restored at 1:05 PM after key rotation
• Screenshots of error pages on Twitter (≈400 shares); regulator notified 9:20 AM

OPTIONS (PUBLIC RESPONSE)
1) HOLDING STATEMENT — Acknowledge outage + investigation underway (✓ fast; ✗ invites speculation)
2) PARTIAL DISCLOSURE — Share scope + mitigation steps (✓ transparent; ✗ more media follow-ups)
3) FULL DETAIL — Publish timeline + customer actions (✓ trust-building; ✗ legal review needed)

RECOMMENDATION: Option 2 within 30 minutes; offer monitoring to affected users and schedule full update by EOD.`,
        benefit: "Incident-specific facts, urgency, clear choices the CEO can act on."
      }
    },
    {
      id: 'constraints',
      title: "Constraints drive strategy",
      lesson: "Without real-world limits, you get fantasy plans. Add what time, money, and tools are available.",

      badPrompt: "What are our options for responding to this breach?",
      badSnippet: {
        label: "What Joe Got",
        text: `There are several potential approaches to address the breach:

1. Investigate fully before saying anything.
2. Issue a public statement acknowledging the issue.
3. Offer credit monitoring to users.
4. Work with cybersecurity firms to improve defenses.

Each approach has benefits and tradeoffs that should be considered.`,
        problem: "Vague list with no cost, timing, or sequencing. Nothing to prioritize."
      },

      goodPrompt: `Map response options for the breach given these constraints:

What we know
• Engineering can ship a patch in ~24 hours; full forensic report in 5 days
• Legal clearance for public statements takes 30 minutes minimum
• Customer support can handle ~1,200 calls/hour; backlog already 600
• Budget set aside for incident response this month: $120k

Give 3-4 options beyond “wait and see.” For each:
• Name (2-3 words)
• Core approach + first 3 steps in next 2 hours
• Pros (✓) / Cons (✗) with specifics (costs, team load)
• Time + spend estimate
• Risk level (Low/Med/High)

End with your recommendation and 1-sentence rationale.`,
      goodSnippet: {
        label: "What You Get",
        text: `STRATEGIC OPTIONS ANALYSIS

Option 1: HOLD & PATCH
Freeze new logins; release patch within 24h; minimal public detail
✓ Low legal risk
✗ Trust hit grows hourly; support backlog balloons
Time: 24h | Spend: $40k (forensics) | Risk: MEDIUM

Option 2: TRANSPARENT PATCH
Issue holding statement now; outline scope + next update; ship patch in 24h
✓ Calms press/speculation; shows ownership
✗ Requires legal + PR + eng synced in 45 min
Time: 24h | Spend: $65k | Risk: LOW-MEDIUM

Option 3: FULL MAKE-GOOD
Transparent patch + free monitoring + account protection checklist
✓ Trust boost, reduces churn risk
✗ Higher cost; sets precedent for future incidents
Time: 24h | Spend: $120k | Risk: LOW

RECOMMENDATION: Option 2 to meet the 45-minute briefing, then reassess after forensics.`,
        benefit: "Concrete steps, costs, and staffing make the tradeoffs real. Leader can decide."
      }
    },
    {
      id: 'role',
      title: "Role shapes relevance",
      lesson: "Same facts land differently for each audience. Say who it's for and how they'll use it.",

      badPrompt: "Summarize the breach for the leadership team.",
      badSnippet: {
        label: "What Joe Got",
        text: `Security Incident Summary

A data breach has occurred impacting customer information. The scope of the incident is being assessed and teams are working to determine the root cause.

Next steps include notifying stakeholders, improving security protocols, and coordinating with legal and communications teams.`,
        problem: "Leadership, engineers, and support teams all need different specifics."
      },

      goodPrompt: `Create two versions of the breach update—same facts, different audiences:

VERSION 1 – CEO (press briefing in 45 minutes)
• Open with bottom-line impact (users, downtime, financial risk)
• 2-3 response options + your recommendation
• Max 1 page, bullet-heavy

VERSION 2 – Engineering Leads (stabilizing services today)
• Start with technical root cause and current telemetry
• Concrete asks for next 4 hours (patch, monitoring, rollback plan)
• What to document for forensics/PCI
• Max 2 pages, specific and actionable

Use the same breach facts but tailor for what each audience must do next.`,
      goodSnippet: {
        label: "What You Get",
        text: `VERSION 1: FOR CEO
Customer Portal Breach — Press Briefing 10:45 AM

BOTTOM LINE
• 128k users affected; payments paused 5h 55m; no evidence of transfers
• Options: Holding statement vs partial disclosure vs full detail
• Recommendation: Partial disclosure now; commit to full update by 6 PM

ASK
Approve credit monitoring budget ($60k) + greenlight holding statement in next 20 minutes.

---

VERSION 2: FOR ENGINEERING LEADS
Customer Portal Breach — Stabilize Today

ROOT CAUSE (CURRENT): API key leaked via misconfigured CI job; keys rotated 9:05 AM
CURRENT STATE: No active exfil detected post-rotation; payment queue draining slowly

NEXT 4 HOURS
• Patch CI job + add secrets scanning (owner: DevOps)
• Double rate-limit auth endpoints + add anomaly alerts (owner: Backend)
• Create rollback plan for payments service if error rate >3% (owner: Payments)

LOGGING/FOR FORENSICS
• Preserve gateway logs 48h
• Snapshot affected DB tables before patch deploy
• Tag incident in PagerDuty for postmortem

TEAM COMMS
Slack updates every 30 minutes; ship patch ETA 4 PM.`,
        benefit: "Two audiences, two uses: CEO gets the decision, engineers get the tasks. Same facts, tailored actions."
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
