import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface AuthUserState{
   isAuthenticated:boolean;
   user:{email:string,role:string,is_block:boolean}|null; 
}

const initialState:AuthUserState={
    isAuthenticated:false,
    user:null
}
const authUserSlice=createSlice({
    name:'authUser',
    initialState,
    reducers:{
        loginSuccess(state,action:PayloadAction<{email:string,role:string,is_block:boolean}>){
            state.isAuthenticated=true;
            state.user={email:action.payload.email,role:action.payload.role,is_block:action.payload.is_block}
        },
        logoutSuccess(state){
            state.isAuthenticated=false;
            state.user=null
        }
    }
})
export const {loginSuccess,logoutSuccess}=authUserSlice.actions
export default authUserSlice.reducer;