import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface AuthUserState{
   isAuthenticated:boolean;
   user:{name:string,email:string,role:string,is_block:boolean,id:string,avatarUrl:object}|null; 
}

const initialState:AuthUserState={
    isAuthenticated:false,
    user:null
}
const authUserSlice=createSlice({
    name:'authUser',
    initialState,
    reducers:{
        loginSuccess(state,action:PayloadAction<{email:string,role:string,is_block:boolean,id:string,avatarUrl:object,name:string}>){
            state.isAuthenticated=true;
            state.user={email:action.payload.email,role:action.payload.role,is_block:action.payload.is_block,id:action.payload.id,avatarUrl:action.payload.avatarUrl,name:action.payload.name}
        },
        logoutSuccess(state){
            state.isAuthenticated=false;
            state.user=null
        },
        setAvatar(state,action:PayloadAction<object>){
            if(state.user){
                state.user.avatarUrl=action.payload
            }
        }
    }
})
export const {loginSuccess,logoutSuccess,setAvatar}=authUserSlice.actions
export default authUserSlice.reducer;