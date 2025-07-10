import { IConversation } from "../interfaces/chat/Iconversation";

export const formateConversations = async (
  data: IConversation[],
  currentUserId: string
) => {
  return data.map((Conversation: IConversation) => {
    if (Conversation.type === "one-to-one") {
      const opponent = Conversation.participants.find(
        (value) => value._id !== currentUserId
      );
      return {
        id: Conversation._id,
        name: opponent?.name,
        lastMessage: Conversation.lastMessage || "",
        lastMessageTime:new Date(Conversation.lastMessageTime as string).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })|| "",
        avatar: opponent?.avatar || "👨",
        unread: Conversation.unreadCounts.length || 0,
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
