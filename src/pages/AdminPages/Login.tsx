import LoginForm from "../../components/layout/AdminLogin/LoginForm"
import WelcomeSection from "../../components/layout/AdminLogin/WelcomeSection"
const Login = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 flex justify-center items-center bg-white">
        <LoginForm />
      </div>
      <div className="flex-1 bg-blue-600 flex items-center justify-center text-white md:block ">
        <WelcomeSection />
      </div>
    </div>
  )
}

export default Login
