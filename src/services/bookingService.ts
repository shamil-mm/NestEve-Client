import { ITicket } from "../components/ui/Checkout/NonseatedCheckout";
import { IEvent } from "../interfaces/IEvent";
import { client } from "./client";

export const stripeCheckout = async (event:Partial<IEvent>,tickets:ITicket[],userId: string)=>{
    try {
        
        const response= await client.post('/booking/api/stripe-checkout-session',{event,tickets,userId})
        console.log(response)
        return  response
    } catch (error) {
        console.log('error in stripe checkout session ',error)
    }
}

export const getUserBookings= async(id:string)=>{
    try {
        const response=await client.get(`/booking/api/get-user-booking/${id}`)
       return response
        
    } catch (error) {
        console.log('error getting on getuser booking service' )
    }
}
export const fetchBookedSeats=async(id:string)=>{
    try {
        const response=await client.get(`/booking/api/fetch-booked-seats/${id}`)
        return response  
        
    } catch (error) {
        console.log('error getting on fetchBookedSeats booking service' )
    }
}
export const cancelbooking=async(data:{userId:string,bookingId:string})=>{
    try {
        const response=await client.post(`/booking/api/cancel-booking`,data)
        return response  
        
    } catch (error) {
        console.log('error getting on cance booking in service' )
    }
}

export const getwallet= async(id:string)=>{
    try {
       const response=await client.get(`/booking/api/wallet/get-wallet/${id}`)
       return response
        
    } catch (error) {
        console.log('error getting on getuser booking service' )
    }
}
export const getBookingsByEventIds=async(ids:string[],queryParams:{
    search?:string;
    sortBy?:string;
    filterBy:string;
    page?:number;
    limit?:number
})=>{
    try {
        console.log('getBookingsByEventIds')
        const requestBody={
            eventIds:ids,
            search:queryParams.search || '',
            sortBy:queryParams.sortBy || '',
            filterBy:queryParams.filterBy || '',
            page:queryParams.page || 1,
            limit:queryParams.limit 
        }
      
      
        const response=await client.post(`/booking/api/get-booking-by-eventIds`,requestBody)
        console.log('response from booking service',response)
       return response
    } catch (error) {
        console.log('error getting on getBookingsByEventIds booking service' )
    }
}
export const fetchBooking=async(token:string)=>{
    try {
        console.log('token',token)
        const response=await client.get(`/booking/api/get-booking-by-token/${token}`)
       console.log('fetchBooking',response) 
       return response
    } catch (error) {
        console.log('error getting on fetchBooking booking service' )
    }
}

export const getBookingByBookingId=async(bookingId:string,organizerId:string)=>{
     try {
       
        const response=await client.get(`/booking/api/get-booking-by-bookingId`,{
            params:{
                bookingId,
                organizerId
            }
        })
       
       return response
    } catch (error :any) {
       
        console.log('error getting on getBookingByBookingId booking service' )
    }

}
export const fetchPaymentAndTransaction =async (searchTerm:string, sortField:string, sortDirection:string, filterBy:string, page:number, limit:number)=>{
    try {
         const response=await client.get(`/booking/api/admin-fetch-payment-and-transaction`,{
             params: {
                        search: searchTerm,
                        sortField,
                        sortDirection,
                        filterBy,
                        page,
                        limit,
                    },
         })
       
       return response
        
    } catch (error) {
         console.log('error getting on fetchPaymentAndTransaction booking service',error )
    }
}
export const checkReviewEligibility =async (userId:string,eventId:string)=>{
  try {
        const response=await client.get(`/booking/api/review-eligibility`,{
            params:{
                userId,
                eventId
            }
        })
        return response.data
    } catch (error) {
        console.log('checkReviewEligibility failed',error)
    }
}