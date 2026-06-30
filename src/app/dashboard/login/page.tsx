import type { Metadata } from 'next'
import { loginStaff } from '@/lib/actions'
import LoginForm from './_components/LoginForm'

export const metadata: Metadata = {
  title: 'Staff Login | Walker Property Services',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#111111' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Walker Property Services" style={{ height: '120px', width: '120px', objectFit: 'contain', margin: '0 auto 16px', mixBlendMode: 'screen' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#f0f0f0' }}>Walker Property Services</h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>Staff Portal</p>
        </div>

        <LoginForm action={loginStaff} />
      </div>
    </div>
  )
}
