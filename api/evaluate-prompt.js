// Vercel serverless function for evaluating user prompts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt, scenario } = req.body;

  if (!userPrompt || !scenario) {
    return res.status(400).json({ error: 'Missing required fields' });
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
        messages: [{
          role: "user",
          content: `You are evaluating a prompt written by a public affairs professional for this crisis scenario:

SCENARIO: ${scenario.situation}
REQUIREMENT: ${scenario.requirement}

USER'S PROMPT:
${userPrompt}

Evaluate this prompt on a 0-100 scale based on:
1. Context Specificity (0-25): Did they include relevant company details, numbers, operational constraints, or specific facts?
2. Format Clarity (0-20): Did they specify output structure, length, tone, sections?
3. Audience Targeting (0-20): Did they consider who reads this and what they need?
4. Strategic Framing (0-20): Does the prompt ask for actionable options vs just description?
5. Practical Constraints (0-15): Did they mention time limits, approval needs, use case clarity?

Be strict but fair. A prompt with "write a statement about X" should score around 30-40. A prompt with specific context, format, audience, and strategic goals should score 80-95.

Return ONLY valid JSON in this exact format with no markdown or code blocks:
{
  "score": [number 0-100],
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "verdict": "[one sentence assessment]"
}`
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'API request failed');
    }

    let evalText = data.content[0].text;
    
    // Strip markdown if present
    evalText = evalText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const evaluation = JSON.parse(evalText);
    
    res.status(200).json({ evaluation });
  } catch (error) {
    console.error('Error evaluating prompt:', error);
    res.status(500).json({ 
      error: 'Failed to evaluate prompt',
      message: error.message 
    });
  }
}
