// Vercel serverless function for generating scenarios
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Add randomness seed to prompt to force variety
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = new Date().toISOString();
    
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
          content: `[Scenario ID: ${randomSeed} | Generated: ${timestamp}]

You are generating a UNIQUE crisis scenario for a public affairs/lobbying training game. Generate something DIFFERENT from typical FDA/pharma scenarios.

VARY THE SCENARIO TYPE - rotate between:
- Regulatory crisis (new rule, enforcement action, investigation)
- Legislative threat (bill introduced, amendment proposed, hearing announced)
- Media/PR crisis (report published, allegations made, viral social media)
- Market event (competitor action, tech disruption, M&A announcement)
- Stakeholder conflict (activist campaign, union action, community opposition)
- Legal development (lawsuit filed, court ruling, settlement pressure)

VARY THE SECTOR - pick from:
Telecom, Pharma, Energy (oil/gas/renewables), Fintech, Tech platforms, Manufacturing, Agriculture, Healthcare providers, Transportation, Real estate, Retail, Gaming/entertainment

VARY THE DELIVERABLE:
- Press statement for media
- Hill talking points for Congressional meeting
- Stakeholder brief for investors/board
- Employee communication for internal town hall
- Coalition letter to agency/legislators
- Op-ed draft for executive

Generate a realistic, high-pressure scenario with:
1. Time pressure (meeting/deadline in 60-120 minutes)
2. Specific numbers/facts (dollar amounts, employee counts, facility locations)
3. Named entities (cities, Congressional committees, agencies)
4. Clear stakes (jobs, revenue, market position)

Return ONLY valid JSON with no markdown:
{
  "title": "Breaking: [Specific Crisis]",
  "urgency": "[Exact timeframe - e.g. 'Meeting in 75 minutes' or 'Press call at 3pm']",
  "situation": "[2-3 sentences with CONCRETE details - numbers, locations, entities]",
  "requirement": "[Specific deliverable type]",
  "sector": "[specific industry]"
}

Make each scenario feel distinct and urgent. Vary crisis types.

EXAMPLE VARIETY (don't copy these, use as inspiration):
- "Breaking: House Committee Announces Surprise Hearing on AI Content Moderation" (Tech)
- "Emergency: Union Calls Strike at 3 East Coast Facilities" (Manufacturing)
- "Alert: State AG Opens Investigation into Data Broker Practices" (Fintech)
- "Urgent: Major Customer Announces Switch to Competitor" (Telecom)
- "Crisis: Environmental Group Launches Campaign Against Pipeline Project" (Energy)`
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
