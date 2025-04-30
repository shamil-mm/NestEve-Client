import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { ITicket } from "../../components/ui/Checkout/NonseatedCheckout";
import { IEvent } from "../../interfaces/IEvent";

interface CheckoutState{
    tickets:ITicket[],
    isSeated:boolean,
    event:Partial<IEvent>
}

const initialState:CheckoutState={
    tickets:[],
    isSeated:false,
    event:{}
}

const checkoutSlice=createSlice({
    name:'checkout',
    initialState,
    reducers:{
        setCheckoutData:(state,action:PayloadAction<CheckoutState>)=>{
            state.tickets=action.payload.tickets;
            state.isSeated=action.payload.isSeated;
            state.event=action.payload.event
        },
        clearCheckoutData:(state)=>{
            state.tickets=[];
            state.isSeated=false;
            state.event={}
        }

    }
})

export const {setCheckoutData,clearCheckoutData}=checkoutSlice.actions
export default checkoutSlice.reducer