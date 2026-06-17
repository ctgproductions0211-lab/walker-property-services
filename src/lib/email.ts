import { Resend } from 'resend'
import { JOB_TYPE_LABELS } from '@/types'
import type { JobType, AIAnalysis } from '@/types'

const resend = new Resend(process.env.RESEND_API_KEY)

const NOTIFY_EMAIL = 'ctgproductions0211@gmail.com'
const FROM_EMAIL   = 'Walker Property Services <onboarding@resend.dev>'

interface JobNotificationParams {
  customerName:    string
  customerEmail:   string | null
  customerPhone:   string | null
  propertyAddress: string
  jobType:         JobType
  customerNotes:   string | null
  trackingCode:    string
  photoLinks:      { name: string; url: string }[]
  aiQuoteLow:      number | null
  aiQuoteHigh:     number | null
  aiAnalysis:      AIAnalysis | null
}

export async function sendJobNotificationEmail(params: JobNotificationParams) {
  const {
    customerName,
    customerEmail,
    customerPhone,
    propertyAddress,
    jobType,
    customerNotes,
    trackingCode,
    photoLinks,
    aiQuoteLow,
    aiQuoteHigh,
    aiAnalysis,
  } = params

  const jobTypeLabel = JOB_TYPE_LABELS[jobType]

  const photosSection = photoLinks.length > 0
    ? `
      <div style="background:#1a2f4a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#c9a558;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">
          Photos (${photoLinks.length})
        </h2>
        ${photoLinks.map((p, i) => `
          <div style="margin-bottom:8px;">
            <a href="${p.url}" style="color:#c9a558;font-size:14px;text-decoration:underline;">
              📷 Photo ${i + 1} — ${p.name}
            </a>
            <span style="color:#8a9bb0;font-size:11px;margin-left:8px;">(link valid 7 days)</span>
          </div>
        `).join('')}
      </div>`
    : `
      <div style="background:#1a2f4a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#c9a558;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Photos</h2>
        <p style="color:#8a9bb0;font-size:13px;margin:0;">No photos attached to this submission.</p>
      </div>`

  const notesSection = customerNotes
    ? `
      <div style="background:#1a2f4a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#c9a558;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Customer Notes</h2>
        <p style="color:#f5f7fa;font-size:14px;line-height:1.6;margin:0;">${customerNotes}</p>
      </div>`
    : ''

  const LOAD_SIZE_LABELS: Record<string, string> = {
    quarter:       '¼ Load',
    half:          '½ Load',
    three_quarter: '¾ Load',
    full:          'Full Load',
    multiple:      '2+ Loads',
  }
  const VOLUME_LABELS: Record<string, string> = {
    small: 'Small', standard: 'Standard', heavy: 'Heavy',
  }
  const STAIR_LABELS: Record<string, string> = {
    none: 'None', one_flight: '1 Flight (+$50)', two_three_flights: '2-3 Flights (+$100-$200)',
  }
  const CONFIDENCE_COLORS: Record<string, string> = {
    high: '#86efac', medium: '#c9a558', low: '#f87171',
  }

  const aiSection = aiQuoteLow && aiQuoteHigh && aiAnalysis
    ? `
      <div style="background:#1a2f4a;border-radius:12px;padding:24px;margin-bottom:16px;border:1px solid rgba(201,165,88,0.3);">
        <h2 style="color:#c9a558;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">
          🤖 AI Quote Estimate
        </h2>
        <div style="text-align:center;margin-bottom:16px;">
          <span style="color:#c9a558;font-size:28px;font-weight:bold;">
            $${aiQuoteLow.toLocaleString()} – $${aiQuoteHigh.toLocaleString()}
          </span>
          <span style="color:#8a9bb0;font-size:12px;margin-left:8px;">estimated range</span>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px;">
          <tr>
            <td style="color:#8a9bb0;font-size:12px;padding:4px 0;width:130px;">Job Type</td>
            <td style="color:#f5f7fa;font-size:12px;padding:4px 0;">${aiAnalysis.job_type.replace(/_/g, ' ')}</td>
          </tr>
          <tr>
            <td style="color:#8a9bb0;font-size:12px;padding:4px 0;">Volume</td>
            <td style="color:#f5f7fa;font-size:12px;padding:4px 0;">${VOLUME_LABELS[aiAnalysis.volume] ?? aiAnalysis.volume}</td>
          </tr>
          <tr>
            <td style="color:#8a9bb0;font-size:12px;padding:4px 0;">Load Size</td>
            <td style="color:#f5f7fa;font-size:12px;padding:4px 0;">${LOAD_SIZE_LABELS[aiAnalysis.load_size] ?? aiAnalysis.load_size}</td>
          </tr>
          <tr>
            <td style="color:#8a9bb0;font-size:12px;padding:4px 0;">Stairs</td>
            <td style="color:#f5f7fa;font-size:12px;padding:4px 0;">${STAIR_LABELS[aiAnalysis.add_ons.stairs] ?? aiAnalysis.add_ons.stairs}</td>
          </tr>
          ${aiAnalysis.add_ons.large_items ? `<tr><td style="color:#8a9bb0;font-size:12px;padding:4px 0;">Large Items</td><td style="color:#f5f7fa;font-size:12px;padding:4px 0;">Yes (+$50–$100)</td></tr>` : ''}
          ${aiAnalysis.add_ons.appliances > 0 ? `<tr><td style="color:#8a9bb0;font-size:12px;padding:4px 0;">Appliances</td><td style="color:#f5f7fa;font-size:12px;padding:4px 0;">${aiAnalysis.add_ons.appliances} (+$${aiAnalysis.add_ons.appliances * 50})</td></tr>` : ''}
          ${aiAnalysis.add_ons.heavy_debris ? `<tr><td style="color:#8a9bb0;font-size:12px;padding:4px 0;">Heavy Debris</td><td style="color:#f5f7fa;font-size:12px;padding:4px 0;">Yes (+$150–$300)</td></tr>` : ''}
        </table>
        <p style="color:#8a9bb0;font-size:12px;margin:8px 0 4px;">AI Reasoning</p>
        <p style="color:#f5f7fa;font-size:12px;line-height:1.5;margin:0 0 12px;">${aiAnalysis.reasoning}</p>
        <p style="margin:0;">
          <span style="font-size:11px;color:#8a9bb0;">Confidence: </span>
          <span style="font-size:11px;font-weight:600;color:${CONFIDENCE_COLORS[aiAnalysis.confidence] ?? '#8a9bb0'};">
            ${aiAnalysis.confidence.toUpperCase()}
          </span>
        </p>
      </div>`
    : `
      <div style="background:#1a2f4a;border-radius:12px;padding:24px;margin-bottom:16px;">
        <h2 style="color:#c9a558;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">AI Quote Estimate</h2>
        <p style="color:#8a9bb0;font-size:13px;margin:0;">AI analysis unavailable for this submission.</p>
      </div>`

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0d1b2a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#c9a558;width:44px;height:44px;border-radius:50%;line-height:44px;font-weight:bold;color:#0d1b2a;font-size:20px;text-align:center;">W</div>
      <h1 style="color:#f5f7fa;margin:12px 0 4px;font-size:22px;">New Job Request</h1>
      <p style="color:#8a9bb0;margin:0;font-size:14px;">Walker Property Services</p>
    </div>

    <!-- Alert strip -->
    <div style="background:rgba(201,165,88,0.15);border:1px solid rgba(201,165,88,0.35);border-radius:8px;padding:14px 20px;text-align:center;margin-bottom:20px;">
      <span style="color:#c9a558;font-weight:600;font-size:15px;">📋 ${jobTypeLabel} · ${customerName}</span>
    </div>

    <!-- Job details card -->
    <div style="background:#1a2f4a;border-radius:12px;padding:24px;margin-bottom:16px;">
      <h2 style="color:#c9a558;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 16px;">Job Details</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="color:#8a9bb0;font-size:13px;padding:5px 0;width:140px;vertical-align:top;">Customer</td>
          <td style="color:#f5f7fa;font-size:13px;padding:5px 0;font-weight:600;">${customerName}</td>
        </tr>
        ${customerEmail ? `
        <tr>
          <td style="color:#8a9bb0;font-size:13px;padding:5px 0;">Email</td>
          <td style="color:#f5f7fa;font-size:13px;padding:5px 0;">
            <a href="mailto:${customerEmail}" style="color:#c9a558;">${customerEmail}</a>
          </td>
        </tr>` : ''}
        ${customerPhone ? `
        <tr>
          <td style="color:#8a9bb0;font-size:13px;padding:5px 0;">Phone</td>
          <td style="color:#f5f7fa;font-size:13px;padding:5px 0;">
            <a href="tel:${customerPhone}" style="color:#c9a558;">${customerPhone}</a>
          </td>
        </tr>` : ''}
        <tr>
          <td style="color:#8a9bb0;font-size:13px;padding:5px 0;vertical-align:top;">Address</td>
          <td style="color:#f5f7fa;font-size:13px;padding:5px 0;font-weight:500;">${propertyAddress}</td>
        </tr>
        <tr>
          <td style="color:#8a9bb0;font-size:13px;padding:5px 0;">Service</td>
          <td style="color:#f5f7fa;font-size:13px;padding:5px 0;">${jobTypeLabel}</td>
        </tr>
        <tr>
          <td style="color:#8a9bb0;font-size:13px;padding:5px 0;">Tracking Code</td>
          <td style="color:#c9a558;font-size:15px;padding:5px 0;font-family:monospace;font-weight:bold;">${trackingCode}</td>
        </tr>
      </table>
    </div>

    ${notesSection}
    ${photosSection}
    ${aiSection}

    <!-- Footer -->
    <p style="color:#8a9bb0;font-size:11px;text-align:center;margin-top:28px;line-height:1.6;">
      Walker Property Services · Philadelphia Area<br/>
      This notification was sent because a customer submitted a job request.
    </p>
  </div>
</body>
</html>`

  const { error } = await resend.emails.send({
    from:    FROM_EMAIL,
    to:      NOTIFY_EMAIL,
    subject: `New Job Request — ${customerName} — ${jobTypeLabel}`,
    html,
  })

  if (error) throw new Error(`Resend error: ${error.message}`)
}
