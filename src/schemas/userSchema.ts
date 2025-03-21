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

export const zodAddressSchema=z.object({
    phone:z.string()
    .nullable()
    .refine(value=>value===null || /^[0-9]{10}$/.test(value),{message:'Phone must be a 10- digit'}),
    street:z.string().min(1,"Street is required"),
    city:z.string().min(1,"city is required"),
    state:z.string().min(1,'state is required'),
    country:z.string().min(1,'country is required'),
    zip:z.string()
    .nullable()
    .refine(value=>value===null || /^[0-9]{5,6}$/.test(value) ,{
        message:'ZIP code must be a valid 5 or 6 digit number'
    })
})