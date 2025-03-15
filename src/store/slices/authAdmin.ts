import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface AuthAdminState{
   isAuthenticated:boolean;
   admin:{email:string,role:string,is_block:boolean}|null; 
}

const initialState:AuthAdminState={
    isAuthenticated:false,
    admin:null
}
const authAdminSlice=createSlice({
    name:'authAdmin',
    initialState,
    reducers:{
        setLoginAdmin(state,action:PayloadAction<{email:string,role:string,is_block:boolean}>){
            state.isAuthenticated=true;
            state.admin={email:action.payload.email,role:action.payload.role,is_block:action.payload.is_block}
        },
        setLogoutAdmin(state){
            state.isAuthenticated=false;
            state.admin=null
        }
    }
})
export const {setLoginAdmin,setLogoutAdmin}=authAdminSlice.actions
export default authAdminSlice.reducer;