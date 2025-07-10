export interface IParticipants{
    _id:string;
    name:string;
    email:string;
    avatar:string;
}
export interface IUnreadCount{
   userId:string
   count:number
}
export interface IConversation extends Document{
   _id:string;
   type:'one-to-one' | 'event';
   participants:IParticipants[];
   eventId?:string;
   lastMessage?:string|null;
   lastMessageTime?:string|null;
   unreadCounts: IUnreadCount[];
   createAt?:string;
   updateAt?:string;
}

export interface showChat {
      id: string;
      name:string;
      lastMessage:string;
      lastMessageTime: string,
      avatar: string,
      unread: number
    }