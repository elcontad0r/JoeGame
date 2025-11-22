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
      helper: 'Leads the AI to deliver the right shape of work.',
      options: [
        {
          id: 'task-clear',
          label: 'Draft the full Skillshare Day plan',
          description: 'Ask for the plan you actually need, not a loose brainstorm.',
          stance: 'best'
        },
        {
          id: 'task-vague',
          label: 'Share some ideas for this event',
          description: 'Sounds fine, but you’ll just get a generic list of tips.',
          stance: 'avoid'
        },
        {
          id: 'task-hype',
          label: 'Write marketing copy to hype the club',
          description: 'Fun, but it ignores the Saturday logistics you actually need.',
          stance: 'avoid'
        }
      ]
    },
    {
      id: 'context',
      title: 'Context beats vagueness',
      summary: 'Share the real details of your situation.',
      helper: 'Specifics let the AI analyze instead of summarize.',
      options: [
        {
          id: 'context-specific',
          label: 'Name the classes, rooms, RSVPs, and timing',
          description: 'The output will match your headcount and spaces.',
          stance: 'best'
        },
        {
          id: 'context-late',
          label: 'Just say it is a “community event”',
          description: 'Not obviously wrong, but it hides the facts that change the plan.',
          stance: 'avoid'
        },
        {
          id: 'context-random',
          label: 'Talk about club values and mission',
          description: 'Nice background, yet it won’t help assign rooms or timing.',
          stance: 'avoid'
        }
      ]
    },
    {
      id: 'constraints',
      title: 'Constraints drive strategy',
      summary: 'Time, space, and budget steer the plan.',
      helper: 'Real limits focus the AI on workable options.',
      options: [
        {
          id: 'constraints-clear',
          label: 'Share budget, setup time, supplies on hand',
          description: 'The plan will fit how much money and time you actually have.',
          stance: 'best'
        },
        {
          id: 'constraints-none',
          label: 'Tell it “be creative, no limits”',
          description: 'Feels empowering, but invites ideas you can’t execute tomorrow.',
          stance: 'avoid'
        },
        {
          id: 'constraints-soft',
          label: 'Only mention it’s happening “soon”',
          description: 'Too fuzzy to inform the schedule or shopping list.',
          stance: 'avoid'
        }
      ]
    },
    {
      id: 'audience',
      title: 'Role shapes relevance',
      summary: 'Tell the AI who will use the output and how.',
      helper: 'Different audiences need different cuts of the same info.',
      options: [
        {
          id: 'audience-split',
          label: 'Separate notes for attendees and volunteers',
          description: 'Keeps instructions clear for each group.',
          stance: 'best'
        },
        {
          id: 'audience-everyone',
          label: 'One message for “everyone involved”',
          description: 'Looks efficient, but it blurs what helpers must do.',
          stance: 'avoid'
        },
        {
          id: 'audience-lead',
          label: 'Write only for leadership',
          description: 'Useful later, but skips the people running Saturday.',
          stance: 'avoid'
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
    actionCopy: 'Pick 6 ingredients and watch how your choices shape the output. No right answer—just see what happens.',
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
          promptText: 'Create the full welcome packet for this specific kickoff night—clear schedule, roles, and FAQs.'
        },
        {
          id: 'list-ideas',
          label: 'Brainstorm ideas',
          promptText: 'Just share high-level ideas for running events like this in the future.'
        },
        {
          id: 'promo',
          label: 'Promo post',
          promptText: 'Write marketing copy to hype the maker club broadly, not the Saturday plan.'
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
            'Monthly maker nights at the community center; 120 interested, 45 RSVPs for kickoff; mix of teens and adults; beginner-friendly.'
        },
        {
          id: 'buzz',
          label: 'Feel-Good Backstory',
          promptText: 'Emphasize how excited the club is about creativity and community without logistics.'
        },
        {
          id: 'support',
          label: 'Volunteer Details',
          promptText:
            '6 volunteers: 2 greeters, 3 project leads (painting, 3D pens, soldering), 1 cleanup lead; each can prep for 90 minutes Friday night.'
        },
        {
          id: 'space-supplies',
          label: 'Space + Supplies',
          promptText:
            '3 rooms + hallway tables; outlets available; donated supplies include paints, brushes, filament, safety glasses; snacks budget $150.'
        }
      ]
    },
    format: {
      title: 'Format',
      options: [
        {
          id: 'welcome-email',
          label: 'Welcome Email + FAQ',
          promptText: 'Friendly email with 4-5 FAQ bullets: where to park, what to bring, skill level, timing. Max 220 words.'
        },
        {
          id: 'one-pager',
          label: 'One-Page Plan',
          promptText: 'Single page: schedule, room assignments, supplies list, who is hosting each table.'
        },
        {
          id: 'social-thread',
          label: 'Social Thread',
          promptText: 'Series of 3-4 short posts inviting folks to drop by, with emojis and a link to RSVP.'
        },
        {
          id: 'open-ended',
          label: 'Loose brain-dump',
          promptText: 'Unstructured brainstorming doc—no clear headers or deliverable.'
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
            "People curious about making something simple after work; want to know if it's beginner-friendly and what it costs (it's free)."
        },
        {
          id: 'volunteers',
          label: 'Volunteer Crew',
          promptText: 'Greeters + project leads who need clear tasks, timing, and a heads-up on supplies to bring from home.'
        },
        {
          id: 'donors',
          label: 'Local Donors',
          promptText: 'Two nearby shops offering supplies; they want to see their support acknowledged and know when to drop off materials.'
        },
        {
          id: 'everyone-online',
          label: 'Everyone online',
          promptText: 'Assume the output is for a broad internet audience instead of the people attending.'
        }
      ]
    },
    constraints: {
      title: 'Constraints',
      options: [
        {
          id: 'word-cap',
          label: '200-Word Cap',
          promptText: 'Keep attendee-facing copy under 200 words so people will read it on their phone.'
        },
        {
          id: 'warm-tone',
          label: 'Warm + Plain Language',
          promptText: 'Avoid jargon; write like a friendly neighbor inviting people over; short sentences welcome.'
        },
        {
          id: 'printable',
          label: 'Printable Tonight',
          promptText: 'Needs to print cleanly in black-and-white; no links required; simple headers and bullets.'
        },
        {
          id: 'no-constraints',
          label: 'No limits, impress me',
          promptText: 'Say there are no constraints—let the AI make assumptions about timing, budget, and audience.'
        }
      ]
    },
    goal: {
      title: 'Goal',
      options: [
        {
          id: 'show-up',
          label: 'Boost Show-Ups',
          promptText: 'Primary goal: make people excited to attend and know exactly where/when to arrive.'
        },
        {
          id: 'prep-volunteers',
          label: 'Prep Volunteers',
          promptText: 'Primary goal: give volunteers a simple checklist so setup feels calm, not rushed.'
        },
        {
          id: 'thank-donors',
          label: 'Thank Donors',
          promptText: 'Primary goal: highlight donor support and invite them to stop by for a quick shout-out.'
        },
        {
          id: 'go-viral',
          label: 'Go viral',
          promptText: 'Primary goal: make the content catchy for social media, even if it ignores logistics.'
        }
      ]
    }
  }
};
