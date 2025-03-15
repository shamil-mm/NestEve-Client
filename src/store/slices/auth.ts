import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    step:'login' | 'role' | 'OrganizerRegister' | 'UserRegister';
    selectedRole:'organizer' | 'user' | null
}

const initialState:AuthState={
    step:'role',
    selectedRole:null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setStep:(state,action:PayloadAction<AuthState['step']>)=>{
            state.step=action.payload
        },
        setSelectedRole:(state,action:PayloadAction<AuthState['selectedRole']>)=>{
            state.selectedRole=action.payload
        },
        clear:(state)=>{
            state.step='role';
            state.selectedRole=null;
        }
    }    
})

export const {setStep,setSelectedRole,clear}=authSlice.actions
export default authSlice.reducer
