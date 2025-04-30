import { ITicket } from "../components/ui/Checkout/NonseatedCheckout";
import { IEvent } from "../interfaces/IEvent";
import { client } from "./client";

export const stripeCheckout = async (event:Partial<IEvent>,tickets:ITicket[],userId: string)=>{
    try {
        const response= await client.post('/booking/api/stripe-checkout-session',{event,tickets,userId})
        return  response
    } catch (error) {
        console.log('error in stripe checkout session ',error)
    }
}