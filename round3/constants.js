export const ingredientColors = {
  task: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-900', label: 'bg-amber-200 text-amber-900' },
  context: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', label: 'bg-orange-200 text-orange-900' },
  format: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900', label: 'bg-yellow-200 text-yellow-900' },
  audience: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', label: 'bg-green-200 text-green-900' },
  constraints: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', label: 'bg-blue-200 text-blue-900' },
  goal: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-900', label: 'bg-purple-200 text-purple-900' }
};

export const difficultyConfig = {
  easy: {
    label: 'Easy',
    ribbon: 'Level 1 • Guided remix',
    hero: 'Remix guided ingredients with a simple brief',
    gradient: 'from-green-50 to-blue-50',
    badgeColor: 'bg-green-100 text-green-800',
    leaderboardTag: 'Easy',
    instructions: 'Use the starter details and keep the prompt tight and skimmable.',
    playstyle: 'Pull the right ingredients, snap them together, and keep it short.',
    hintExtras: [
      'Pull 2-3 concrete facts from the scenario into your context.',
      'Say exactly what format you want back. Keep it short.'
    ]
  },
  medium: {
    label: 'Medium',
    ribbon: 'Level 2 • Guided + custom',
    hero: 'Blend options with your own spin',
    gradient: 'from-orange-50 to-amber-50',
    badgeColor: 'bg-orange-100 text-orange-800',
    leaderboardTag: 'Medium',
    instructions: 'Mix chips with your own edits. Add a guardrail or tone choice.',
    playstyle: 'Stack chips, then add the missing constraints and tradeoffs.',
    hintExtras: [
      'Name one thing you’re adding beyond the provided details.',
      'Point to what should be prioritized if tradeoffs appear.'
    ]
  },
  hard: {
    label: 'Hard',
    ribbon: 'Level 3 • Freeform flow',
    hero: 'You set the guardrails and the tone',
    gradient: 'from-purple-50 to-pink-50',
    badgeColor: 'bg-purple-100 text-purple-800',
    leaderboardTag: 'Hard',
    instructions: 'No scaffolding. You own the structure, tone, and constraints.',
    playstyle: 'Design the sections, define success, and call out one risk.',
    hintExtras: [
      'Lay out 2-3 sections in the order you want them.',
      'Call out one risk/sensitivity and how to handle it.'
    ]
  }
};

export const chipRules = {
  easy: {
    perFieldLimit: 2,
    minTotalSelections: 4,
    label: 'Play at least 4 chips (max 2 per category) before you write your goal.'
  },
  medium: {
    perFieldLimit: 3,
    minTotalSelections: 5,
    label: 'Draft with at least 5 chips (max 3 per category), then layer your own constraints.'
  },
  hard: {
    perFieldLimit: 0,
    minTotalSelections: 0,
    label: 'No chips here—everything is freeform.'
  }
};

export const difficultyFieldOrder = {
  easy: ['task', 'context', 'format', 'audience', 'constraints', 'goal'],
  medium: ['task', 'context', 'format', 'audience', 'constraints', 'goal'],
  hard: ['task', 'context', 'format', 'audience', 'constraints', 'goal']
};
