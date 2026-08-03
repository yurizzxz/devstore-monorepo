import { LoginForm } from "./login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center overflow-hidden">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
