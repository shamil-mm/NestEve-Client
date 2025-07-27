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
    _id?:string
    name:string;
    rowRange:string[];
    price:number
}
export interface ILayoutConfig{
    rows: number;
    columns: number;
    seatStyle: string;
    passageRows: number[];
    passageColumns: number[];
    categories:categories[]
}
export interface ITags{
    _id:string
    tag:string
}
export interface IOrganizer {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}
export interface IEvent{
    filter(arg0: (event: any) => boolean): unknown;
    _id:string;
    organizerId:IOrganizer,
    title:string;
    description:string;
    image:string;
    category:Icategory;
    tags:[ITags];
    startDate:string;
    endDate:string;
    startTime:string;
    endTime:string;
    location:{type:"Point";coordinates:[number,number]};
    status:string;
    ticketTypes:[ITicketTypes];
    layoutConfig:ILayoutConfig
    is_block:boolean;
    is_seated:boolean;
}