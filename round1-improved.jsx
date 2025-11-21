import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ArrowRight, ArrowLeft, Clock, CheckCircle, X, Lightbulb, ArrowDown } from 'lucide-react';

const Round1GameV3 = ({ onComplete }) => {
  const [stage, setStage] = useState('scenario');
  const [currentLesson, setCurrentLesson] = useState(0);
  const contentRef = useRef(null);

  const scenario = {
    title: "Plan a Saturday Skillshare Day",
    urgency: "Draft the plan tonight",
    situation: "Your community center is hosting a relaxed weekend event with DIY classes (budgeting basics, meal prep, bike repair). Four volunteer instructors, 60 RSVPs so far, and you need to publish a plan with roles, timing, and what to bring before people head to bed.",
  };

  const lessons = [
    {
      id: 'specifics',
      title: "Context beats vagueness",
      lesson: "Generic asks lead to filler. Share the real details of your situation.",

      badPrompt: "Outline a community event with some activities.",
      badSnippet: {
        label: "What Joe Got",
        text: `Community events can include workshops, food, and time for people to connect. It's important to pick a venue, schedule activities, and let people know what to expect.

Key steps include:
• Choose activities
• Invite participants
• Provide supplies
• Share the schedule`,
        problem: "It could describe any event. Nothing about your people, space, or timing."
      },

      goodPrompt: `You're helping a community center publish Saturday's "Skillshare Day" plan.

Details:
• Classes: budgeting basics, beginner meal prep, bike repair (45 minutes each)
• People: 4 volunteer instructors; 60 RSVPs; expecting 20 drop-ins
• Space: 3 rooms + outdoor patio; coffee/tea available, no stove
• Timing: event runs 10 AM–1 PM; want a draft schedule before people go to bed tonight
• Needs: who greets folks, supply list, what attendees should bring or prep

Create a 1-page plan that:
1) Lists the schedule with room assignments and transitions
2) Names volunteers + what they'll handle (teaching, setup, check-in)
3) Provides a short “what to bring” note to include in the email/post
4) Flags anything to confirm Friday night

Format: headers + bullets; warm, practical tone.`,
      goodSnippet: {
        label: "What You Get",
        text: `SATURDAY SKILLSHARE — DRAFT SCHEDULE
Audience: RSVP list + community Slack | Send tonight

TIMING + ROOMS
10:00–10:15 — Welcome + coffee (Lobby)
10:15–11:00 — Budgeting Basics (Room A)
10:15–11:00 — Bike Repair 101 (Patio)
11:05–11:50 — Beginner Meal Prep (Room B)
11:55–12:30 — Ask-Me-Anything with all instructors (Room A)
12:30–1:00 — Clean-up + share resources

ROLES
• Check-in + name tags: Maya + Leo
• Room setup + timers: Priya
• Instructors: Ana (Budgeting), Devin (Bike), Chris (Meal prep)

WHAT TO BRING
Comfortable clothes; notebook; bike if you want practice; food storage container for sample meal prep.

FRIDAY NIGHT CHECKS
Confirm projector in Room A, set out coffee supplies, print 70 name tags.`,
        benefit: "Uses real details to produce a plan people can actually follow."
      }
    },
    {
      id: 'constraints',
      title: "Constraints drive strategy",
      lesson: "Real limits steer the plan. Spell out time, space, and budget.",

      badPrompt: "What are our options for making this event good?",
      badSnippet: {
        label: "What Joe Got",
        text: `There are several possible ways to make an event successful:

1. Promote it more.
2. Provide refreshments.
3. Have clear signage.
4. Ask for feedback afterward.

Each option could help people enjoy the event.`,
        problem: "True but unhelpful. No sense of what fits your evening or budget."
      },

      goodPrompt: `Plan the event with these constraints:

Facts
• Budget: $250 for snacks/printing
• Setup: doors open 9:30 AM; 3 rooms with chairs only; patio has 2 folding tables
• Volunteers: 4 instructors + 2 helpers; everyone leaves by 1:30 PM
• Supplies on hand: projector, extension cords, flip charts, markers; no stove/oven

Give 3 options for running the morning. For each, include:
• Name (2-3 words)
• First 3 steps tonight + first 3 steps Saturday morning
• Pros (✓) / Cons (✗) with costs/time
• Any supply gaps to solve

End with the option you recommend and why it fits the constraints.`,
      goodSnippet: {
        label: "What You Get",
        text: `OPTION SET

Option 1: SIMPLE TRACK
Tonight: confirm rooms; print 70 name tags; draft one email.
Saturday: set up chairs at 9:30; coffee at 9:45; 1 helper floats.
✓ Easiest to run; ✓ lowest cost ($90 coffee/snacks)
✗ Less hands-on help during classes

Option 2: GUIDED
Tonight: assign greeters; prep short handouts per class; label rooms.
Saturday: stagger start times by 5 minutes; helpers rotate between rooms.
✓ Feels organized; ✓ good for newcomers
✗ $140 printing/snacks; helpers stretched during transitions

Option 3: RESOURCE-RICH
Tonight: add QR codes to slides; pre-record quick tips; buy extra markers/tools.
Saturday: one helper per room + floating host.
✓ High-quality experience; ✓ reusable materials later
✗ Uses most of $250 budget; more prep tonight

Recommendation: Option 2 — fits budget/time while keeping things smooth for first-timers.`,
        benefit: "Shows tradeoffs using your actual limits so you can pick confidently."
      }
    },
    {
      id: 'role',
      title: "Role shapes relevance",
      lesson: "People need different cuts of the same info. Say who it's for and what they need to do.",

      badPrompt: "Summarize the event for everyone.",
      badSnippet: {
        label: "What Joe Got",
        text: `Event Overview

We are hosting a community event. People will attend workshops and enjoy refreshments.

Next steps include finalizing the schedule and making sure people know where to go.`,
        problem: "Helpers need instructions. Attendees need what to expect. Everybody gets the same vague note."
      },

      goodPrompt: `Create two versions of the plan — same event facts, different audiences:

VERSION 1 – Attendees (email + post)
• Friendly intro + what to expect Saturday
• Start time, room locations, what to bring, childcare/no childcare
• Note about snacks/coffee + parking/bike racks
• 150 words, warm tone

VERSION 2 – Volunteers (checklist)
• Room setup tasks + who is assigned where
• Timing for check-in table, coffee setup, and cleanup
• Reminders for safety/comfort (hydration, breaks, accessibility)
• Bullet-only, no fluff

Use the same details but tailor for what each group needs to do.`,
      goodSnippet: {
        label: "What You Get",
        text: `VERSION 1: ATTENDEE EMAIL (148 words)
Hi neighbors! Saturday's Skillshare Day is 10 AM–1 PM. Check in at the lobby for name tags. Budgeting Basics is in Room A, Bike Repair is on the patio (bring your bike if you want practice), and Meal Prep is in Room B. Coffee/tea + light snacks provided. Please bring a notebook and a food container if you'd like leftovers. Parking is free on 3rd St; bike racks by the patio. See you there!

VERSION 2: VOLUNTEER CHECKLIST
ARRIVE 9:30 — set up check-in table (Maya/Leo)
ROOMS — A: chairs + projector; Patio: 2 tables + bike stand; B: tables + flip charts
COFFEE — fill urn; set cups/napkins; start at 9:45
DURING — Priya floats with timer/cleanup; instructors keep sessions to 45 minutes
CLOSE — wipe tables; stack chairs; pack projector/extension cords; trash out by 1:20 PM`,
        benefit: "Same facts, two outputs. Each audience sees what they need to do next."
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
