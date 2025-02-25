import registerImage from '../../assets/Flat Design Login Screen UI Concept for Mobile and Web Applications.jpeg'
import background from '../../assets/abstract-background.jpg'
import RegisterForm from '../../components/layout/RegisterPage/RegisterForm'


const Register = () => {
  const handleSubmit=(data:{name:string;email:string;password:string})=>{
    console.log('form data :',data)
  }
  const handleGoogleSignIn=()=>{
    console.log('signing in with googe')
  }
  return (
    <div className="min-h-screen p-8 flex items-center justify-center" style={{backgroundImage:`url(${background})`,backgroundPosition: 'center',
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat'}}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="w-full max-w-4xl bg-black/50 backdrop-blur-sm border-1 border-amber-50">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center bg-white  p-4">
          <img className="w-full h-full"  src={registerImage} alt="Register left side image"/>
          </div>

        
          <div className="space-y-6">       
          <RegisterForm onSubmit={handleSubmit} onGoogleSignIn={handleGoogleSignIn}/>
          </div>
        </div>
      </div>
      <div/>
    </div>
  )
}

export default Register
