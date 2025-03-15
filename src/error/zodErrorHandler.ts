import { z } from "zod"

export const zodErrorHandler =(error:z.ZodError)=>{
    const errors:{[key:string]:string}={}
    error.errors.forEach((err)=>{
        if(err.path){
            const key = err.path[0]
            errors[key]=err.message
        }
    })
    return errors
}