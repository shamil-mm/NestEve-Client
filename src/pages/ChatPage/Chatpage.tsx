
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

  },[])

  useEffect(() => {
    if(!userId) return;
  const handleUpdateConversation = (data: {
    conversationId: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCounts:{ userId:string , count:number }[]
  }) => {
    
    setChatlist(prev =>
      prev.map(chat =>
        chat.id === data.conversationId
          ? {
              ...chat,
              lastMessage: data.lastMessage,
              lastMessageTime: new Date(data.lastMessageTime).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              }),
              unread:data.unreadCounts.find(entry => entry.userId === userId)?.count || 0,
            }
          : chat
      )
    );
  };

  socket.on("updateConversation", handleUpdateConversation);

  return () => {
    socket.off("updateConversation", handleUpdateConversation);
  };
}, [userId]);






  useEffect(()=>{
    
    const CreateConversation=async()=>{
       console.log("conversation creating useEffect is woking inside the function",chatOrganizer ,'  ',userId)
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
  },[chatOrganizer, userId])

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


  useEffect(() => {
  if (chats.length > 0) {
    chats.forEach(chat => {
      socket.emit('joinRoom', chat.id);
    });
  }
}, [chats])

  useEffect(()=>{
    if(singleChat?._id){
      socket.emit('joinRoom',singleChat?._id)
      console.log('join room from chat page :',singleChat._id)
    }
  },[singleChat])

  const handleSingleMessage=async(e:React.MouseEvent<HTMLDivElement>,conversationId:string)=>{
    
    e.preventDefault()
    if (!conversationId || !userId) return;
    socket.emit('markMessagesAsRead', { conversationId, userId });
    setChatlist(prev =>
    prev.map(chat =>
      chat.id === conversationId
        ? { ...chat, unread: 0 }
        : chat
    )
  );

      const res=await getSingleChat(conversationId as string)
      setSingleChat(res.data as IConversation)
    
  }

  

  return (
    <div className="w-full h-screen bg-black flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-full sm:w-64 md:w-72 lg:w-80 bg-black border-r border-gray-700 flex flex-col" >
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-gray-700 flex-shrink-0">
          <h1 className="text-white text-lg sm:text-xl font-medium">chats</h1>
        </div>
        
        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div key={chat.id} onClick={(e)=>handleSingleMessage(e,chat.id)} className="p-3 sm:p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-700/50 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-white font-medium truncate text-sm sm:text-base">{chat.name}</h3>
                    <span className="text-gray-400 text-xs flex-shrink-0">{chat.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p className="text-gray-400 text-xs sm:text-sm truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[18px] sm:min-w-[20px] text-center flex-shrink-0">
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
