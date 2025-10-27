import { useEffect, useRef, useState } from 'react';
import hero from '../../../assets/abstract-background.jpg'
import { Phone, Video, MoreVertical, Paperclip, Send, Trash, ArrowLeft } from 'lucide-react';
import { IConversation } from '../../../interfaces/chat/Iconversation';
import { useAppSelector } from '../../../hooks/AuthHook';
import { getOpponent } from '../../../utils/formateConversation';
import { fetchChats, getMediaUrl, uploadWithPresignedUrl } from '../../../services/chatService';
import socket from '../../../utils/socket';
import { formateChat } from '../../../utils/formatechatsData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-fox-toast';
import AttachmentModal from '../Modal/AttachmentModal';


interface ChatMainComponentProps {
  singleChat: IConversation;
  onBack?: () => void;
  showBackButton?: boolean;
}
export interface msg {
  _id?: string;
  message: string | undefined;
  sender: "me" | "other";
  mediaType?: "image" | "video" | "file";
  mediaUrl?: string | null;
  time: string;
  replyTo?: {
    _id?: string;
    message: string;
    mediaType?: "image" | "video" | "file";
    sender: "me" | "other";
    mediaUrl?: string | null;
  };
};


const ChatMainComponent: React.FC<ChatMainComponentProps> = ({ singleChat, onBack, showBackButton = false }) => {


  const [message, setMessage] = useState('');
  const userId = useAppSelector((state) => state.authUser.user?.id)
  const user = useAppSelector((state) => state.authUser.user)
  const [chatData, setChatData] = useState<IConversation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  let typingTimeout: ReturnType<typeof setTimeout>
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [outgoingCall, setOutgoingCall] = useState<{ name: string; callType: 'video' | 'audio' } | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<msg | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteSelected, setDeleteSelected] = useState<{id:string}|null>(null);



  const navigate = useNavigate()

  type IncomingCall = {
    fromUser: { id: string, name: string };
    roomId: string;
    callType: 'video' | 'audio';
  };



  useEffect(() => {
    socket.on('incomingCall', ({ fromUser, roomId, callType }) => {
      setIncomingCall({ fromUser, roomId, callType })
    })
    return () => {
      socket.off('incomingCall')
    }
  }, [])
  useEffect(() => {
    socket.on('callAccepted', ({ roomId, callType }) => {
      navigate(`/${callType}-call?roomID=${roomId}`);
    });

    socket.on('callRejected', () => {
      toast.info('Call was rejected');
      setOutgoingCall(null)
    });

    return () => {
      socket.off('callAccepted');
      socket.off('callRejected');
    };
  }, []);



  const [messages, setMessages] = useState<msg[]>([])

  useEffect(() => {
    if (userId && socket.connected) {
      socket.emit('userOnline', userId)
    }
  }, [socket, userId])

  useEffect(() => {
    socket.on('updateOnlineUsers', (userId: string[]) => {
      setOnlineUsers(userId)
    })
    return () => {
      socket.off('updateOnlineUsers')
    }
  }, [])

  useEffect(() => {
    setTimeout(scrolltoBottom, 100)
  }, [messages]);



  useEffect(() => {
    async function fetchChatData() {
      if (singleChat) {
        const res = await getOpponent(singleChat, userId as string)
        setChatData(res)
      }
    }
    fetchChatData()
  }, [singleChat, userId])




  useEffect(() => {
    async function FetchChats() {

      if (singleChat) {
        const res = await fetchChats(singleChat._id as string)
        const formatedData = await formateChat(res.data, userId as string)


        if (formatedData) {
          setMessages(formatedData)
          setTimeout(scrolltoBottom, 100)
        }
      }
    }
    FetchChats()
  }, [singleChat])


  useEffect(() => {
    const handleRecieveMessage = async (message: any) => {
      console.log('received :', message)
      if (message.mediaUrl && message.mediaType) {
        try {

          const signedUrl = await getMediaUrl(message.mediaUrl)
          console.log('signedUrl', signedUrl)
          if (signedUrl) {
            message.mediaUrl = signedUrl
          }
        } catch (error) {
          console.error("Error fetching signed URL", error);
        }
      }

      const formatted = await formateChat([message], userId as string)
      if (formatted && formatted.length > 0) {
        setMessages((prev) => [...prev, ...formatted])
      }
    }
    socket.on('receiveMessage', handleRecieveMessage)
    return () => {
      socket.off('receiveMessage', handleRecieveMessage)
    }
  }, [userId])





  useEffect(() => {
    socket.on('showTyping', (senderId: string) => {

      setTimeout(scrolltoBottom, 100)
      setTypingUser(senderId)
    })
    socket.on('hideTyping', (senderId: string) => {

      setTypingUser((prev) => (prev === senderId ? null : prev))
    })

    return () => {
      socket.off('showTyping')
      socket.off('hideTyping')
    }
  }, [])


  const handleAttach = async (files: File[]): Promise<void> => {
    const file = files[0]
    if (!file) return
    try {
      const fileUrl = await uploadWithPresignedUrl(file)

      console.log('responseUrls', fileUrl)
      const messageData = {
        conversationId: singleChat._id,
        sender: userId,
        mediaUrl: fileUrl,
        mediaType: 'image',
        replayTo: selectedMessage?._id || undefined
      }
      setSelectedMessage(null)
      socket.emit('sentMessage', messageData)




    } catch (error) {
      console.error("Image message failed", error);
    } finally {
      setIsModalOpen(false);
    }
  };


  const setMessageHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!message.trim()) {
      return;
    }

    if (!singleChat?._id) {
      alert('No conversation selected');
      return;
    }
    const messageData = {
      conversationId: singleChat._id,
      message: message,
      sender: userId,
      replayTo: selectedMessage?._id || undefined
    };
    setSelectedMessage(null)

    socket.emit('sentMessage', messageData)
    // const res= await Message(singleChat._id,message,userId as string) 
    setMessage('')
  }




  const scrolltoBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    if (!isTyping) {
      socket.emit('typing', singleChat._id, userId)
      setIsTyping(true)
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit('stopTyping', singleChat._id, userId)
      setIsTyping(false)
    }, 1500)
  }






  const handleCall = (type: 'video' | 'audio') => {
    let receiverId = chatData?.participants[0]._id
    if (!socket || !singleChat || !user || !receiverId) return;
    socket.emit('callUser', {
      fromUser: { id: user.id, name: user.name },
      toUserId: receiverId,
      roomId: singleChat._id,
      callType: type
    })
    setOutgoingCall({ name: (chatData?.participants[0].name as string), callType: type })
  }

  const acceptCall = ({ fromUser, roomId, callType }: IncomingCall) => {
    socket.emit('callAccepted', { toUserId: fromUser.id, roomId, callType });
    navigate(`/${callType}-call?roomID=${roomId}`);
    setIncomingCall(null);
  }
  const rejectCall = ({ fromUser }: Pick<IncomingCall, "fromUser">) => {
    socket.emit("callRejected", { toUserId: fromUser.id });
    setIncomingCall(null);
  };


  const handleReplay = (message: msg) => {

    if (message.sender === 'other') {
      setSelectedMessage(prev => (prev?._id === message._id ? null : message))
    }
  }

  const handleMessageDelete =(messageId:string)=>{
    console.log("message id comming here",messageId)
  }




  if (!chatData) {
    return (
      <div
        className="flex flex-1 p-4 overflow-y-auto items-center justify-center"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
        }
      >
        <div className='bg-black/50 text-white text-center p-3 sm:p-4 rounded-sm text-xs sm:text-sm md:text-base'>
          Hello ... Please select a chat to start messaging !!!
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-1 flex-col">

      <div className="bg-black p-3 sm:p-4 border-b border-gray-700">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {showBackButton && (
              <button 
                onClick={onBack}
                className="sm:hidden w-8 h-8 flex items-center justify-center text-white hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
                aria-label="Back to chats"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
              👨
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-medium text-sm sm:text-base truncate">{chatData?.participants[0].name}</h2>
              <p className={onlineUsers.includes(chatData?.participants[0]._id) ? "text-green-400 text-xs sm:text-sm" : "text-gray-400 text-xs sm:text-sm"}><span >{onlineUsers.includes(chatData?.participants[0]._id) ? 'Online' : 'Offline'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 sm:space-x-4 flex-shrink-0">
            <Phone onClick={() => handleCall('audio')} className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 cursor-pointer hover:text-blue-300" />
            <Video onClick={() => handleCall('video')} className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 cursor-pointer hover:text-blue-300" />
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-pointer hover:text-gray-300" />
          </div>
        </div>
      </div>


      <div
        className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto"
        style={{
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

        <div className="space-y-2 sm:space-y-3 md:space-y-4 max-w-4xl mx-auto">

          {messages.map((msg) => (
            <div onClick={() => handleReplay(msg)} key={msg._id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md" onClick={()=>{if(msg.sender === 'me')setDeleteSelected({id:msg._id as string})}}>
                {msg.replyTo && (
                  <div className="bg-gray-800/80 text-white p-1.5 sm:p-2 rounded-xl border-l-4 border-blue-600 mb-1">
                    <p className="text-xs font-semibold">
                      {msg.replyTo.sender === "me" ? "You" : "Other"}
                    </p>
                    <p className="text-xs italic truncate">
                      {msg.replyTo.mediaType === "image" && "📷 Image"}
                      {msg.replyTo.mediaType === "video" && "🎥 Video"}
                      {msg.replyTo.mediaType === "file" && "📄 File"}
                      {!msg.replyTo.mediaType && msg.replyTo.message}
                    </p>
                  </div>
                )}
                <div
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl relative ${msg.sender === 'me'
                    ? 'bg-gray-700 text-white rounded-br-md'
                    : 'bg-gray-700 text-white rounded-bl-md'
                    }`}
                >
                 {deleteSelected && deleteSelected.id===msg._id &&(
                   <button
                    className="absolute top-1/2 -translate-y-1/2 left-0 -ml-6 sm:-ml-8"
                    onClick={() => handleMessageDelete(msg._id as string)}
                  >
                    <Trash size={14} color='red'/>
                  </button>

                 )}
                 
                  
                  <p className="text-xs sm:text-sm">{msg.message}</p>
                  {msg.mediaType === 'image' && msg.mediaUrl && (
                    <img
                      src={msg.mediaUrl}
                      alt="media"
                      className="rounded-md mt-2 max-h-48 sm:max-h-64 object-contain border border-gray-600 w-full"
                    />

                  )}
                  
                </div>
               
                  {msg.time && (
                  <p className={`text-xs text-gray-400 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'
                    }`}>
                    {msg.time}
                  </p>
                )}
                

                
                
              </div>
            </div>
          ))}

          {typingUser && typingUser !== userId && (
            <div className="flex items-center gap-2 ml-2 sm:ml-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs sm:text-sm">💬</div>
              <div className="bg-white rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-gray-700 shadow animate-bounce text-xs sm:text-sm">
                <span className="dot-flash">.</span>
                <span className="dot-flash delay-150">.</span>
                <span className="dot-flash delay-300">.</span>
              </div>
            </div>
          )}


        </div>
        <div ref={messagesEndRef} />
      </div>

      {selectedMessage && (
        <div className="flex items-center justify-between bg-black p-2 sm:p-3 border border-blue-700 rounded-t-md gap-2">
          <div className="text-xs sm:text-sm text-white truncate">
            Replying to: <span className="font-medium">{selectedMessage.message}</span>
          </div>
          <button
            className="text-xs text-red-500 border border-red-700 px-2 sm:px-3 py-1 rounded-sm flex-shrink-0"
            onClick={() => setSelectedMessage(null)}
          >
            cancel
          </button>
        </div>
      )}


      <div className="bg-black p-3 sm:p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-pointer hover:text-gray-300 flex-shrink-0" onClick={() => setIsModalOpen(true)} />
          <AttachmentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAttach={handleAttach}
          />
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={message}
              onChange={(e) => handleInputChange(e)}
              placeholder="Type your message..."
              className="w-full bg-black border-gray-700 border-2 text-white placeholder-gray-400 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <button
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full p-1 sm:p-1.5 transition-colors"
              onClick={setMessageHandler}
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      {incomingCall && (
        <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 p-3 sm:p-4 bg-white shadow-xl rounded-lg sm:rounded-xl z-50 max-w-[calc(100vw-1.5rem)]">
          <p className="text-sm sm:text-base lg:text-lg font-semibold mb-2">
            {incomingCall.fromUser.name} is {incomingCall.callType} calling you!
          </p>
          <div className="flex gap-2 sm:gap-4">
            <button
              className="bg-green-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base"
              onClick={() => acceptCall(incomingCall)}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base"
              onClick={() => rejectCall(incomingCall)}
            >
              Reject
            </button>
          </div>
        </div>
      )}
      {outgoingCall && (
        <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 p-3 sm:p-4 bg-white shadow-xl rounded-lg sm:rounded-xl z-50 max-w-[calc(100vw-1.5rem)]">
          <p className="text-sm sm:text-base lg:text-lg font-semibold mb-2">
            You are {outgoingCall.callType} calling {outgoingCall.name} !
          </p>
          <div className="flex gap-2 sm:gap-4 flex-wrap">

            <button className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base" >
              {onlineUsers.includes(chatData?.participants[0]._id) ? "Ringing" : `${outgoingCall.name} is off line`}
            </button>
            {!onlineUsers.includes(chatData?.participants[0]._id) && (
              <button
                className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base"
                onClick={() => setOutgoingCall(null)}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default ChatMainComponent
