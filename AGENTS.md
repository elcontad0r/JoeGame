# AGENTS

## Purpose & scope
This file applies to the entire repo. Prioritize keeping the "guided path → scored levels" user experience simple and low-friction.

## UX guardrails
- The landing screen should present one clear starting action and minimize parallel CTAs; optional skips/shortcuts must be secondary to the main guided flow.
- Navigation back to the menu should stay lightweight; avoid adding hard resets without clear user context or confirmation when state might be lost.
- Preserve the round order and onComplete transitions (Round 1 → Round 2 → easy/medium/hard) unless explicitly redesigning the curriculum.

## Styling
- Use Tailwind utility classes consistently; prefer existing color and spacing scales.
- New components should match the gradient backgrounds and card styles used on the menu cards.

## API & environment
- Serverless functions live under `/api`; keep prompts configurable in those files and respect the Anthropic API key env var documented in the README.
- Avoid exposing the presence or absence of environment variables in client responses or logs; sanitize outputs that mention configuration status.

## Testing/build
- Run `npm run build` before committing when possible. Keep changes small and isolate concerns per branch to avoid merge conflicts (especially in `App.jsx` and `round*-improved.jsx`).

## Copy & tone
- Keep user-facing copy friendly and beginner-oriented; prefer short sentences and clear time estimates ("5 min", "7–9 min").
- When renaming round files (e.g., round 3 variants), update README instructions and any in-app UX copy to match the new filenames.

## Files to avoid heavy churn
- `App.jsx` (routing/entry experience) and `/api/*` (live prompts) should see minimal unrelated refactors; propose structural changes in PR descriptions first.
