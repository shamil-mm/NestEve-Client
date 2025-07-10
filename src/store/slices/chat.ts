import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface Organizer{
    _id:string;
    name:string;
    avatarUrl?:string;
    email?:string;
}
interface ChatState{
    selectedOrganizer:Organizer|null
}
const initialState:ChatState={
    selectedOrganizer:null
}

const chatSlice=createSlice({
    name:'chat',
    initialState,
    reducers:{
        setSelectedOrganizer:(state,action:PayloadAction<Organizer>)=>{
            state.selectedOrganizer=action.payload
        },
        clearSelectedOrganizer:(state)=>{
            state.selectedOrganizer=null
        }
    }
})
export const {setSelectedOrganizer,clearSelectedOrganizer}=chatSlice.actions
export default chatSlice.reducer;