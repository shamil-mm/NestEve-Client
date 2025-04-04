import SecondNavbar from "../../components/common/Navbar2/SecondNavbar"
import useravatar from '../../assets/useravatar.jpg'
import bg from '../../../src/assets/abstract-background.jpg';
import React, { useEffect, useState } from "react";
import { addAddress, deleteAddress, deleteImageFromServer, fetchAddress, fetchUserData, getProfileImage, updateAddress, updateName, updatePassword } from "../../services/authServices";
import { useAppSelector } from "../../hooks/AuthHook";
import { zodAddressSchema } from "../../schemas/userSchema";
import { toast } from "react-fox-toast";
import ImageUpload from "../../components/layout/UserProfile/ImageUpload";


const EditUserProfile = () => {
  interface addressForm{
    phone:string;
  street: string;
  city: string;
  state: string;
  country:string;
  zip: string;
  _id?:string

  }
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showFileUploadForm, setShowFileUploadForm] = useState(false);
    const id = useAppSelector((state) => state.authUser?.user?.id)
    const [currentUser, setCurrentUser] = useState<{name:string,email:string;avatarUrl:string|null,role:string}|null>(null);
    const [singleAddress,setSingleAddress]=useState<addressForm>({phone:"" ,
      street: "",
      city: "",
      state: "",
      country: "",
      zip: ""})
    const [selectedImage,setSelectedImage]=useState<string | null>(null)
    const [zoderror,setZodError]=useState<Record<string,string>>({})
    const [selectedAddress, setSelectedAddress] = useState<number>(0);
    const [name,setName]=useState("")
    const [passwords,setPasswords]=useState({})
  
     
  
    const [addresses, setAddresses] = useState<addressForm[]>([]);
    const [editAddress,setEditAddress]=useState<addressForm|null>(null)

    useEffect(()=>{
      const savedAddress=localStorage.getItem('selectedAddress')
      if (savedAddress !== null) {
        setSelectedAddress(parseInt(savedAddress, 10)); 
      }
    },[])
  useEffect(()=>{
    const fetchUser=async()=>{
      const user= await fetchUserData(id as string)
      if(user){
        setCurrentUser(user)
      }
      const response= await getProfileImage(user.avatarUrl)
      if(JSON.stringify(response.data.url)!=='{}'){
        setSelectedImage(response.data.url)
      }
      const address=await fetchAddress(id as string)
      setAddresses(address)
    }
    fetchUser()
  },[id,currentUser?.avatarUrl])

  const handleAddress=async(e:React.FormEvent)=>{
    e.preventDefault()
    const addressToSubmit=editAddress || singleAddress
    console.log("address submitted",addressToSubmit)
    const result=zodAddressSchema.safeParse(addressToSubmit)
    if(!result.success){
      const fieldErrors:Record<string,string>={}
      result.error.errors.forEach((err)=>{
        
        if(err.path){
          fieldErrors[err.path[0]]=err.message
        }
      })
      setZodError(fieldErrors)
      return
    }
    setZodError({})
    if(editAddress){
      console.log(editAddress._id)
      const res = await updateAddress(currentUser?.email as string, result.data,editAddress._id as string);
      if (res.status) {
        toast.success(res.message);
        setEditAddress(null);
        setShowAddressForm(false);
        // Refresh addresses
        const address = await fetchAddress(id as string);
        setAddresses(address);
      } else {
        toast.error(res.message);
      }
    }else{
      const res=await addAddress(currentUser?.email as string,result.data)
      if(res.status){
        toast.success(res.message)
        setSingleAddress({phone:'' ,
          street: "",
          city: "",
          state: "",
          country: "",
          zip: ""})
        setShowAddressForm(false);

        console.log("address submited :",res?.address) 
        setAddresses((prev)=>[...prev,res?.address]); 
      }else{
       toast.error(res.message)
      }
    } 
  }
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {value, name}=e.target

   if (editAddress) {
    setEditAddress(prev => ({
      ...prev!,
      [name]: value
    }))
  } else {
    setSingleAddress(prev => ({
      ...prev,
      [name]: value
    }));
  }
  }

  const handleAddressDelete=async (e:React.MouseEvent<HTMLButtonElement>,addressId ?:string)=>{
    e.preventDefault()
    console.log('button clicked')
    console.log(addressId)
    const res=await deleteAddress({userId:id as string,addressId:addressId as string})
    if(res.message){
     const UpdatedAddress= addresses.filter((value)=>value._id!==addressId)
     setAddresses(UpdatedAddress)
    }
    toast.success(res.message)
 
  }
  const handleEditAddress=async (e:React.MouseEvent<HTMLButtonElement>,addressId ?:string)=>{
    e.preventDefault()
    console.log('Edit button clicked')
    const editAddress= addresses.find(addr=>addr._id===addressId)
    if(editAddress)setEditAddress(editAddress)
    setShowAddressForm(true)
  }



  const handleSelect=(index: number)=>{
    setSelectedAddress(index)
    localStorage.setItem('selectedAddress',String(index))
  }

  const handleName=async(e:React.FormEvent)=>{
    e.preventDefault()

    console.log("name setting event is working",name)
    console.log(name,id)
    const res=await updateName({userId:id as string,name})
    toast.success(res.message)
  }
  const handleChangePassword=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {value, name}=e.target
    setPasswords(prev=>({
      ...prev,
      [name]:value
    }))
   
  }
  const handleNewPassword=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    console.log(passwords)
    const res=await updatePassword(currentUser?.email as string,passwords as {oldpassword:string,newpassword:string})
    if(res.status){
      toast.success(res.message)
    }else{
      toast.error(res.message)
    }
  }

  if(showFileUploadForm){
    return(
      <div className="h-screen flex items-center justify-center text-white  bg-cover bg-center -z-10"  style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 -z-1  bg-black/50 bg-opacity-70"></div>
        <ImageUpload/>
      </div>
    )
  }
  const deleteProfileImage=async()=>{
    if(id && currentUser?.avatarUrl ){
      const response=await deleteImageFromServer(id as string,currentUser?.avatarUrl as string)
      if(response?.data?.status){
        setCurrentUser(prevUser => ({
          ...prevUser!,
          avatarUrl: null
        }));
        setSelectedImage(null)

      }
    }
    
  }
  


  if(showAddressForm){
    return(

        <div className="h-screen flex items-center justify-center text-white  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>

        <div className="absolute inset-0  bg-black/50"></div>
        <div className="bg-black/80 bg-opacity-70 rounded-lg p-12 space-y-4 z-50 max-w-[50%]">
        <h1>Add New Address</h1>
             
              
              <form onSubmit={handleAddress} className="space-y-4">
              {zoderror?<span className="text-red-700">{zoderror.phone}</span>:""}
                <input 
                  type="number" 
                  name="phone"
                  placeholder="Phone"
                  value={editAddress && editAddress.phone !== undefined ? editAddress.phone : singleAddress.phone ?? ""}
                  className="w-full bg-black-800 border border-white-500 text-white px-3 py-2 rounded"
                  onChange={handleChange}

                />
                
                {zoderror?<span className="text-red-700">{zoderror.street}</span>:""}
                <input 
                  type="text" 
                  name='street'
                  placeholder="Street Address"
                  onChange={handleChange}
                  value={editAddress && editAddress.street !== undefined ? editAddress.street :singleAddress.street ?? ""}
                  className="w-full bg-black-800 border border-white-700 text-white px-3 py-2 rounded"
                />
                
                {zoderror?<span className="text-red-700">{zoderror.city}</span>:""}
                <input 
                  type="text" 
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  value={editAddress && editAddress.city !== undefined ? editAddress.city :singleAddress.city ?? ""}
                  className="w-full bg-black-800 border border-white-700 text-white px-3 py-2 rounded"
                />
              
              {zoderror?<span className="text-red-700">{zoderror.state}</span>:""}
                <input 
                  type="text" 
                  placeholder="State"
                  name="state"
                  onChange={handleChange}
                  value={editAddress && editAddress.state !== undefined ? editAddress.state :singleAddress.state?? ""}
                  className="w-full bg-black-800 border border-white-700 text-white px-3 py-2 rounded"
                />
                 
                 {zoderror?<span className="text-red-700">{zoderror.country}</span>:""}
                <input 
                  type="text" 
                  placeholder="Country"
                  name="country"
                  onChange={handleChange}
                  value={editAddress && editAddress.country !== undefined ? editAddress.country :singleAddress.country?? ""}
                  className="w-full bg-black-800 border border-white-700 text-white px-3 py-2 rounded"
                />
                
                {zoderror?<span className="text-red-700">{zoderror.zip}</span>:""}
                <input 
                  type="number" 
                  placeholder="Zip Code"
                  name="zip"
                  onChange={handleChange}
                  value={editAddress && editAddress.zip !== undefined ? editAddress.zip :singleAddress.zip ?? ""}
                  className="w-full bg-black-800 border border-white-700 text-white px-3 py-2 rounded"
                />
                 
              <div className="flex justify-end space-x-2 mt-6">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm ">
                  Create New Address
                </button>
              </div>
              </form>
              
            </div>
            </div>

    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center text-white  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>

    <div className="absolute inset-0  bg-black/50"></div>
    <div className='min-h-screen bg-black test-white'>
        <SecondNavbar/>
    </div> 
    <div className="m-5 flex flex-col sm:flex-row gap-4 relative top-12 z-10 w-full max-w-7xl">
        {/* div1 - 40% Width */}
        <div className="bg-black/60 border-white border-1 flex-[0.4] p-5  w-full  sm:w-2/5 min-h-[35vh] sm:h-[50vh]  lg:h-[80vh]">
        <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              {selectedImage ?( <img 
                src={selectedImage} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />):( <img 
                src={useravatar} 
                alt="User avatar" 
                className="w-full h-full object-cover"
              />)}
             
            </div>
            <span className="block text-center mt-2 text-lg font-medium">{currentUser?.name}</span>
            <br/>
            <div className="flex justify-center gap-2 mt-2">
            <button onClick={()=>setShowFileUploadForm(true)} className="border-blue-600 border-1 text-white px-3 py-1 text-xs rounded">
              Edit
            </button>
            {selectedImage && ( <button onClick={deleteProfileImage} className="border-red-600 border-1 text-white px-3 py-1 text-xs rounded">
              delete
            </button>)}
           
            </div>
           
        
          </div>
          <div/>


          
       
       
        
        </div>


<br />

        <h2 className="text-lg font-medium mb-4">User info</h2>
            
            <form onSubmit={(e)=>handleName(e)} className="space-y-3">
              <div className="flex">
                <span className="w-28">User name :</span>
                {/* <span className="font-medium">{currentUser.name}</span> */}
                <input 
                type="Name" 
                defaultValue={currentUser?.name }
                onChange={(e)=>{setName(e.target.value)}}
                className="w-5/10 border border-blue-800 text-white px-3 py-2 rounded text-sm"
              />
              </div>
              
              <div className="flex">
                <span className="w-28">User E-mail :</span>
                <span>{currentUser?.email}</span>
              </div>
              
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm rounded mt-4 w-2/8">
                Save Updates
              </button>
            </form>



            <br />
            <h2 className="text-lg font-medium mb-4">Password management</h2>
            
            <form onSubmit={handleNewPassword} className="space-y-3">
              <input 
                type="password" 
                name="oldpassword"
                placeholder="Type your old password..."
                className="w-4/10 border border-blue-800 text-white px-3 py-2 rounded text-sm mr-2"
                onChange={handleChangePassword}
              />
              
              <input 
                type="password" 
                name="newpassword"
                placeholder="Type your new password..."
                className="w-4/10 border border-blue-800 text-white px-3 py-2 rounded text-sm"
              
                onChange={handleChangePassword}
              />
              <br />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm  w-3/10">
                Reset Password
              </button>
            </form>
          
        </div>






        
            

        {/* div2 - 60% Width */}


        <div className="bg-black/60 border-white border-1 flex-[0.6] p-5 w-full sm:w-3/5 min-h-[35vh] sm:h-[50vh] lg:h-[80vh]">
          <button 
              className="bg-blue-600 text-white px-4 py-2 text-sm rounded float-end "
              onClick={() => setShowAddressForm(true)}
            >
              Add Address
            </button>
          <h3>Address Book</h3>

          {addresses.length === 0 ? (
            <p className="text-gray-300">No addresses found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-6 mt-5">
              {addresses.map((address, index) => (
                <div key={index} className="bg-black/70 p-4 border border-white space-y-2">
            <div className="float-end mb-4">
                <input type="radio"  id={`address-${index}`} checked={selectedAddress === index} className="mr-2"  onChange={() => handleSelect(index)}/>
                <label htmlFor={`address-${index}`}></label>
            </div>
                  <p><strong>Phone:</strong> {address.phone}</p>
                  <p><strong>Street:</strong> {address.street}</p>
                  <p><strong>City:</strong> {address.city}</p>
                  <p><strong>State:</strong> {address.state}</p>
                  <p><strong>Country:</strong> {address.country}</p>
                  <p className="inline"><strong>Zip Code:</strong> {address.zip}</p>

                  <button onClick={(e)=>{handleEditAddress(e,address._id)}}  className="border-blue-600 border-1  text-white px-2 py-1 text-sm rounded float-end mx-2 cursor-pointer">Edit</button>
                  <button onClick={(e)=>{handleAddressDelete(e,address._id)}} className="border-red-600 border-1 text-white px-2 py-1 text-sm rounded float-end cursor-pointer">delete</button>
                </div>

                
              ))}
            </div>
          )}

         


          


        </div>
      </div>



    
            
    </div>
    
  )
}

export default EditUserProfile
