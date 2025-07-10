import SecondNavbar from "../../components/common/Navbar2/SecondNavbar"
import useravatar from '../../assets/useravatar.jpg'
import bg from '../../../src/assets/abstract-background.jpg';
import React, { useEffect, useState } from "react";
import { deleteImageFromServer, fetchUserData, getProfileImage, updateName, updatePassword } from "../../services/authServices";
import { useAppSelector } from "../../hooks/AuthHook";
import { toast } from "react-fox-toast";
import ImageUpload from "../../components/layout/UserProfile/ImageUpload";
import LocationPicker from "../../components/common/Location/LocationPicker";



const EditUserProfile = () => {
  const [showFileUploadForm, setShowFileUploadForm] = useState(false);
  const id = useAppSelector((state) => state.authUser?.user?.id)
  const [currentUser, setCurrentUser] = useState<{ name: string, email: string; avatarUrl: string | null, role: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [passwords, setPasswords] = useState({})
  useEffect(() => {
    const fetchUser = async () => {

      const user = await fetchUserData(id as string)
      console.log('user in fetch user',user)
      if (user) {
        setCurrentUser(user)
        const response = await getProfileImage(user.avatarUrl)
        if (JSON.stringify(response.data.url) !== '{}') {
          setSelectedImage(response.data.url)
        }
      }
    }
    fetchUser()
  }, [id, currentUser?.avatarUrl])

  











  const handleName = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("name setting event is working", name)
    console.log(name, id)
    const res = await updateName({ userId: id as string, name })
    toast.success(res.message)
  }
  const handleChangePassword = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }))

  }
  const handleNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(passwords)
    const res = await updatePassword(currentUser?.email as string, passwords as { oldpassword: string, newpassword: string })
    if (res.status) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }



  if (showFileUploadForm) {
    return (
      <div className="h-screen flex items-center justify-center text-white  bg-cover bg-center -z-10" style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 -z-1  bg-black/50 bg-opacity-70"></div>
        <ImageUpload />
      </div>
    )
  }
  const deleteProfileImage = async () => {
    if (id && currentUser?.avatarUrl) {
      const response = await deleteImageFromServer(id as string, currentUser?.avatarUrl as string)
      if (response?.data?.status) {
        setCurrentUser(prevUser => ({
          ...prevUser!,
          avatarUrl: null
        }));
        setSelectedImage(null)

      }
    }

  }


  return (
    <div className="min-h-screen flex items-center justify-center text-white  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>

      <div className="absolute inset-0  bg-black/50"></div>
      <div className='min-h-screen bg-black test-white'>
        <SecondNavbar />
      </div>
      <div className="m-5 flex flex-col sm:flex-row gap-4 relative top-12 z-10 w-full max-w-7xl">

        <div className="bg-black/60 border-white border-1 flex-[0.4] p-5  w-full  sm:w-2/5 min-h-[35vh] sm:h-[50vh]  lg:h-[80vh]">
          <div className="flex flex-col items-center space-y-4 w-full md:w-1/3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
                {selectedImage ? (<img
                  src={selectedImage}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />) : (<img
                  src={useravatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />)}

              </div>
              <span className="block text-center mt-2 text-lg font-medium">{currentUser?.name}</span>

              <div className="flex justify-center gap-2 mt-2">
                <button onClick={() => setShowFileUploadForm(true)} className="border-blue-600 border-1 text-white px-3 py-1 text-xs rounded">
                  Edit
                </button>
                {selectedImage && (<button onClick={deleteProfileImage} className="border-red-600 border-1 text-white px-3 py-1 text-xs rounded">
                  delete
                </button>)}

              </div>


            </div>
            <div />






          </div>


          <br />



          <form onSubmit={(e) => handleName(e)} className="space-y-1">
            <div className="flex">
              <span className="w-28">User name :</span>
              {/* <span className="font-medium">{currentUser.name}</span> */}
              <input
                type="Name"
                defaultValue={currentUser?.name}
                onChange={(e) => { setName(e.target.value) }}
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


          <h2 className="text-lg font-medium my-4">Password management</h2>

          <form onSubmit={handleNewPassword} className="space-y-3">
            <input
              type="password"
              name="oldpassword"
              placeholder="Type your old password..."
              className=" border border-blue-800 text-white px-3 py-2 rounded text-sm mr-2"
              onChange={handleChangePassword}
            />

            <input
              type="password"
              name="newpassword"
              placeholder="Type your new password..."
              className=" border border-blue-800 text-white px-3 py-2 rounded text-sm mx-2"

              onChange={handleChangePassword}
            />

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm  w-3/10">
              Reset Password
            </button>
          </form>






        </div>
        <div className="bg-black/60 border-white border-1 flex-[0.6] p-5 w-full sm:w-3/5 min-h-[35vh] sm:h-[50vh] lg:h-[80vh]">




          <h2 className="text-lg font-medium mb-4">Location management</h2>
          <LocationPicker />

        </div>

      </div>





    </div>

  )
}

export default EditUserProfile
