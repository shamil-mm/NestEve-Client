import axios from 'axios'
import { client } from './client';

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL||'http://localhost:5001';

export const userRegister =async (formData:{name:String;email:string;password:string,role:'user'|'organizer'| null,organization?:string})=>{
    try {
        const response= await axios.post(`${API_BASE_URL}/auth/api/register`,formData,{ withCredentials: true })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Registration failed');
          }
          throw new Error('An unexpected error occurred');     
    }
}
export const verifyToken= async(token:string)=>{
    try {
        console.log('verify token is working')
        const response =await axios.post(`${API_BASE_URL}/auth/api/verify-email`,{token:`${token}`},{ withCredentials: true })
        console.log(response)
        return response.data
    } catch (error :any) {
        console.log(error)
        if (axios.isAxiosError(error)) {

            if(error?.response?.data?.message){
                throw new Error(error?.response?.data?.message);
            }
         
            throw new Error('Your Email is verified !');
          }
          throw new Error('An unexpected error occurred');
        
    }
}

export const userLogin=async(formData:{email:string,password:string,role:string})=>{
    try {
          const response =  await client.post(`/auth/api/login`,formData);
          console.log(response,"user lognin response")
          return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    } else {
      console.error("Login failed:", error);
    }
    throw error; 
  }
}
export const adminLogin=async(formData:{email:string,password:string,role:string})=>{
    try {
          const response =  await client.post(`/auth/api/admin-login`,formData);
          return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
      console.error("Login failed:", error.response?.data?.message || error.message);
    } else {
      console.error("Login failed:", error);
    }
    throw error; 
  }
}

export const userLogout=async()=>{

    try {
     const response = await client.post('/auth/api/logout')
     return response
        
    } catch (error) {
     console.log(error)   
    }
}
export const adminLogout=async()=>{
  console.log('admin logout is working')
    try {
     const response = await client.post('/auth/api/admin-logout')
     return response
        
    } catch (error) {
     console.log(error)   
    }
}
export const Googleauth=async(userData:{userID: string;role: string;})=>{

    try {
     const response = await client.post('/auth/api/google-auth',userData)
     return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.data?.message || error.message);
          } else {
            console.error("Login failed:", error);
          }
          throw error;  
    }
}

export const fetchUsers=async()=>{
  try {
   
    const response = await client.get('/auth/api/admin-get-users')
    return response
  } catch (error) {
    
    console.log('fetch users error',error)
  }
}
export const fetchOrganizers=async()=>{
  try {
   
    const response = await client.get('/auth/api/admin-get-organizers')
    console.log(response)
    return response
  } catch (error) {
    
    console.log('fetch users error',error)
  }
}
export const blockUser=async(data:{email:string,is_block:boolean})=>{
  try {
    const response=await client.post('/auth/api/admin-block-user',data)
    return response
  } catch (error) {
    console.log('block users error',error)
  }

}
export const forgotPassword=async(data:{email:string,password:string})=>{
  try {
    const response=await client.post('/auth/api/forgot-password',data)
    return response
  } catch (error) {
    console.log('forgot password error',error)
  }
}

export const verifyForgotPasswordToken= async(token:string)=>{
  try {
      console.log('verify forgot password token is working')
      const response =await axios.post(`${API_BASE_URL}/auth/api/verify-forgot-password`,{token:`${token}`},{ withCredentials: true })
      console.log(response)
      return response.data
  } catch (error :any) {
      console.log(error)
      if (axios.isAxiosError(error)) {

          if(error?.response?.data?.message){
              throw new Error(error?.response?.data?.message);
          }
       
          throw new Error('Your Email is verified !');
        }
        throw new Error('An unexpected error occurred');
      
  }
}
