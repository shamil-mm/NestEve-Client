
import  { useEffect, useState } from 'react';
import { useAppSelector,useAppDispatch } from '../../hooks/AuthHook';
import { IChatOrganizer } from '../../interfaces/chat/chatOrganizer';
import { createConversation, getAllChats, getSingleChat } from '../../services/chatService';
import { clearSelectedOrganizer } from '../../store/slices/chat';
import { formateConversations } from '../../utils/formateConversation';
import { IConversation, showChat } from '../../interfaces/chat/Iconversation';
import ChatMainComponent from '../../components/layout/ChatLayouts/ChatMainComponent';
import socket from '../../utils/socket';
const Chatpage = () => {
  const [chatOrganizer,setChatOrganizer]=useState<IChatOrganizer|null>(null)
  const organizer =useAppSelector((state)=>state.chat.selectedOrganizer)
  const userId =useAppSelector((state)=>state.authUser.user?.id)
  const dispatch=useAppDispatch()
  const [chats,setChatlist]=useState<showChat[]>([])
  const [singleChat,setSingleChat]=useState<IConversation|null>(null)
  
  useEffect(()=>{
    if(organizer){
      setChatOrganizer(organizer)
      dispatch(clearSelectedOrganizer())
    }
  },[organizer])
  useEffect(()=>{

  })

  useEffect(() => {
  const handleUpdateConversation = (data: {
    conversationId: string;
    lastMessage: string;
    lastMessageTime: string;
  }) => {
    console.log('checking prev message issue',data)
    setChatlist(prev =>
      prev.map(chat =>
        chat.id === data.conversationId
          ? {
              ...chat,
              lastMessage: data.lastMessage,
              lastMessageTime: new Date(data.lastMessageTime).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              }),
            }
          : chat
      )
    );
  };

  socket.on("updateConversation", handleUpdateConversation);

  return () => {
    socket.off("updateConversation", handleUpdateConversation);
  };
}, []);




  useEffect(()=>{
    const CreateConversation=async()=>{
      if(chatOrganizer?._id && userId){
        await createConversation(chatOrganizer?._id as string,userId) 
        const res=await getAllChats(userId as string)
        if(res.data){
          const fmConversation= await formateConversations(res.data,userId)
          setChatlist(fmConversation as showChat[]) 
        }
      }
    }
    CreateConversation()
  },[chatOrganizer?._id, userId])

  useEffect(()=>{
    const GetChats=async()=>{
      if(userId){
        const res=await getAllChats(userId as string)
        
        if(res.data){
          const fmConversation= await formateConversations(res.data,userId)
          setChatlist(fmConversation as showChat[]) 
        }
      }
    }
    GetChats()
  },[userId])
  useEffect(()=>{
  },[chats])

  useEffect(()=>{
    if(singleChat?._id){
      socket.emit('joinRoom',singleChat?._id)
      console.log('join room from chat page :',singleChat._id)
    }
  },[singleChat])

  const handleSingleMessage=async(e:React.MouseEvent<HTMLDivElement>,conversationId:string)=>{
    
    e.preventDefault()
    
    if(conversationId){
      const res=await getSingleChat(conversationId as string)
      setSingleChat(res.data as IConversation)
    }
  }

  

  return (
    <div className="w-full h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-80 bg-black border-r border-gray-700" >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-white text-xl font-medium">chats</h1>
        </div>
        
        {/* Chat List */}
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <div key={chat.id} onClick={(e)=>handleSingleMessage(e,chat.id)} className="p-4 hover:bg-black cursor-pointer border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium truncate">{chat.name}</h3>
                    <span className="text-gray-400 text-xs">{chat.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-400 text-sm truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChatMainComponent singleChat={singleChat as IConversation}/> 
    </div>
  );
}

export default Chatpage
