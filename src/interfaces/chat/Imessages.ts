export interface IMessage {
    _id:string
   conversationId:string;
   sender:{
    _id:string,
    name:string,
    avatar?:string
   };
   message?:string;
   mediaUrl?:string|null;
   mediaType?:'image'|'video' |'file'|null;
   replayTo?:string|null
   createdAt:string;
   updateAt:string
}