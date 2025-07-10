import { Middleware } from "@reduxjs/toolkit";


const localStorageMiddleware:Middleware=(store)=>(next)=>(action)=>{
    const result=next(action)
    const state= store.getState();
    localStorage.setItem('authState',JSON.stringify(state.auth))
    localStorage.setItem('authUserState',JSON.stringify(state.authUser))
    localStorage.setItem('authAdminState',JSON.stringify(state.authAdmin))
    localStorage.setItem('chatState',JSON.stringify(state.chat))
    return result
}
export default localStorageMiddleware