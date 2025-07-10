import { configureStore,Tuple } from "@reduxjs/toolkit"
import authReducer from './slices/auth'
import localStorageMiddleware from "../middleware/localStorageMiddleware"
import authUser from './slices/authUsers'
import authAdmin from './slices/authAdmin'
import checkout from './slices/checkout'
import tempPost from './slices/tempPost'
import chatReducer from './slices/chat'

const loadStateFromLocalStorage=()=>{
    try {
        const serializedState=localStorage.getItem('authState');
        if(serializedState===null)return undefined;
        return JSON.parse(serializedState)
    } catch (error) {
        console.error('Failed to load state from local storage:', error);
        return undefined;
    }
}

const loadAuthUserStateFromLocalStorage =()=>{
    try {
        const serializedState=localStorage.getItem('authUserState')
        if(serializedState==null)return undefined;
        return JSON.parse(serializedState)
    } catch (error) {
        console.error('Failed to load authUser state from local storage:', error);
        return undefined;
    }
}
const loadAuthAdminStateFromLocalStorage =()=>{
    try {
        const serializedState=localStorage.getItem('authAdminState')
        if(serializedState==null)return undefined;
        return JSON.parse(serializedState)
    } catch (error) {
        console.error('Failed to load authUser state from local storage:', error);
        return undefined;
    }
}
const loadChatStateFromLocalStorage =()=>{
    try {
        const serializedState=localStorage.getItem('chatState')
        if(serializedState==null)return undefined;
        return JSON.parse(serializedState)
    } catch (error) {
        console.error('Failed to load chat state from local storage:', error);
        return undefined;
    }
}

const persistedState=loadStateFromLocalStorage()
const persistedAuthUserState=loadAuthUserStateFromLocalStorage();
const persistedAuthAdminState=loadAuthAdminStateFromLocalStorage();
const persistedChatState=loadChatStateFromLocalStorage();




export const store = configureStore({
    reducer:{
       auth:authReducer,
       authUser:authUser,
       authAdmin:authAdmin,
       checkout:checkout,
       tempPost:tempPost,
       chat:chatReducer,
    },
    
    preloadedState:{
        auth:persistedState || {step:'role',selectedRole:null},
        authUser:persistedAuthUserState || {},
        authAdmin:persistedAuthAdminState || {},
        chat:persistedChatState || {}
    },
    middleware: (getDefaultMiddleware) =>
        new Tuple(...getDefaultMiddleware(),localStorageMiddleware),
   
})
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch