import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { IPost } from "../../interfaces/Ipost";
 
interface postState{
    tempPost:Partial<IPost>|null;
}
const initialState:postState={
    tempPost:null
}
const postSlice=createSlice({
    name:'tempPost',
    initialState,
    reducers:{
        setTempPost:(state,action:PayloadAction<Partial<IPost>>)=>{
            state.tempPost=action.payload
        },
        clearTempPost:(state)=>{
            state.tempPost=null
        }
    }
})

export const {setTempPost,clearTempPost}=postSlice.actions
export default postSlice.reducer
