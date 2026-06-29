import { AuthForm } from '@/features/auth/components/auth-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <AuthForm mode="login" />
    </div>
  )
}
