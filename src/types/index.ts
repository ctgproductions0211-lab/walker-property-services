export type JobType = 'cleanout' | 'light_demo' | 'turnover_prep' | 'site_prep'
export type JobStatus = 'received' | 'quoted' | 'scheduled' | 'in_progress' | 'complete'
export type FileType = 'submission_photo' | 'before_photo' | 'after_photo' | 'readiness_report'

export interface AIAnalysis {
  job_type: JobType
  volume: 'small' | 'standard' | 'heavy'
  load_size: 'quarter' | 'half' | 'three_quarter' | 'full' | 'multiple'
  add_ons: {
    stairs: 'none' | 'one_flight' | 'two_three_flights'
    large_items: boolean
    appliances: number
    heavy_debris: boolean
    travel_outside_core: boolean
  }
  confidence: 'low' | 'medium' | 'high'
  reasoning: string
}

export interface Job {
  id: string
  created_at: string
  customer_name: string
  customer_email: string | null
  customer_phone: string | null
  property_address: string
  job_type: JobType
  status: JobStatus
  quote_amount: number | null
  customer_notes: string | null
  internal_notes: string | null
  tracking_code: string
  ai_quote_low: number | null
  ai_quote_high: number | null
  ai_analysis: AIAnalysis | null
  ai_confidence: 'low' | 'medium' | 'high' | null
}

export interface JobFile {
  id: string
  created_at: string
  job_id: string
  file_path: string
  file_name: string
  file_type: FileType
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  cleanout: 'Cleanout',
  light_demo: 'Light Demo',
  turnover_prep: 'Turnover Prep',
  site_prep: 'Site Prep',
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  received: 'Received',
  quoted: 'Quoted',
  scheduled: 'Scheduled',
  in_progress: 'In Progress',
  complete: 'Complete',
}

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  submission_photo: 'Submission Photo',
  before_photo: 'Before Photo',
  after_photo: 'After Photo',
  readiness_report: 'Readiness Report',
}
