// Vercel serverless function for generating scenarios
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { userTopic, difficulty = 'easy' } = req.body;
    const difficultyLevel = ['easy', 'medium', 'hard'].includes((difficulty || '').toLowerCase())
      ? difficulty.toLowerCase()
      : 'easy';

    // Add randomness seed to prompt to force variety
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = new Date().toISOString();

    const difficultyTemplates = {
      easy: `Create an EASY scenario that feels like a normal task someone might do this week. Keep it light and friendly.

Include:
- One audience
- One specific deliverable (email, short plan, checklist, FAQ, invite)
- 2-3 concrete facts (names, times, places, counts)
- Light urgency (today/tomorrow) but no stress or emergency

Return ONLY valid JSON with no markdown:
{
  "title": "[Friendly scenario title]",
  "urgency": "[Lightly time-bound, e.g., 'Post tonight' or 'Draft by lunch tomorrow']",
  "situation": "[2-3 sentences with concrete details: numbers, places, names]",
  "requirement": "[Specific deliverable to create]",
  "sector": "[domain like household, hobby, school, workplace, club, trip, etc.]",
  "focus": "[1-2 words summarizing what matters most]",
  "difficulty": "easy"
}`,
      medium: `Create a MEDIUM scenario that introduces a little complexity without becoming a crisis.

Include:
- Either two audiences OR two constraints to balance
- A deliverable with 2 parts (e.g., short note + bullet plan, summary + checklist)
- 3-4 concrete facts (numbers, roles, timing)
- A tradeoff to manage (e.g., speed vs detail, tone vs brevity)
- Light urgency (today/tomorrow) without drama

Return ONLY valid JSON with no markdown:
{
  "title": "[Scenario title with both needs visible]",
  "urgency": "[Lightly time-bound]",
  "situation": "[2-3 sentences with specifics and the balancing act]",
  "requirement": "[Deliverable that includes 2 parts or sections]",
  "sector": "[domain like education, workplace, travel, hobby, community]",
  "focus": "[What needs balancing]",
  "difficulty": "medium"
}`,
      hard: `Create a HARD scenario that is still approachable but requires a more advanced prompt.

Include:
- Multiple steps or sections in the final output
- Conflicting constraints (e.g., short length but must cite 2 sources; reassuring tone but firm action items)
- 4-5 concrete facts (stakeholders, numbers, timelines, channels)
- A small risk or sensitivity to address while avoiding crisis framing
- Clear success criteria

Return ONLY valid JSON with no markdown:
{
  "title": "[Scenario title showing stakes without drama]",
  "urgency": "[Time-bound but not dire]",
  "situation": "[2-3 sentences with concrete details and the tension to manage]",
  "requirement": "[Multi-step or multi-section deliverable]",
  "sector": "[domain like workplace, community, creative, family, hobby, travel, wellness]",
  "focus": "[What to optimize for and protect]",
  "difficulty": "hard"
}`
    };

    const basePrompt = `[Scenario ID: ${randomSeed} | Generated: ${timestamp}]

You are generating a ${difficultyLevel.toUpperCase()} practice scenario for an AI prompting game.

${userTopic && userTopic.trim() ? `Anchor it to what the user is working on: "${userTopic}".` : 'Pick a relatable topic someone might genuinely need help with this week.'}

Keep it practical, non-emergency, and useful for learning.`;

    const promptContent = `${basePrompt}\n\n${difficultyTemplates[difficultyLevel]}`;
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        temperature: 1.0,
        messages: [{
          role: "user",
          content: promptContent
        }]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }
    
    let scenarioText = data.content[0].text;
    
    // Strip markdown code blocks if present
    scenarioText = scenarioText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const scenario = JSON.parse(scenarioText);
    
    res.status(200).json({ scenario });
  } catch (error) {
    console.error('Error generating scenario:', error);
    console.error('API Key present:', !!process.env.ANTHROPIC_API_KEY);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate scenario',
      message: error.message,
      hasApiKey: !!process.env.ANTHROPIC_API_KEY
    });
  }
}
