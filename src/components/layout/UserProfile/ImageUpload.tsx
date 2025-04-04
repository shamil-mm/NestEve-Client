import { FileUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { deleteImage, fetchUserData, generatePrisignedUrl, getProfileImage, imageUpload, saveImageUrl, uploadImageToServer } from '../../../services/authServices';
import { toast } from 'react-fox-toast';
import { useAppDispatch,useAppSelector } from "../../../hooks/AuthHook";
import { setAvatar } from '../../../store/slices/authUsers';
import { useNavigate } from 'react-router-dom';

const ImageUpload = () => {

    const [selectedImage,setSelectedImage]=useState<string | null>(null)
    const [imageFile,setImageFile]=useState<File|null>(null);
    const [uploading,setUploading]=useState(false)
    const [error,setError]=useState("")
    const dispatch=useAppDispatch()
    const id = useAppSelector((state) => state.authUser?.user?.id)
    const [user,setUser]=useState<{name:string,email:string;avatarUrl:string,role:string}|null>(null)
    const navigate=useNavigate()

    // useEffect(()=>{
    //     setSelectedImage(selectedImage)
    // },[selectedImage])

    useEffect(()=>{ 
        const fetchUser=async()=>{
          const user= await fetchUserData(id as string)
          setUser(user)
          const response= await getProfileImage(user.avatarUrl)
          console.log(response.data.url)
          if(JSON.stringify(response.data.url)!=='{}'){
            setSelectedImage(response.data.url)
          }
          
        }
        fetchUser()
      },[id])
   
    const handleImageChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const file=e?.target.files?.[0]
        if(file && file.type.startsWith('image/')){
            const reader= new FileReader()
            reader.onloadend=()=>{
                setSelectedImage(reader.result as string)    
            }
            reader.readAsDataURL(file)
            setImageFile(file)
            setError("")
        }else{
            setSelectedImage(null)
            setImageFile(null)
            setError("Please select a valid image file.")
            return
        }
    }

    const handleUpdateProfile= useCallback(async(e:React.FormEvent)=>{
        e.preventDefault()
    if(!imageFile){
        setError("Please select an image to upload.")
        return
    }
    if (!id) {
      setError("User ID not found. Please try again.");
      return;
    }
    
    setUploading(true);
    setError("")
      try {
        const oldImageUrl=user?.avatarUrl
        const response=await uploadImageToServer(imageFile,id,oldImageUrl as string)
        if(response.data){
          toast.success('Image Updated')
          dispatch(setAvatar(response.data.avatarUrl))
          navigate('/profile')
        }
        
      } catch (err:any) {
        console.error('Upload error:', err);
        const errorMessage = err.response?.data?.message || 'Failed to upload image. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage)
        
      }finally{
        setUploading(false);
      }
    },[imageFile,dispatch,id])


  return (
    

    <div  >
      <div className= " bg-black/80 bg-opacity-70 p-12 space-y-4  max-w-[100%]">
     <div className="flex justify-center align-middle">
    
      
      {selectedImage ? (
        <img src={selectedImage}  alt="Preview" className="w-20 h-20 rounded-full object-cover" />
    ):(
        <FileUp size={80}/>
    )}
    
    
      
        
      </div> 
      <h1  className="text-center"> Upload Profile Image</h1>
           
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* {zoderror?<span className="text-red-700">{zoderror.phone}</span>:""} */}
              <input 
                type="file" 
                name="image"
                accept='image/*'
                onChange={handleImageChange}
                placeholder="Upload Imgae..."
                className="w-full bg-black-800 border border-white-500 text-white px-3 py-2 rounded"
              />

              {error && <p className='text-red-500 text-sm'>{error}</p>}
              
             
               
            <div className="flex justify-end space-x-2 mt-6">
            <button type="submit" className={`bg-blue-600 text-white px-4 py-2 text-sm ${uploading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={uploading}>
    {uploading ? "Uploading..." : "Upload Image"}
</button>
            </div>
            </form>
            
          </div>
          </div>
  )
}

export default ImageUpload
