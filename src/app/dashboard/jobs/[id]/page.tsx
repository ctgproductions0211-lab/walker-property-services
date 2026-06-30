import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import { JOB_TYPE_LABELS, JOB_STATUS_LABELS, FILE_TYPE_LABELS, SERVICE_SELECTION_LABELS } from '@/types'
import type { Job, JobFile } from '@/types'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Job Details | Walker Property Services',
    robots: { index: false, follow: false },
  }
}
import StatusForm from './_components/StatusForm'
import QuoteForm from './_components/QuoteForm'
import NotesForm from './_components/NotesForm'
import FileUploadSection from './_components/FileUploadSection'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  received:    { bg: 'rgba(59,130,246,0.15)',  text: '#93c5fd' },
  quoted:      { bg: 'rgba(107,140,35,0.15)',  text: '#6B8C23' },
  scheduled:   { bg: 'rgba(139,92,246,0.15)',  text: '#c4b5fd' },
  in_progress: { bg: 'rgba(249,115,22,0.15)',  text: '#fdba74' },
  complete:    { bg: 'rgba(34,197,94,0.15)',   text: '#86efac' },
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [jobResult, filesResult] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', id).single(),
    supabase.from('job_files').select('*').eq('job_id', id).order('created_at'),
  ])

  const job = jobResult.data as Job | null
  const files = filesResult.data as JobFile[] | null

  if (!job) notFound()

  const jobFiles = files ?? []
  const colors = STATUS_COLORS[job.status]

  // Generate signed URLs for all files
  const signedUrls: Record<string, string> = {}
  for (const file of jobFiles) {
    const { data } = await supabase.storage
      .from('job-files')
      .createSignedUrl(file.file_path, 3600)
    if (data) signedUrls[file.id] = data.signedUrl
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#888888' }}>
        <Link href="/dashboard" className="hover:underline" style={{ color: '#6B8C23' }}>Jobs</Link>
        <span>/</span>
        <span>{job.customer_name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: '#f0f0f0' }}>{job.customer_name}</h1>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: colors.bg, color: colors.text }}
            >
              {JOB_STATUS_LABELS[job.status]}
            </span>
          </div>
          <p style={{ color: '#888888' }}>{job.property_address}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: '#888888' }}>Tracking Code</p>
          <p className="font-bold font-mono text-lg" style={{ color: '#6B8C23' }}>{job.tracking_code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — details + actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Job info */}
          <Card title="Job Information">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Service Type" value={JOB_TYPE_LABELS[job.job_type]} />
              <Detail label="Submitted" value={new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
              {job.service_selection && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#888888' }}>Customer Service Selection</p>
                  <span
                    className="inline-block text-xs font-semibold px-2.5 py-1 rounded"
                    style={{ background: 'rgba(107,140,35,0.12)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.25)' }}
                  >
                    {SERVICE_SELECTION_LABELS[job.service_selection] ?? job.service_selection}
                  </span>
                </div>
              )}
              {job.customer_email && <Detail label="Email" value={job.customer_email} />}
              {job.customer_phone && <Detail label="Phone" value={job.customer_phone} />}
              <div className="col-span-2">
                <Detail label="Property Address" value={job.property_address} />
              </div>
              {job.customer_notes && (
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#888888' }}>Customer Notes</p>
                  <p className="text-sm leading-relaxed p-3 rounded-lg" style={{ background: '#111111', color: '#f0f0f0' }}>
                    {job.customer_notes}
                  </p>
                </div>
              )}
              {(job.utm_source || job.utm_medium || job.utm_campaign) && (
                <div className="col-span-2 pt-3 border-t" style={{ borderColor: '#2e2e2e' }}>
                  <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#888888' }}>Lead Source</p>
                  <div className="flex flex-wrap gap-2">
                    {job.utm_source && (
                      <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'rgba(107,140,35,0.12)', color: '#6B8C23', border: '1px solid rgba(107,140,35,0.25)' }}>
                        source: {job.utm_source}
                      </span>
                    )}
                    {job.utm_medium && (
                      <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: '#1a1a1a', color: '#888888', border: '1px solid #2e2e2e' }}>
                        medium: {job.utm_medium}
                      </span>
                    )}
                    {job.utm_campaign && (
                      <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: '#1a1a1a', color: '#888888', border: '1px solid #2e2e2e' }}>
                        campaign: {job.utm_campaign}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Internal notes */}
          <Card title="Internal Notes">
            <NotesForm jobId={job.id} currentNotes={job.internal_notes ?? ''} />
          </Card>

          {/* Files */}
          <Card title="Files & Photos">
            <FileUploadSection
              jobId={job.id}
              files={jobFiles}
              signedUrls={signedUrls}
            />
          </Card>
        </div>

        {/* Right column — status + quote */}
        <div className="flex flex-col gap-6">

          <Card title="Update Status">
            <StatusForm jobId={job.id} currentStatus={job.status} />
          </Card>

          <Card title="Quote">
            <QuoteForm jobId={job.id} currentAmount={job.quote_amount} />
          </Card>

          {/* AI Analysis */}
          {job.ai_quote_low && job.ai_quote_high && job.ai_analysis && (
            <Card title="AI Estimate">
              {/* Quote range */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#888888' }}>Estimated Range</p>
                <p className="text-2xl font-bold" style={{ color: '#6B8C23' }}>
                  ${job.ai_quote_low.toLocaleString()} – ${job.ai_quote_high.toLocaleString()}
                </p>
              </div>

              {/* Classification details */}
              <div className="flex flex-col gap-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#888888' }}>Volume</span>
                  <span className="capitalize" style={{ color: '#f0f0f0' }}>{job.ai_analysis.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#888888' }}>Load Size</span>
                  <span style={{ color: '#f0f0f0' }}>
                    {job.ai_analysis.load_size === 'quarter'       ? '¼ Load' :
                     job.ai_analysis.load_size === 'half'          ? '½ Load' :
                     job.ai_analysis.load_size === 'three_quarter' ? '¾ Load' :
                     job.ai_analysis.load_size === 'full'          ? 'Full Load' : '2+ Loads'}
                  </span>
                </div>
                {job.ai_analysis.add_ons.stairs !== 'none' && (
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Stairs</span>
                    <span style={{ color: '#f0f0f0' }}>
                      {job.ai_analysis.add_ons.stairs === 'one_flight' ? '1 flight' : '2-3 flights'}
                    </span>
                  </div>
                )}
                {job.ai_analysis.add_ons.large_items && (
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Large Items</span>
                    <span style={{ color: '#f0f0f0' }}>Yes</span>
                  </div>
                )}
                {job.ai_analysis.add_ons.appliances > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Appliances</span>
                    <span style={{ color: '#f0f0f0' }}>{job.ai_analysis.add_ons.appliances}</span>
                  </div>
                )}
                {job.ai_analysis.add_ons.heavy_debris && (
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Heavy Debris</span>
                    <span style={{ color: '#f0f0f0' }}>Yes</span>
                  </div>
                )}
              </div>

              {/* Reasoning */}
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#888888' }}>
                {job.ai_analysis.reasoning}
              </p>

              {/* Confidence badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#888888' }}>Confidence:</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase"
                  style={{
                    background:
                      job.ai_confidence === 'high'   ? 'rgba(34,197,94,0.15)'  :
                      job.ai_confidence === 'medium' ? 'rgba(107,140,35,0.15)' :
                                                       'rgba(248,113,113,0.15)',
                    color:
                      job.ai_confidence === 'high'   ? '#86efac' :
                      job.ai_confidence === 'medium' ? '#6B8C23' :
                                                       '#f87171',
                  }}
                >
                  {job.ai_confidence}
                </span>
              </div>
            </Card>
          )}

          {/* Files summary */}
          {jobFiles.length > 0 && (
            <Card title="Uploaded Files">
              <div className="flex flex-col gap-2">
                {jobFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: '#f0f0f0' }}>{file.file_name}</p>
                      <p className="text-xs" style={{ color: '#888888' }}>{FILE_TYPE_LABELS[file.file_type]}</p>
                    </div>
                    {signedUrls[file.id] && (
                      <a
                        href={signedUrls[file.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs flex-shrink-0 underline"
                        style={{ color: '#6B8C23' }}
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#1c1c1c', border: '1px solid #2e2e2e' }}>
      <h2 className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: '#888888' }}>{title}</h2>
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: '#888888' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: '#f0f0f0' }}>{value}</p>
    </div>
  )
}
