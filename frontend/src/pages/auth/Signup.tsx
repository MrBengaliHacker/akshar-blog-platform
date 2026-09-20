// Components
import { SignupForm } from "@/components/SignupForm";

export const Signup = () => {
  return (
    <div className='relative min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16'>
      <div className='relative w-full max-w-sm md:max-w-md'>
        <SignupForm />
      </div>
    </div>
  )
};