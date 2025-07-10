
export interface ISeats{
    id:string;
    status:string;
    category:string;
    price:string;
    isVisible:boolean
}

export interface IfilteredRows{
    id:string;
    category:string;
    seats:ISeats[]
}