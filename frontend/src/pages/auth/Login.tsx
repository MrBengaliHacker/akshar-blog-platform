// Components
import { LoginForm } from "@/components/LoginForm";

export const Login = () => {
  return (
    <div className='relative min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16 overflow-hidden'>
      <div className='relative w-full max-w-sm md:max-w-md'>
        <LoginForm />
      </div>
    </div>
  )
};