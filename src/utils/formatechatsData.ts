
import { IMessage } from "../interfaces/chat/Imessages";
import {v4 as uuid} from 'uuid'
export const formateChat=async(rawMessages:IMessage[] ,currentUserId:string)=>{
        
   
    return rawMessages.map((msg)=>{
        const senderId=typeof msg.sender === 'string' ? msg.sender : msg.sender._id
       return   { 
        id:uuid(),
        message:msg.message,
        sender:senderId===currentUserId ?"me":"other",
        time: new Date(msg.createdAt).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })}

    })
}
