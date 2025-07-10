import {z} from 'zod'


const locationSchema =  z
  .tuple([z.number(), z.number()])
  .refine(
    ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
    { message: "Coordinates must be valid [longitude, latitude]" }
  );

  
export const zodEventSchema=z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }),
  startTime: z.string().min(1, "Start time is required").regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time "),
  endTime: z.string().min(1, "End time is required") .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time "),
  status: z.enum(["showing", "hidden", "draft"]),
  category: z.string().min(1, "Category is required"),
  location: locationSchema.optional(),
}).refine(({ startTime, endTime }) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const start=new Date()
  start.setHours(startHours,startMinutes,0,0)
  const end=new Date();
    end.setHours(endHours,endMinutes,0,0)
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }
    return end > start 
  }, {
    message: "End time must be after start time",
    path: ["endTime"], 
  })
  .refine(({ startDate, endDate }) => Date.parse(startDate) < Date.parse(endDate), {
    message: "startDate must be before endDate",
    path: ["endDate"], 
  });



  

const createTicketTypeSchema=(seated:boolean):z.ZodType<any>=>{
  return z.object({
    name:z.string().min(1,"Name is required"),
    price:z.string()
    .optional()
    .refine(
      (val)=>seated || (!!val && !isNaN(Number(val as string))),{
      message:"Price must be a number"
    }),
    capacity:z.number().min(1,"Capacity must be at least 1")
 
  })
}

export const createZodTickenTypesSchema=(seated:boolean):z.ZodType<any>=>
  z.array(createTicketTypeSchema(seated))
  .min(1,"At least one ticket type is required")










//   const ticketTypeSchema=z.object({
//     name:z.string().min(1,"Name is required"),
//     price:z.string().optional().refine(val=>!isNaN(Number(val as string)),{
//       message:"Price must be a number"
//     }),
//     capacity:z.number().min(1,"Capacity must be at least 1")
//   })
//  export const ZodTicketTypesSchema=z.array(ticketTypeSchema).min(1,'At least one ticket type is required')














 const seatCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  rowRange: z
    .array(
      z.string().length(3).regex(/^[A-Z]-[A-Z]$/, "Row range must be in format A-J"),
    ),
  price: z.number().min(0, "Price must be a positive number"),
});

export const zodSeatingLayoutSchema = z.object({
  rows: z.number().min(1, "Rows must be at least 1"),
  columns: z.number().min(1, "Columns must be at least 1"),
  categories: z
    .array(seatCategorySchema)
    .min(1, "At least one seat category is required"),
});