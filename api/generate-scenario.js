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

You are generating a crisis scenario for a cross-industry AI prompting training game.

THE USER IS CURRENTLY WORKING ON: "${userTopic}"

Generate a realistic, high-pressure scenario that is DIRECTLY RELEVANT to their current work. Make it feel like something they might actually face this week.

Include:
1. Time pressure (meeting/deadline in 60-120 minutes)
2. Concrete facts (numbers, locations, stakeholders)
3. Named entities (companies, cities, regulators, partners)
4. Clear stakes (safety, trust, revenue, operations)

VARY THE CRISIS TYPE:
- Product or safety issue (recall, outage, defect)
- Media/PR flare-up (viral posts, investigative report, influencer callout)
- Customer or stakeholder escalation (enterprise client, parents, patients, investors)
- Compliance or regulatory pressure (new rule, audit notice, investigation)
- Market shock (competitor move, data leak, pricing backlash)

VARY THE DELIVERABLE:
- Customer email/FAQ or holding statement
- Executive brief with options
- Stakeholder or investor update
- Internal ops/support playbook
- Social thread or press note

Return ONLY valid JSON with no markdown:
{
  "title": "Breaking: [Specific Crisis]",
  "urgency": "[Exact timeframe - e.g. 'Meeting in 75 minutes' or 'Press call at 3pm']",
  "situation": "[2-3 sentences with CONCRETE details - numbers, locations, entities]",
  "requirement": "[Specific deliverable type]",
  "sector": "[specific industry]"
}

Make it urgent and obviously tied to their domain.`
      : `[Scenario ID: ${randomSeed} | Generated: ${timestamp}]

You are generating a UNIQUE crisis scenario for a cross-industry AI prompting training game.

VARY THE SCENARIO TYPE - rotate between:
- Product or safety issue (recall, outage, defect)
- Media/PR flare-up (viral posts, investigative report, influencer callout)
- Customer or stakeholder escalation (enterprise client, parents, patients, investors)
- Compliance or regulatory pressure (new rule, audit notice, investigation)
- Market shock (competitor move, data leak, pricing backlash)

VARY THE SECTOR - pick from:
Fintech, Education, Consumer electronics, Healthcare providers, Retail/eCommerce, Transportation, Energy, Entertainment/Gaming, Real estate, Telecom, Manufacturing, Food/CPG

VARY THE DELIVERABLE:
- Customer email/FAQ or holding statement
- Executive brief with options
- Stakeholder or investor update
- Internal ops/support playbook
- Social thread or press note

Generate a realistic, high-pressure scenario with:
1. Time pressure (meeting/deadline in 60-120 minutes)
2. Specific numbers/facts (dollar amounts, user counts, locations)
3. Named entities (cities, regulators, partners)
4. Clear stakes (safety, trust, revenue, operations)

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
- "Alert: Smart Thermostats Overheating After Firmware Push" (Consumer electronics)
- "Emergency: School District CMS Hacked; Parent Data Posted" (Education)
- "Breaking: Influencer Alleges Contamination in New Protein Drink" (Food/CPG)
- "Urgent: Enterprise Client Suspends Contract After Outage" (SaaS)
- "Crisis: Regulator Questions Patient Data Sharing Program" (Healthcare)`;
    
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
