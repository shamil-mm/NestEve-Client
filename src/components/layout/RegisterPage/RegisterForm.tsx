import React from 'react'
interface RegisterFormProps{
  onSubmit:(data:{name:string;email:string;password:string})=>void;
  onGoogleSignIn?:()=>void;
}

const RegisterForm:React.FC<RegisterFormProps> = ({onSubmit,onGoogleSignIn}) => {
    const handleSubmit = (e:React.FormEvent)=>{
        e.preventDefault()
        const formData=new FormData(e.target as HTMLFormElement);
        const data={
            name:formData.get('name') as string,
            email:formData.get('email') as string,
            password:formData.get('password') as string,
        }
        onSubmit(data)
    }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm mb-2">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          className="w-full px-3 py-2 bg-white/10 border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-white text-sm mb-2">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 bg-white/10 border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-white text-sm mb-2">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className="w-full px-3 py-2 bg-white/10 border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-white text-sm mb-2">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          className="w-full px-3 py-2 bg-white/10 border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <button type="submit" className="w-full h-12 bg-blue-700 hover:bg-blue-600 text-white py-2 transition-colors">
      Create Account
    </button>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-600"></span>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 text-gray-400 bg-black">OR</span>
      </div>
    </div>

    <button
      type="button"
      onClick={onGoogleSignIn}
      className="w-full h-12 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white p-4 transition-colors"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  </form>
  )
}

export default RegisterForm
