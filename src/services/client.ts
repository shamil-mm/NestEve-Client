import axios from "axios";
import { store } from "../store";
import { logoutSuccess } from "../store/slices/authUsers";

const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;

export const client = axios.create({
       baseURL:API_BASE_URL,
       headers:{
           "Content-Type":"application/json"
       },
       withCredentials:true,
   })
   client.interceptors.response.use(
       response => response,
       async function (error) {
       

           if (error.response && error.response.status === 401 && error.response.statusText==='Unauthorized'&& error.response.data.message==='Authentication required' ) {
               try {
                   console.log('its comming here for clear the data okay')
                //    store.dispatch(logoutSuccess());
                //    window.location.href = "/role"
                   return Promise.reject(error);
               } catch (err) {
                   store.dispatch(logoutSuccess());
                   return Promise.reject(err);
               }
           }
           
           return Promise.reject(error);
       }
     );