export const round1Config = {
  stageLabel: 'Round 1 of 3',
  headline: 'Learn the ropes fast',
  subheadline: 'Pick the moves that make AI replies clear and useful.',
  hero: {
    actionTitle: 'Start with the essentials',
    actionCopy: 'Grab the best ingredients in one screen. We’ll highlight what matters most so you can keep moving.',
    actionLabel: 'Begin the run',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-600',
    accentColorClass: 'text-red-500'
  },
  scenario: {
    title: 'Plan a Saturday Skillshare Day',
    urgency: 'Draft the plan tonight',
    situation:
      'Weekend DIY classes with four volunteers and 60 RSVPs. Publish a simple plan with rooms, timing, and supplies before everyone goes to bed.'
  },
  sections: [
    {
      id: 'task',
      title: 'Task first, then details',
      summary: 'State the exact job before adding color.',
      helper: 'Compare a precise ask vs. softer framings.',
      options: [
        {
          id: 'task-clear',
          label: 'Draft the full Skillshare Day plan',
          description: 'Ask for the plan you actually need, not a loose brainstorm.',
          stance: 'best',
          learning:
            'Notice how a direct task produces an outline and timings instead of generic advice.'
        },
        {
          id: 'task-vague',
          label: 'Share some ideas for this event',
          description: 'Sounds fine, but you’ll just get a generic list of tips.',
          stance: 'avoid',
          learning: 'See how broad wording keeps the AI at the 10,000-foot view.'
        },
        {
          id: 'task-hype',
          label: 'Write marketing copy to hype the club',
          description: 'Fun, but it ignores the Saturday logistics you actually need.',
          stance: 'avoid',
          learning: 'Check how hype-first framing shifts output away from logistics.'
        }
      ]
    },
    {
      id: 'context',
      title: 'Context beats vagueness',
      summary: 'Share the real details of your situation.',
      helper: 'Try rich details vs. softer blurbs.',
      options: [
        {
          id: 'context-specific',
          label: 'Name the classes, rooms, RSVPs, and timing',
          description: 'The output will match your headcount and spaces.',
          stance: 'best',
          learning: 'Watch how specific context pulls in realistic room and timing choices.'
        },
        {
          id: 'context-late',
          label: 'Just say it is a “community event”',
          description: 'Not obviously wrong, but it hides the facts that change the plan.',
          stance: 'avoid',
          learning: 'Notice how vague context keeps the AI guessing about size and space.'
        },
        {
          id: 'context-random',
          label: 'Talk about club values and mission',
          description: 'Nice background, yet it won’t help assign rooms or timing.',
          stance: 'avoid',
          learning: 'See how mission talk steers the reply toward inspiration instead of logistics.'
        }
      ]
    },
    {
      id: 'constraints',
      title: 'Constraints drive strategy',
      summary: 'Time, space, and budget steer the plan.',
      helper: 'Flip between limits and no limits to see what changes.',
      options: [
        {
          id: 'constraints-clear',
          label: 'Share budget, setup time, supplies on hand',
          description: 'The plan will fit how much money and time you actually have.',
          stance: 'best',
          learning: 'Check how real limits force tradeoffs in timing and supplies.'
        },
        {
          id: 'constraints-none',
          label: 'Tell it “be creative, no limits”',
          description: 'Feels empowering, but invites ideas you can’t execute tomorrow.',
          stance: 'avoid',
          learning: 'Notice how “no limits” invites ideas you may not execute overnight.'
        },
        {
          id: 'constraints-soft',
          label: 'Only mention it’s happening “soon”',
          description: 'Too fuzzy to inform the schedule or shopping list.',
          stance: 'avoid',
          learning: 'See how fuzzy timing leads to filler instead of schedules.'
        }
      ]
    },
    {
      id: 'audience',
      title: 'Role shapes relevance',
      summary: 'Tell the AI who will use the output and how.',
      helper: 'Try different audiences to see how tone shifts.',
      options: [
        {
          id: 'audience-split',
          label: 'Separate notes for attendees and volunteers',
          description: 'Keeps instructions clear for each group.',
          stance: 'best',
          learning: 'Notice how splitting audiences sharpens instructions for each group.'
        },
        {
          id: 'audience-everyone',
          label: 'One message for “everyone involved”',
          description: 'Looks efficient, but it blurs what helpers must do.',
          stance: 'avoid',
          learning: 'See how one-size-fits-all language gets fuzzy on who does what.'
        },
        {
          id: 'audience-lead',
          label: 'Write only for leadership',
          description: 'Useful later, but skips the people running Saturday.',
          stance: 'avoid',
          learning: 'Watch how leadership-only framing leaves helpers without steps.'
        }
      ]
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
  headline: 'Build Your Prompt',
  subheadline: 'See how strategic choices shape output',
  hero: {
    actionTitle: 'Now You Build One',
    actionCopy: 'Pick 6 ingredients and watch how your choices shape the output. No right answer—compare how each path feels.',
    actionLabel: 'Start Building',
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
          description: 'Structured ask that should yield a ready-to-send packet.',
          learning: 'See how a concrete deliverable triggers headings and schedules.'
        },
        {
          id: 'list-ideas',
          label: 'Brainstorm ideas',
          promptText: 'Just share high-level ideas for running events like this in the future.',
          description: 'Looser ask that will surface themes more than specifics.',
          learning: 'Notice how broad wording stays high-level and skips logistics.'
        },
        {
          id: 'promo',
          label: 'Promo post',
          promptText: 'Write marketing copy to hype the maker club broadly, not the Saturday plan.',
          description: 'Hype-first angle that de-emphasizes on-the-ground prep.',
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
          description: 'Baseline facts that should anchor the plan.',
          learning: 'See how solid numbers lead to more realistic timing and space calls.'
        },
        {
          id: 'buzz',
          label: 'Feel-Good Backstory',
          promptText: 'Emphasize how excited the club is about creativity and community without logistics.',
          description: 'Warm framing that might skip gritty details.',
          learning: 'Notice whether the AI mirrors the vibe and forgets setup needs.'
        },
        {
          id: 'support',
          label: 'Volunteer Details',
          promptText:
            '6 volunteers: 2 greeters, 3 project leads (painting, 3D pens, soldering), 1 cleanup lead; each can prep for 90 minutes Friday night.',
          description: 'Exact roles and prep time that enable a concrete schedule.',
          learning: 'Watch how volunteer info turns into checklists and assignments.'
        },
        {
          id: 'space-supplies',
          label: 'Space + Supplies',
          promptText:
            '3 rooms + hallway tables; outlets available; donated supplies include paints, brushes, filament, safety glasses; snacks budget $150.',
          description: 'Constraints that should shape layouts and shopping lists.',
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
          description: 'Concise message that should read well on phones.',
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
          promptText: 'Unstructured brainstorming doc—no clear headers or deliverable.',
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
          promptText: 'Assume the output is for a broad internet audience instead of the people attending.',
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
          promptText: 'Say there are no constraints—let the AI make assumptions about timing, budget, and audience.',
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
          promptText: 'Primary goal: make the content catchy for social media, even if it ignores logistics.',
          description: 'Optimizes for shareability over operations.',
          learning: 'Notice how viral goals trade clarity for punchy lines.'
        }
      ]
    }
  }
};
