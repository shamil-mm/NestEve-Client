import { createSlice , PayloadAction } from '@reduxjs/toolkit'

interface User {
    name:string;
    email:string;
    password:string;
}
interface UserState{
    users:User[]
}
const initialState:UserState={
    users:[]
};

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        register:(state,action:PayloadAction<User>)=>{
            if(action.payload){
                state.users.push(action.payload)
            }
        }
    }
})
export const {register}=userSlice.actions
export default userSlice.reducer;