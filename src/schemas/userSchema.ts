import {z} from 'zod'

export const zodUserSchema=z.object({
    name:z.string().min(3,{message:"Name is required"}),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:'Password must be at least 6 charactors long'})
})
export const zodOrganizerSchema=z.object({
    name:z.string().min(3,{message:"Name is required"}),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:'Password must be at least 6 charactors long'}),
    role: z.enum(['organizer', 'user'], { message: "Role must be either 'organizer' or 'user'" }),
    organizationName: z.string().min(3, { message: "Organization name is required" }),
})
export const zodLoginSchema=z.object({
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:'Password must be at least 6 charactors long'})
})

export const zodForgotPasswordSchema=z.object({
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:'Password must be at least 6 charactors long'})
})