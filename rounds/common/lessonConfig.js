export const round1Config = {
  stageLabel: 'Round 1 of 3',
  headline: 'See the wrong prompt, then the fix',
  subheadline: 'Peek at each ingredient once. No guessing—just spot the miss and the better version.',
  hero: {
    actionTitle: 'Preview common misses',
    actionCopy: 'Open the prompt pieces, see how the bad version derails the output, and keep the better phrasing ready for your build.',
    actionLabel: 'Start the preview',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-600',
    accentColorClass: 'text-red-500'
  },
  scenario: {
    title: 'Plan a Saturday Skillshare Day',
    urgency: 'Draft the plan tonight',
    situation:
      'Weekend DIY classes with four volunteers and 60 RSVPs. Share a one-screen plan with rooms, timing, and supplies before everyone heads to bed.'
  },
  pillars: [
    {
      label: 'Name the job clearly',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-100',
      dot: 'bg-blue-500'
    },
    {
      label: 'Use only real context',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-100',
      dot: 'bg-indigo-500'
    },
    {
      label: 'Give limits to aim it',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-100',
      dot: 'bg-purple-500'
    }
  ],
  sections: [
    {
      id: 'task',
      title: 'Task',
      summary: 'Your ask decides whether it plans or rambles.',
      helper: 'Open once to compare a fuzzy ask with a clear one.',
      misstep: {
        prompt: '“Share some ideas for this event.”',
        effect: 'The reply fills space with vibes and optional extras instead of drafting a plan you can use tonight.',
        example:
          '“Maybe a craft corner, maybe a stage performance—any of that could be fun! Invite folks to bring snacks, see who wants to help, and it could run 5–8 p.m. or longer if you want.”'
      },
      fix: {
        prompt: '“Draft the full Skillshare Day plan with rooms, timing, and supplies.”',
        effect: 'The model jumps straight into a schedule with setup lists because you asked for a concrete deliverable.',
        example:
          '“6:00–6:20 check-in at Room A; 6:20–7:05 Screenprinting in Room B with volunteer Maya; 7:10–7:55 Laser Cutting in Room C with Owen; supplies: ink, squeegees, 40 tees, tape, signage at each door.”'
      },
      takeaway: 'Name the deliverable in the first sentence so the model lands on the right format.'
    },
    {
      id: 'context',
      title: 'Context',
      summary: 'Real details anchor the draft.',
      helper: 'Open to see how thin context keeps the response generic.',
      misstep: {
        prompt: '“It’s a community event for everyone.”',
        effect: 'The reply stays reusable for any event—no rooms, timing, or headcounts show up because none were shared.',
        example:
          '“Kick things off with a welcome circle, then offer a few craft stations. Encourage everyone to mingle, try something creative, maybe add music or snacks if you can.”'
      },
      fix: {
        prompt: '“Classes: Screenprinting, Laser Cutting, Woodshop. 60 RSVPs, four volunteers, rooms A/B/C, 6–10 p.m.”',
        effect: 'The plan automatically places people, rooms, and supplies because it has specifics to work with.',
        example:
          '“Room A (6–7): Screenprinting led by Maya with 20 RSVPs; Room B (7–8): Laser Cutting with Owen, cap 15, mention eye protection; Room C (8–9): Woodshop safety with Priya; staggered cleanup 9:30–9:50 with carts ready.”'
      },
      takeaway: 'Name real numbers, spaces, and people so the AI can place them without more prodding.'
    },
    {
      id: 'constraints',
      title: 'Constraints',
      summary: 'Limits prevent imaginary plans.',
      helper: 'Open to see how “no limits” invites make-believe.',
      misstep: {
        prompt: '“Be creative, no limits.”',
        effect: 'The response invents extra staff, gear, and time you do not have, making the plan unusable.',
        example:
          '“Have three instructors per room, rent laser cutters, add a catered dinner with live music, and extend the event to a full weekend—maybe even book a keynote speaker if budget allows.”'
      },
      fix: {
        prompt: '“Budget $350, 45-minute setup, supplies already listed. No new rentals.”',
        effect: 'The plan stays realistic, trims extras, and sequences prep to fit the window you gave.',
        example:
          '“Use donated brushes/filament; volunteers arrive 5:15 to set tables and label bins; skip new rentals; keep sessions 35 minutes with 10-minute resets so you finish breakdown by 10.”'
      },
      takeaway: 'Set money, time, and material guardrails so the model optimizes within them.'
    },
    {
      id: 'audience',
      title: 'Audience',
      summary: 'The reader changes the tone and steps.',
      helper: 'Open to see how “everyone” muddies the response.',
      misstep: {
        prompt: '“Write one message for everyone involved.”',
        effect: 'Tone blurs and action items get buried because the model tries to speak to guests and volunteers at once.',
        example:
          '“Hey all! Come have fun tonight, bring energy, and remember to help out if you can. Everyone should set up, enjoy, watch timing, and tidy together at the end!”'
      },
      fix: {
        prompt: '“Two notes: one warm welcome for guests, one checklist for volunteers.”',
        effect: 'The response splits into a welcoming note plus a clear checklist, so each group knows exactly what to do.',
        example:
          '“Guests: Doors open at 6, all supplies provided, pick any table and stay as long as you like. Volunteers: greet 5:45, assign to Rooms A/B/C, check supplies against list, post signage, then start cleanup 9:30 with trash + wipe-down teams.”'
      },
      takeaway: 'Name who is reading so instructions and tone land with the right people.'
    }
  ],
  completion: {
    title: 'You Spotted It',
    summary: 'Same AI. Better instructions. Actually useful output.',
    takeaways: [
      {
        title: 'Context beats vagueness',
        description: 'Specifics let AI analyze instead of summarize'
      },
      {
        title: 'Constraints drive strategy',
        description: 'AI navigates tradeoffs when you tell it what matters'
      },
      {
        title: 'Role shapes relevance',
        description: "Define who needs this and how they'll use it"
      }
    ]
  }
};

export const round2Config = {
  stageLabel: 'Round 2 of 3',
  headline: 'Build by mixing and seeing',
  subheadline: 'Combine ingredients, regenerate, and spot how the tone shifts.',
  hero: {
    actionTitle: 'Mix a prompt in real time',
    actionCopy: 'Blend six ingredients, hit generate, and notice how each mix nudges the draft. Swap pieces to compare.',
    actionLabel: 'Try the builder',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-blue-600',
    accentColorClass: 'text-purple-500'
  },
  scenario: {
    title: 'Create a Friendly Welcome Pack',
    urgency: 'Share with members tonight',
    situation:
      'Your neighborhood maker club is kicking off monthly meetups. 120 people expressed interest, 45 have RSVPed for the first evening, and two local shops donated supplies. You want a clear, welcoming note that sets expectations and helps volunteers prep.'
  },
  ingredients: {
    task: {
      title: 'Task',
      options: [
        {
          id: 'welcome-pack',
          label: 'Draft the welcome pack',
          promptText: 'Create the full welcome packet for this specific kickoff night—clear schedule, roles, and FAQs.',
          description: 'Structured ask; see if it produces a ready-to-send packet.',
          learning: 'Watch whether a concrete deliverable triggers headings and schedules.'
        },
        {
          id: 'list-ideas',
          label: 'Brainstorm ideas',
          promptText: 'Share a few high-level ideas for future maker nights.',
          description: 'Looser ask that will surface themes more than specifics.',
          learning: 'Notice how broad wording stays high-level and skips logistics.'
        },
        {
          id: 'promo',
          label: 'Promo post',
          promptText: 'Write upbeat marketing copy introducing the maker club to new people.',
          description: 'Hype-first angle; check how it trades logistics for excitement.',
          learning: 'Compare how a promo ask swaps practical details for excitement.'
        }
      ]
    },
    context: {
      title: 'Context',
      options: [
        {
          id: 'club-basics',
          label: 'Club Snapshot',
          promptText:
            'Monthly maker nights at the community center; 120 interested, 45 RSVPs for kickoff; mix of teens and adults; beginner-friendly.',
          description: 'Baseline facts to anchor the plan.',
          learning: 'Notice if solid numbers lead to more realistic timing and space calls.'
        },
        {
          id: 'buzz',
          label: 'Feel-Good Backstory',
          promptText: 'Emphasize the club’s excitement about creativity and community.',
          description: 'Warm framing that might skip gritty details.',
          learning: 'Notice whether the AI mirrors the vibe and forgets setup needs.'
        },
        {
          id: 'support',
          label: 'Volunteer Details',
          promptText:
            '6 volunteers: 2 greeters, 3 project leads (painting, 3D pens, soldering), 1 cleanup lead; each can prep for 90 minutes Friday night.',
          description: 'Exact roles and prep time to fuel a concrete schedule.',
          learning: 'Watch how volunteer info turns into checklists and assignments.'
        },
        {
          id: 'space-supplies',
          label: 'Space + Supplies',
          promptText:
            '3 rooms + hallway tables; outlets available; donated supplies include paints, brushes, filament, safety glasses; snacks budget $150.',
          description: 'Space and supplies that should shape layouts and shopping lists.',
          learning: 'Compare how room and supply details change the plan versus no constraints.'
        }
      ]
    },
    format: {
      title: 'Format',
      options: [
        {
          id: 'welcome-email',
          label: 'Welcome Email + FAQ',
          promptText: 'Friendly email with 4-5 FAQ bullets: where to park, what to bring, skill level, timing. Max 220 words.',
          description: 'Concise message built for phones.',
          learning: 'See how the AI trims detail to fit a short, helpful email.'
        },
        {
          id: 'one-pager',
          label: 'One-Page Plan',
          promptText: 'Single page: schedule, room assignments, supplies list, who is hosting each table.',
          description: 'More structured brief for volunteers and hosts.',
          learning: 'Notice how the one-pager format invites clearer headings and lists.'
        },
        {
          id: 'social-thread',
          label: 'Social Thread',
          promptText: 'Series of 3-4 short posts inviting folks to drop by, with emojis and a link to RSVP.',
          description: 'Conversational thread that favors excitement over details.',
          learning: 'Compare how social tone trims logistics while boosting energy.'
        },
        {
          id: 'open-ended',
          label: 'Loose brain-dump',
          promptText: 'Capture a free-form brainstorm with ideas, notes, and possibilities.',
          description: 'Catch-all option that leaves structure entirely to the AI.',
          learning: 'See whether unstructured asks wander or surface useful nuggets.'
        }
      ]
    },
    audience: {
      title: 'Audience',
      options: [
        {
          id: 'attendees',
          label: 'First-Time Attendees',
          promptText:
            "People curious about making something simple after work; want to know if it's beginner-friendly and what it costs (it's free).",
          description: 'People deciding whether to show up and what to bring.',
          learning: 'Watch how attendee focus surfaces FAQs and tone-setting.'
        },
        {
          id: 'volunteers',
          label: 'Volunteer Crew',
          promptText: 'Greeters + project leads who need clear tasks, timing, and a heads-up on supplies to bring from home.',
          description: 'Helpers who need concise direction.',
          learning: 'See how volunteer-first framing yields checklists over hype.'
        },
        {
          id: 'donors',
          label: 'Local Donors',
          promptText: 'Two nearby shops offering supplies; they want to see their support acknowledged and know when to drop off materials.',
          description: 'Supporters who care about appreciation and timing.',
          learning: 'Notice how donor focus shifts tone to gratitude and logistics for drop-offs.'
        },
        {
          id: 'everyone-online',
          label: 'Everyone online',
          promptText: 'Write for a broad online audience, not just the people attending.',
          description: 'Broad audience that may not attend in person.',
          learning: 'Compare how open audiences dilute instructions meant for Saturday night.'
        }
      ]
    },
    constraints: {
      title: 'Constraints',
      options: [
        {
          id: 'word-cap',
          label: '200-Word Cap',
          promptText: 'Keep attendee-facing copy under 200 words so people will read it on their phone.',
          description: 'Forces brevity and prioritization.',
          learning: 'See what detail survives when you cap the length.'
        },
        {
          id: 'warm-tone',
          label: 'Warm + Plain Language',
          promptText: 'Avoid jargon; write like a friendly neighbor inviting people over; short sentences welcome.',
          description: 'Sets expectation for tone without forcing format.',
          learning: 'Notice how tone guidance shapes word choice and pacing.'
        },
        {
          id: 'printable',
          label: 'Printable Tonight',
          promptText: 'Needs to print cleanly in black-and-white; no links required; simple headers and bullets.',
          description: 'Constraints for a physical handout.',
          learning: 'Compare how print constraints simplify layout versus other options.'
        },
        {
          id: 'no-constraints',
          label: 'No limits, impress me',
          promptText: 'Leave constraints open and let the model decide timing, budget, and audience.',
          description: 'Opens the door for the AI to invent its own boundaries.',
          learning: 'See whether invented constraints match what you actually need.'
        }
      ]
    },
    goal: {
      title: 'Goal',
      options: [
        {
          id: 'show-up',
          label: 'Boost Show-Ups',
          promptText: 'Primary goal: make people excited to attend and know exactly where/when to arrive.',
          description: 'Focus on clarity and motivation for guests.',
          learning: 'Notice how this goal prioritizes directions and reassurance.'
        },
        {
          id: 'prep-volunteers',
          label: 'Prep Volunteers',
          promptText: 'Primary goal: give volunteers a simple checklist so setup feels calm, not rushed.',
          description: 'Aims content at the team running the night.',
          learning: 'See how the draft leans into tasks and timing for helpers.'
        },
        {
          id: 'thank-donors',
          label: 'Thank Donors',
          promptText: 'Primary goal: highlight donor support and invite them to stop by for a quick shout-out.',
          description: 'Spotlights appreciation and updates for supporters.',
          learning: 'Compare how donor-first goals shift tone and add acknowledgements.'
        },
        {
          id: 'go-viral',
          label: 'Go viral',
          promptText: 'Primary goal: make the content catchy for social media.',
          description: 'Optimizes for shareability over operations.',
          learning: 'Notice how viral goals trade clarity for punchy lines.'
        }
      ]
    }
  }
};
