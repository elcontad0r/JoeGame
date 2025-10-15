// Vercel serverless function for evaluating user prompts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt, scenario, promptComponents } = req.body;

  if (!userPrompt || !scenario || !promptComponents) {
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
        max_tokens: 1200,
        messages: [{
          role: "user",
          content: `You're evaluating how well this prompt gave Claude what it needed to handle the scenario.

SCENARIO: ${scenario.situation}
TASK: ${scenario.requirement}

THE PROMPT COMPONENTS:
Context: "${promptComponents.context}"
Format: "${promptComponents.format}"
Audience: "${promptComponents.audience}"
Constraints: "${promptComponents.constraints}"
Goal: "${promptComponents.goal}"

For each component, score 0-20 based on: Did this give Claude enough to work with?

CONTEXT (0-20):
- Can Claude write something specific, or only generic statements?
- Are there concrete details (numbers, names, deadlines, stakes)?
- Would someone unfamiliar with the situation understand what's going on?
Score + 1-2 sentence feedback on what was there or missing.

FORMAT (0-20):
- Is there clear direction on structure, length, style?
- Could Claude make decisions about organization?
- Would the output fit how it'll actually be used?
Score + 1-2 sentence feedback.

AUDIENCE (0-20):
- Is it clear who's reading this and what they care about?
- Can Claude choose appropriate tone and depth?
- Does it account for their existing knowledge/perspective?
Score + 1-2 sentence feedback.

CONSTRAINTS (0-20):
- Are there practical limits mentioned (time, length, process)?
- Can Claude make tradeoffs appropriately?
- Does it reflect real-world pressures?
Score + 1-2 sentence feedback.

GOAL (0-20):
- Is there a specific outcome defined?
- Can Claude structure content to achieve it?
- Is it clear what success looks like?
Score + 1-2 sentence feedback.

Return ONLY valid JSON in this exact format with no markdown or code blocks:
{
  "score": [total out of 100],
  "ingredients": {
    "context": {"score": [0-20], "feedback": "1-2 sentences"},
    "format": {"score": [0-20], "feedback": "1-2 sentences"},
    "audience": {"score": [0-20], "feedback": "1-2 sentences"},
    "constraints": {"score": [0-20], "feedback": "1-2 sentences"},
    "goal": {"score": [0-20], "feedback": "1-2 sentences"}
  }
}

Be honest but not punitive. Focus on utility: did this give Claude enough information to do the job well?`
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
