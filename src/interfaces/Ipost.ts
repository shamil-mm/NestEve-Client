import { IEvent } from "./IEvent";
import { IUser } from "./Iuser";

export interface IPost {
    _id?:string
    eventId:Partial<IEvent>;
    userId:Partial<IUser>;
    content:string;
    media:string;
    createdAt?: string;
    updatedAt?: Date;
    likes:{userId:string}[]
    comments:{userId:Partial<IUser>,comment:string,parentCommentId?:{userId:Partial<IUser>,comment:string}}[]
}