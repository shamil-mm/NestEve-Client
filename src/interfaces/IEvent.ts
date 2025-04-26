export interface Icategory{
    _id:string;
    categoryName:string
}
export interface ITicketTypes{
    name:string;
    price:string;
    capacity:number;
}
interface categories{
    _id:string
    name:string;
    rowRange:string[];
    price:number
}
export interface ILayoutConfig{
   
    rows:number;
    columns:number;
    categories:[categories]
}
export interface ITags{
    _id:string
    tag:string
}
export interface IEvent{
    filter(arg0: (event: any) => boolean): unknown;
    _id:string;
    title:string;
    description:string;
    image:string;
    category:Icategory;
    tags:[ITags];
    startDate:string;
    endDate:string;
    startTime:string;
    endTime:string;
    venue:string;
    locationName:string;
    status:string;
    ticketTypes:[ITicketTypes];
    layoutConfig:ILayoutConfig
    is_block:boolean;
    is_seated:boolean;
}