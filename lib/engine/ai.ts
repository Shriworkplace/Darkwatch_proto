import { Threat, Organization, AIAnalysis } from '../types'
import { GoogleGenerativeAI } from '@google/genai'

// Initialize only if key exists to prevent crashing during build or missing env vars
const ai = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

/**
 * Uses Gemini API to analyze a threat and return structured recommendations.
 * Falls back to a deterministic string if no API key is provided.
 */
export async function analyzeIncident(threat: Threat, org: Organization): Promise<AIAnalysis> {
  if (!ai) {
    // Fallback deterministic engine
    return {
      executiveSummary: `A simulated credentials leak was detected for ${threat.email} belonging to ${org.name}.`,
      businessImpact: `Exposed credentials could lead to unauthorized access to internal systems, potentially compromising sensitive corporate data.`,
      recommendedActions: [
        `Force a password reset for ${threat.email}.`,
        `Enable Multi-Factor Authentication (MFA) for the affected account.`,
        `Review access logs for ${threat.email} over the past 48 hours for anomalous activity.`
      ]
    }
  }

  try {
    const prompt = `
      You are an expert SOC Analyst AI.
      A new threat was detected for the organization "${org.name}".
      Threat Details:
      - Source: ${threat.source}
      - Affected Email: ${threat.email}
      - Username: ${threat.username || 'N/A'}
      - Password Exposed: ${threat.password ? 'YES' : 'NO'}
      
      Generate a JSON response exactly matching this structure (do not use markdown formatting like \`\`\`json):
      {
        "executiveSummary": "1-2 sentences summarizing the incident.",
        "businessImpact": "Potential consequences for the organization.",
        "recommendedActions": ["action 1", "action 2", "action 3"]
      }
    `
    // using the gemini-pro model
    const model = ai.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    
    // Clean up potential markdown from the response
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanedText) as AIAnalysis
    
    return parsed
  } catch (error) {
    console.error("Failed to generate AI analysis, using fallback:", error)
    return {
      executiveSummary: `A credentials leak was detected for ${threat.email}. AI Analysis failed to generate.`,
      businessImpact: `Unknown business impact due to API failure. Treat as HIGH risk if password is exposed.`,
      recommendedActions: [
        `Investigate account ${threat.email} manually.`
      ]
    }
  }
}
