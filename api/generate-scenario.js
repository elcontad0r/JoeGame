// Vercel serverless function for generating scenarios
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { userTopic } = req.body;
    
    // Add randomness seed to prompt to force variety
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = new Date().toISOString();
    
    // Build the prompt based on whether user provided a topic
    const promptContent = userTopic && userTopic.trim()
      ? `[Scenario ID: ${randomSeed} | Generated: ${timestamp}]

You are generating an everyday scenario for a cross-domain AI prompting practice game.

THE USER IS CURRENTLY WORKING ON: "${userTopic}"

Create a realistic, low-drama scenario that would help them practice writing clear prompts. Make it feel like a task someone might actually do this week.

Include:
1. A near-term moment (today/tomorrow) but not an emergency
2. Concrete facts (numbers, locations, people involved)
3. A specific deliverable to create (guide, message, plan, list, outline)
4. The domain or setting (e.g., school, workplace, club, household, side project)

Return ONLY valid JSON with no markdown:
{
  "title": "[Friendly scenario title]",
  "urgency": "[Lightly time-bound, e.g., 'Share tonight' or 'Draft by lunch tomorrow']",
  "situation": "[2-3 sentences with concrete details: numbers, places, names]",
  "requirement": "[Specific deliverable type to create]",
  "sector": "[domain like education, hobby, household, work team, wellness, travel, etc.]"
}

Keep it practical and approachable.`
      : `[Scenario ID: ${randomSeed} | Generated: ${timestamp}]

You are generating a UNIQUE, everyday scenario for an AI prompting practice game.

VARY THE SCENARIO TYPE - rotate between:
- Planning something (trip, meetup, meal prep, study plan)
- Writing a message (invite, update, thank-you, reminder)
- Teaching/explaining (how-to guide, starter checklist)
- Organizing people (simple schedule, roles, packing list)

VARY THE DOMAIN - pick from:
Education, Household/Family, Travel, Workplace projects, Hobby or clubs, Wellness, Personal finance, Creative side projects, Events/celebrations, Volunteering

VARY THE DELIVERABLE:
- Short email/text/post with a friendly tone
- One-page plan or checklist
- Step-by-step instructions or quickstart guide
- FAQ or tips list
- Agenda or schedule

Generate a realistic, low-stress scenario with:
1. Near-term timing (later today or tomorrow) but not a crisis
2. Specific facts (counts, times, locations, names)
3. A clear ask for the AI (what to write/make)

Return ONLY valid JSON with no markdown:
{
  "title": "[Friendly scenario title]",
  "urgency": "[Lightly time-bound, e.g., 'Post tonight' or 'Draft by 9am tomorrow']",
  "situation": "[2-3 sentences with concrete details: numbers, places, names]",
  "requirement": "[Specific deliverable type to create]",
  "sector": "[domain like education, household, travel, hobby, work, etc.]"
}

Make each scenario distinct, approachable, and useful for practice. Avoid emergencies or crisis framing.`;
    
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
