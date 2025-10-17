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
          content: `You are simulating what would happen if this content were used in the real world for a lobbying/public affairs training game.

SCENARIO: ${scenario.situation}
REQUIREMENT: ${scenario.requirement}

GENERATED CONTENT:
${output}

Write a realistic 3-act narrative showing how this would play out:

ACT 1 - FIRST GATE: The immediate reception. Who sees it first? What's their first reaction? Do they approve it, or does it get kicked back? Be specific about who and what they say.

ACT 2 - THE REAL TEST: Where does it go next? Congressional staffers? Media? Coalition partners? How does it perform under scrutiny? What questions come up? What works, what doesn't?

ACT 3 - THE FALLOUT: What's the end result? Did it achieve the goal? What are the consequences - good or bad? What happens next?

Use realistic details. Include quoted reactions. Be honest about both successes and failures.

Return ONLY valid JSON with no markdown:
{
  "first_gate": "[2-3 sentences with specific details and quotes]",
  "where_it_goes": "[2-3 sentences about how it performs in the real test]",
  "consequences": "[2-3 sentences about the final outcome]"
}`
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
