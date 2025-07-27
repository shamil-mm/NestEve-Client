import { useEffect, useState } from "react"
import { QRCodeScanner } from "../../common/QrCode/QrCodeReader"
import { useAppSelector } from "../../../hooks/AuthHook"
import { getBookingByBookingId } from "../../../services/bookingService"
import { toast } from "react-fox-toast"
import scansuccess from '../../../assets/lotties/scansuccess.json'
 
import Lottie from "lottie-react"

const OrganizerScanQRcode = () => {

     const [bookingId,setBookingId]=useState<string|null>(null)
         const userId = useAppSelector((state) => state.authUser?.user?.id)
         const [verified,setVerified]=useState<boolean>(false)

         useEffect( ()=>{
            const GetBookingByBookingId=async()=>{
                
               if(bookingId) {
                const res=await getBookingByBookingId(bookingId as string,userId  as string)
                console.log(res)
                if(res?.data?.status===true){
                  toast.success(res?.data.message)
                  setVerified(true)
                }else{
                      toast.error( res?.data.message)
                      setBookingId(null)
                }
                
            }
            }
            GetBookingByBookingId()
     
         },[userId,bookingId])


     const getDecodedId=(data:string)=>{
        console.log('data from parant',data)
        setBookingId(data)
     }

    

if (bookingId && verified) {
  return (
    <div className="min-h-150 mt-2 bg-black/70 text-white rounded-md p-6 flex flex-col items-center justify-center space-y-6">
  <div className="w-full max-w-md">
    <Lottie 
      animationData={scansuccess} 
      loop={true} 
      className="w-full h-64"
    />
  </div>

  <span className="text-lg font-semibold text-center">
    This booking is verified by the organizer
  </span>

  <button
    onClick={() => setBookingId(null)}
    className="px-6 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition duration-200"
  >
    Back to Scanner
  </button>
</div>

  );
}
  return (
   <div className="min-h-150 mt-2 bg-black/70 text-white">
             <div className="flex items-center  justify-center h-full">
               <QRCodeScanner getDecodecId={getDecodedId}/>
             </div>
         </div>
  )
}

export default OrganizerScanQRcode
