import { loginStaff } from '@/lib/actions'
import LoginForm from './_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0d1b2a' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#c9a558' }}>
            <span className="font-bold text-xl" style={{ color: '#0d1b2a' }}>W</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#f5f7fa' }}>Walker Property Services</h1>
          <p className="text-sm mt-1" style={{ color: '#8a9bb0' }}>Staff Portal</p>
        </div>

        <LoginForm action={loginStaff} />
      </div>
    </div>
  )
}
