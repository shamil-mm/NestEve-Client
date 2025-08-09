import {io} from 'socket.io-client'

const socket =io(import.meta.env.VITE_COMMUNICATION_URL,{
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