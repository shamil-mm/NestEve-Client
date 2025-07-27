export interface IReview{
    _id?: string;
    eventId:{_id:string,title:string}|string;
    userId:{_id:string,name:string}|string;
    rating:number;
    review?:string;
    createdAt?:Date;
    updatedAt?:Date;

}