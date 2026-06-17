import Anthropic from '@anthropic-ai/sdk'
import type { AIAnalysis } from '@/types'

// ── Pricing engine ────────────────────────────────────────────────────────────
// Applies Walker Property Services pricing tiers based on AI classification.

export function calculateQuote(analysis: AIAnalysis): { low: number; high: number } {
  let low = 0
  let high = 0

  // Base price from estimated load size
  switch (analysis.load_size) {
    case 'quarter':        low = 150;  high = 200;  break
    case 'half':           low = 200;  high = 300;  break
    case 'three_quarter':  low = 300;  high = 400;  break
    case 'full':           low = 450;  high = 600;  break
    case 'multiple':       low = 700;  high = 1000; break
  }

  // Job-type minimums — certain job types always carry a floor price
  if (analysis.job_type === 'turnover_prep') {
    low  = Math.max(low,  750)
    high = Math.max(high, 1500)
  } else if (analysis.job_type === 'light_demo') {
    low  = Math.max(low,  1500)
    high = Math.max(high, 3500)
  } else if (analysis.job_type === 'cleanout' && analysis.volume === 'small') {
    low  = Math.max(low,  375)
    high = Math.max(high, 650)
  }

  // Stair add-on
  if (analysis.add_ons.stairs === 'one_flight') {
    low += 50; high += 50
  } else if (analysis.add_ons.stairs === 'two_three_flights') {
    low += 100; high += 200
  }

  // Item add-ons
  if (analysis.add_ons.large_items)       { low += 50;  high += 100 }
  if (analysis.add_ons.appliances > 0)    { const c = analysis.add_ons.appliances * 50; low += c; high += c }
  if (analysis.add_ons.heavy_debris)      { low += 150; high += 300 }
  if (analysis.add_ons.travel_outside_core) { low += 25; high += 75 }

  return { low: Math.round(low), high: Math.round(high) }
}

// ── AI analysis ───────────────────────────────────────────────────────────────
// Calls Claude with photos + description and returns a structured classification.

export async function generateAIQuote(params: {
  jobType: string
  customerNotes: string | null
  photos: { data: string; mediaType: string }[]
}): Promise<{ analysis: AIAnalysis; quoteLow: number; quoteHigh: number } | null> {
  // Skip gracefully if no API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[generateAIQuote] No ANTHROPIC_API_KEY set — skipping AI analysis')
    return null
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const { jobType, customerNotes, photos } = params

  // Build the message content: images first, then the text prompt
  const content: Anthropic.ContentBlockParam[] = []

  // Attach up to 5 photos (API limit / cost control)
  for (const photo of photos.slice(0, 5)) {
    const mt = photo.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: mt, data: photo.data },
    })
  }

  // Text prompt asking for structured JSON classification
  content.push({
    type: 'text',
    text: `You are an expert estimator for Walker Property Services, a Philadelphia-area property services company specializing in junk removal, light demolition, turnover prep, and site prep.

Analyze the job request below and classify it. Return ONLY a valid JSON object — no prose, no markdown, no code fences.

Customer-selected job type: ${jobType}
Customer notes: ${customerNotes || 'None provided'}
Photos attached: ${photos.length}

Return exactly this JSON structure:
{
  "job_type": "cleanout" | "light_demo" | "turnover_prep" | "site_prep",
  "volume": "small" | "standard" | "heavy",
  "load_size": "quarter" | "half" | "three_quarter" | "full" | "multiple",
  "add_ons": {
    "stairs": "none" | "one_flight" | "two_three_flights",
    "large_items": true | false,
    "appliances": 0,
    "heavy_debris": true | false,
    "travel_outside_core": false
  },
  "confidence": "low" | "medium" | "high",
  "reasoning": "One or two sentences explaining your assessment."
}

Classification guidelines:
- load_size: quarter = a few items/boxes, half = one room's worth, three_quarter = 2-3 rooms, full = whole unit or house, multiple = very large / multiple truckloads needed
- volume: small = minimal debris, standard = average cleanout, heavy = large amount of debris or demolition waste
- large_items: true if you see furniture, mattresses, or bulky items requiring extra effort
- appliances: count refrigerators, stoves, washers, dryers, etc.
- heavy_debris: true if you see brick, concrete, or heavy construction waste
- travel_outside_core: default false — only true if customer explicitly mentions a location far from Philadelphia
- If no photos are attached, use the job type and notes to estimate conservatively
- confidence: high = photos clearly show scope, medium = photos present but scope unclear, low = no photos / very limited info`,
  })

  const message = await anthropic.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 1024,
    messages:   [{ role: 'user', content }],
  })

  const rawText = message.content.find((b) => b.type === 'text')?.text ?? ''
  const analysis = JSON.parse(rawText) as AIAnalysis

  const { low, high } = calculateQuote(analysis)
  return { analysis, quoteLow: low, quoteHigh: high }
}
