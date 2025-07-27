import { client } from "./client";


export const fetchNotification=async(userId:string,page?:number,limit?:number)=>{
    try {
        const res= await client.get(`/notification/api/notification/${userId}`,{
            params:{
                page,limit
            }
        })
        console.log('from fetch notification',res.data)
        return res.data        
    } catch (error) {
        console.log("fetch Notification error",error)
    }

}
export const markAsReadNotification=async(notificationId:string)=>{
    try {
        const res= await client.patch(`/notification/api/mark-as-read/${notificationId}`)
        return res.data        
    } catch (error) {
        console.log("fetch Notification error",error)
    }

}
export const deleteNotification=async(notificationId:string)=>{
    try {
        const res= await client.delete(`/notification/api/notification/${notificationId}`)
        return res.data        
    } catch (error) {
        console.log("remove Notification error",error)
    }

}
