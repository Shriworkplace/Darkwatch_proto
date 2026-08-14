/**
 * Dispatch an alert payload to a Slack or Discord webhook.
 * 
 * @param webhookUrl The URL of the webhook
 * @param incident The incident data
 * @param orgName The name of the organization affected
 */
export async function dispatchWebhookAlert(webhookUrl: string | undefined, incident: any, orgName: string) {
  if (!webhookUrl) {
    console.log('[Webhook] No webhook URL configured. Skipping dispatch.')
    return { success: false, reason: 'No URL configured' }
  }

  // Format message for Slack/Discord
  const payload = {
    content: `🚨 **CRITICAL INCIDENT DETECTED** 🚨`,
    embeds: [
      {
        title: `Incident: ${incident.id}`,
        description: `A critical threat was matched to **${orgName}**.`,
        color: 15158332, // Red color
        fields: [
          { name: 'Risk Score', value: incident.risk_score.toString(), inline: true },
          { name: 'Status', value: incident.status, inline: true },
          { name: 'Summary', value: incident.ai_analysis?.summary || 'No summary available.' }
        ],
        timestamp: new Date().toISOString()
      }
    ]
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      console.error('[Webhook] Failed to dispatch alert:', await res.text())
      return { success: false, reason: 'API Error' }
    }

    console.log(`[Webhook] Successfully dispatched alert for Incident ${incident.id}`)
    return { success: true }
  } catch (error) {
    console.error('[Webhook] Network error dispatching alert:', error)
    return { success: false, reason: 'Network Error' }
  }
}
