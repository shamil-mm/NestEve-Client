import { client } from "./client";

export const createConversation=async(organizerId:string,userId:string)=>{
    try {
       
         const response = await client.post('/communication/api/communication',{organizerId,userId})
         return response.data
    } catch (error) {
         console.error("conversation creation failed from service.ts", error);
    }
}
export const getAllChats=async(userId:string)=>{
    try {
       
         const response = await client.get(`/communication/api/all-communication/${userId}`)
         return response.data
    } catch (error) {
         console.error("get all chats failed from service.ts", error);
    }
}
export const getSingleChat=async(conversationId:string)=>{
    try {
       
         const response = await client.get(`/communication/api/single-communication/${conversationId}`)
         
         return response.data
    } catch (error) {
         console.error("get single chat failed from service.ts", error);
    }
}
export const Message=async(conversationId:string,message:string,userId:string)=>{
    try {
       
         const response = await client.post(`/communication/api/chat`,{conversationId,message,userId})
         console.log(response)
         
         return response.data
    } catch (error) {
         console.error("message form chat failed from service.ts", error);
    }
}
export const fetchChats=async(conversationId:string)=>{
    try {
       console.log("fetchChats is working")
         const response = await client.get(`/communication/api/chats/${conversationId}`)
         
         return response.data
    } catch (error) {
         console.error("fetch chats failed from service.ts", error);
    }
}