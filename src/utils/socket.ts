import {io} from 'socket.io-client'

const apigateway=`${import.meta.env.VITE_API_BASE_URL}/communication`
const socket =io(apigateway,{
     transports: ["websocket"],
     withCredentials:true,
     autoConnect:true,
     reconnection:true,
     reconnectionDelay:1000,
     reconnectionAttempts:5,
     timeout:20000
})
socket.on('connect',()=>{
    console.log('Socket connected successfully:', socket.id);
})
socket.on("connect_error",(error)=>{
    console.error(' Socket connection failed:', error);
})
socket.on('disconnect', (reason) => {
  console.warn(' Socket disconnected:', reason);
  if (reason === 'io server disconnect') {
    socket.connect();
  }
})
export default socket