// Vercel serverless function for generating scenarios
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
        messages: [{
          role: "user",
          content: `You are generating a crisis scenario for a public affairs/lobbying training game. 

Generate a realistic, high-pressure scenario that would require AI-assisted content creation. The scenario should be:
1. Time-sensitive (meeting in 1-2 hours)
2. Sector-specific (telecom, pharma, energy, fintech, tech, manufacturing)
3. Require either: press statement, Hill talking points, stakeholder brief, or investor messaging
4. Include specific stakes and context

Return ONLY valid JSON in this exact format with no markdown or code blocks:
{
  "title": "Breaking: [Crisis Type]",
  "urgency": "[Timeframe]",
  "situation": "[2-3 sentence scenario description with specific stakes]",
  "requirement": "[What they need to create]",
  "sector": "[industry]"
}

Make it feel real and urgent. Use concrete details.`
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
    res.status(500).json({ 
      error: 'Failed to generate scenario',
      message: error.message 
    });
  }
}
