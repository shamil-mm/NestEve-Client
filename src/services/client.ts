import axios from "axios";
import { store } from "../store";
import { logoutSuccess } from "../store/slices/authUsers";
// import { toast } from "react-fox-toast";

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
           // const originalRequest = error.config;
           // console.log(error.response.status,originalRequest._retry);
        
           if (error.response && error.response.status === 403 && error.response.statusText==='Not Found') {
              
               try {
                   store.dispatch(logoutSuccess());
                   window.location.href = "/role"
                   return Promise.reject(error);
               } catch (err) {
                   store.dispatch(logoutSuccess());
                   return Promise.reject(err);
               }
           }
           
           return Promise.reject(error);
       }
     );

// export const apiClient=createApiClient()

// export const client=(method: string,url: string , data:object={},headers={})=>{
//     console.log(method,url,data,headers)
//     return apiClient({
//         method,
//         url,
//         data,
//         headers:{
//             ...apiClient.defaults.headers.common,
//             ...headers
//         }
//     })
// }

