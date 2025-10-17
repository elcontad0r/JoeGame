// Vercel serverless function for simulating real-world results
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { output, scenario } = req.body;

  if (!output || !scenario) {
    return res.status(400).json({ error: 'Missing output or scenario' });
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
        max_tokens: 800,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: `You are simulating how this content would perform in the real world for a lobbying/public affairs training game.

SCENARIO: ${scenario.situation}
REQUIREMENT: ${scenario.requirement}

GENERATED CONTENT:
${output}

Simulate what would realistically happen if this content were used. Be honest and specific about both successes and failures.

Consider:
- Would it achieve the intended goal?
- How would different stakeholders react?
- What would work well?
- What would fall short or backfire?
- Be realistic - most content has both strengths and weaknesses

Return ONLY valid JSON with no markdown:
{
  "outcome": "[2-3 sentences describing what happened when this was used]",
  "strengths": ["[specific thing that worked]", "[another strength]"],
  "issues": ["[specific problem or gap]", "[another issue]"]
}

Be constructive but honest. Include 2-4 strengths and 2-4 issues.`
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    let simulationText = data.content[0].text;
    
    // Strip markdown code blocks if present
    simulationText = simulationText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const simulation = JSON.parse(simulationText);
    
    res.status(200).json({ simulation });
  } catch (error) {
    console.error('Error simulating results:', error);
    res.status(500).json({ 
      error: 'Failed to simulate results',
      message: error.message 
    });
  }
}
