import axios from 'axios'
import { client } from './client';

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

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

export const fetchUserData=async(userId: string)=>{
  try {
    const response=await client.get(`/auth/api/currect-user/${userId}`)
    return response?.data?.user
    
  } catch (error) {
    console.log('fetch user data error',error)
  }
}
export const fetchAddress=async(userId: string)=>{
  try {
    const response=await client.get(`/auth/api/user-address/${userId}`)
    return response?.data?.address
    
  } catch (error) {
    console.log('fetch user data error',error)
  }
}
export const addAddress=async(email:string,address:object)=>{
  try {
    const response=await client.post(`/auth/api/add-address`,{email,address})
   return response.data
    
  } catch (error) {
    console.log('user address sent to the server error',error)
  }
}
export const deleteAddress=async(data:{userId:string,addressId:string})=>{
  try {
    const response=await client.post(`/auth/api/delete-address`,data)
    return response.data
  } catch (error) {
    console.log('user address delete error',error)
  }
}
export const updateAddress=async(email:string,address:object,addressId:string)=>{
  try {
    const response=await client.post(`/auth/api/update-address`,{email,address,addressId})
   return response.data
    
  } catch (error) {
    console.log('user address sent to the server error',error)
  }
}
export const updateName=async(data:{userId:string,name:string})=>{

  try {
    const response=await client.post(`/auth/api/update-name`,data)
   return response.data
    
  } catch (error) {
    console.error('User name update error:', error);
    throw new Error('Failed to update user name. Please try again later.');
  }
}
export const updatePassword=async(email:string,passwords:{oldpassword:string,newpassword:string})=>{

  try {
    const response=await client.post(`/auth/api/update-password`,{email,passwords})
   return response.data
    
  } catch (error) {
    console.error('User name update error:', error);
    throw new Error('Failed to update user name. Please try again later.');
  }
}


// image upload recorrection

export const imageUpload=async(url:string,imageFile:File)=>{
  console.log(imageFile)
  try {
   console.log('url form service',url)
   const response=await axios.put(url,imageFile,{headers:{'Content-Type':imageFile.type}})
   return response
   
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to update image. Please try again later.');
  }

}
export const generatePrisignedUrl=async(params:{fileName:string,fileType:string})=>{
  try {
    const response=await client.get(`/auth/api/generate-presigned-url`,{params})
    return response.data
  } catch (error) {
    console.error('generateprisigned url error:', error);
    throw new Error('Failed to generate prisigned url . Please try again later.');
  }

}
export const saveImageUrl=async(params:{fileName:string,fileType:string},id:string)=>{
  try {
    console.log(params)
    const response=await client.post(`/auth/api/save-image-url`,{params,id})
   return response.data
  } catch (error) {
    console.error('Failed to save image url', error);
    throw new Error('Failed to save image url');
    
  }
}
export const deleteImage=async(imageUrl:string)=>{
  try {
    console.log("delete image url is working")
    const response=await client.post(`/auth/api/delete-image-url`,{imageUrl})
    console.log('delete image ',response)
  } catch (error) {
    console.error('Failed to delete image from s3', error);
    throw new Error('Failed to delete image from s3');
  }
}

export const uploadImageToServer=async(file:File,id:string,oldImageUrl:string)=>{
  try {

    const formData=new FormData()
    formData.append('image',file,file.name)
    formData.append('userId',id)
    formData.append('oldImageUrl',oldImageUrl)
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const response=await client.post(`/auth/api/upload-image-to-server`,formData,{
      headers:{"Content-Type": "multipart/form-data"},
      timeout: 30000, 
      onUploadProgress: (progressEvent) => {
        const percentCompleted = progressEvent.total 
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total) 
          : 0;
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    })
    return response
   } catch (error :any) {
     console.error('Error uploading image:', error);
     if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Server Response Error:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No Response Received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error Setup:', error.message);
    }

    throw new Error('Failed to upload image. Please check file size and network connection.');
  }
   
}

export const getProfileImage= async(avatarUrl:string)=>{
  try {
    const response=await client.get(`/auth/api/get-profileImage`,{params:{avatarUrl}})
    return response
  } catch (error) {
    console.error('Failed to get image from s3', error);
    throw new Error('Failed to get image from s3');
  }
}

export const deleteImageFromServer=async (id:string,avatarUrl:string)=>{
  try {
    const response=await client.post(`/auth/api/delete-profileImage`,{id,avatarUrl})
    return response
    
  } catch (error) {
    console.error('Failed to get image from s3', error);
    throw new Error('Failed to get image from s3');   
  }
}