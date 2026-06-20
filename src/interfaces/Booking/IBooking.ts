import { IEvent } from "../IEvent";
import { IUser } from "../Iuser";

export interface IBooking {
    _id: any;
    createdAt: string | number | Date;
    eventId:Partial<IEvent>;
    userId:string|IUser;
    tickets:{
            name:string,
            price:number,
            quantity:number,
            selectedSeats:{ id: string, status: string, category: string, price: number }[]
        }[],
    status:'confirmed'|'pending' |'cancelled' ,
    paymentStatus:'paid'|'unpaid'|'refund',
    paymentMethod:'stripe'|'cod',
    paymentId:string |null,
    secureShareToken:string|null
    
}