import { IConversation } from "../interfaces/chat/Iconversation";

export const formateConversations = async (
  data: IConversation[],
  currentUserId: string
) => {
  console.log('formate conversation data',data)
  return data.map((Conversation: IConversation) => {
    if (Conversation.type === "one-to-one") {
      const opponent = Conversation.participants.find(
        (value) => value._id !== currentUserId
      );
      const unreadCount=Conversation.unreadCounts.find(
        (entry)=>entry.userId.toString()===currentUserId
      )?.count || 0
      return {
        id: Conversation._id,
        name: opponent?.name,
        lastMessage: Conversation.lastMessage || "",
        lastMessageTime:new Date(Conversation.lastMessageTime as string).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })|| "",
        avatar: opponent?.avatar || "👨",
        unread: unreadCount,
      };
    }
  });
  
};

export const getOpponent=async( 
  data: IConversation,
  currentUserId: string)=>{
   const messager= data.participants.filter((value)=>value?._id!==currentUserId)
   return {
    ...data,
    participants:messager
   }
}
