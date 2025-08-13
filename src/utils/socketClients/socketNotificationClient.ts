import {io} from 'socket.io-client'



const notificationSocket=io(import.meta.env.VITE_NOTIFICATION_URL,{
    path: "/notification/socket.io",
    transports:['websocket'],
    withCredentials:true,
    autoConnect:true,
    reconnection:true,
    reconnectionDelay:1000,
    reconnectionAttempts:5,
    timeout:20000
})

notificationSocket.on('connect',()=>{
    console.log("Notificaion socket connected successfully :" ,notificationSocket.id)
})
notificationSocket.on("connect_error",(error)=>{
    console.error("Notification socket connection failed",error)
})
notificationSocket.on("disconnect",(reason)=>{
    console.warn("Notification socket disconnected :",reason)
    if(reason==="io server disconnect"){
        notificationSocket.connect()
    }
})

export default notificationSocket