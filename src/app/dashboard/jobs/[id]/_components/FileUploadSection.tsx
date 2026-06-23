'use client'

import { useState, useRef, useTransition } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { saveFileRecord, deleteFileRecord } from '@/lib/actions'
import { FILE_TYPE_LABELS } from '@/types'
import type { JobFile, FileType } from '@/types'

interface Props {
  jobId: string
  files: JobFile[]
  signedUrls: Record<string, string>
}

const FILE_TYPES: { value: FileType; label: string }[] = [
  { value: 'before_photo',      label: 'Before Photo' },
  { value: 'after_photo',       label: 'After Photo' },
  { value: 'readiness_report',  label: 'Readiness Report (PDF)' },
]

export default function FileUploadSection({ jobId, files, signedUrls }: Props) {
  const [fileType, setFileType] = useState<FileType>('before_photo')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deletingId, startDeleteTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const staffFiles = files.filter(f => f.file_type !== 'submission_photo')
  const submissionPhotos = files.filter(f => f.file_type === 'submission_photo')

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const filePath = `${jobId}/${fileType}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('job-files')
        .upload(filePath, file)

      if (uploadError) throw new Error(uploadError.message)

      await saveFileRecord(jobId, filePath, file.name, fileType)
      setSuccess(`${file.name} uploaded successfully.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleDelete(fileId: string, filePath: string) {
    startDeleteTransition(async () => {
      await deleteFileRecord(fileId, filePath, jobId)
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Upload area */}
      <div>
        <div className="flex gap-2 mb-3">
          {FILE_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFileType(value)}
              className="px-3 py-1.5 rounded text-xs font-medium transition-all"
              style={{
                background: fileType === value ? 'rgba(107,140,35,0.2)' : '#111111',
                color:      fileType === value ? '#6B8C23' : '#888888',
                border:     fileType === value ? '1px solid rgba(107,140,35,0.4)' : '1px solid #2e2e2e',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="rounded-lg p-5 text-center cursor-pointer transition-colors"
          style={{ background: '#111111', border: '2px dashed #2e2e2e' }}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <p className="text-sm" style={{ color: '#6B8C23' }}>Uploading...</p>
          ) : (
            <>
              <p className="text-sm mb-0.5" style={{ color: '#f0f0f0' }}>Click to upload {FILE_TYPE_LABELS[fileType]}</p>
              <p className="text-xs" style={{ color: '#888888' }}>
                {fileType === 'readiness_report' ? 'PDF files' : 'JPG, PNG, HEIC'}
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept={fileType === 'readiness_report' ? '.pdf' : 'image/*'}
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>

        {error   && <p className="text-xs mt-2" style={{ color: '#fca5a5' }}>{error}</p>}
        {success && <p className="text-xs mt-2" style={{ color: '#86efac' }}>{success}</p>}
      </div>

      {/* Submission photos from customer */}
      {submissionPhotos.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: '#888888' }}>
            Customer Submission Photos
          </p>
          <div className="grid grid-cols-3 gap-2">
            {submissionPhotos.map(file => (
              <a
                key={file.id}
                href={signedUrls[file.id]}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden aspect-square relative group"
                style={{ background: '#111111', border: '1px solid #2e2e2e' }}
              >
                {signedUrls[file.id] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={signedUrls[file.id]}
                    alt={file.file_name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium transition-all">View</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Staff-uploaded files */}
      {staffFiles.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide font-semibold mb-2" style={{ color: '#888888' }}>
            Team Uploads
          </p>
          <div className="flex flex-col gap-2">
            {staffFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ background: '#111111', border: '1px solid #2e2e2e' }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#f0f0f0' }}>{file.file_name}</p>
                  <p className="text-xs" style={{ color: '#888888' }}>{FILE_TYPE_LABELS[file.file_type]}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  {signedUrls[file.id] && (
                    <a
                      href={signedUrls[file.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline"
                      style={{ color: '#6B8C23' }}
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(file.id, file.file_path)}
                    disabled={!!deletingId}
                    className="text-xs transition-colors hover:opacity-80 disabled:opacity-40"
                    style={{ color: '#fca5a5' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
