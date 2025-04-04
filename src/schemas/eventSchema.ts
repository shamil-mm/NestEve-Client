import {z} from 'zod'
export const zodEventSchema=z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid start date" }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid end date" }),
  startTime: z.string().min(1, "Start time is required").regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  endTime: z.string().min(1, "End time is required") .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  status: z.enum(["showing", "hidden", "draft"]),
  ticketCharge: z.string().min(1, { message: "Ticket price is required" }).refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Invalid ticket price" }),
  category: z.string().min(1, "Category is required"),
  venue: z.string().min(1, "Venue is required"),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Capacity must be a number" }),
  location: z.string().min(3, "Location must be at least 3 characters"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
}).refine(({ startTime, endTime }) => {
    return startTime < endTime; 
  }, {
    message: "startTime must be before endTime",
    path: ["endTime"], 
  })
  .refine(({ startDate, endDate }) => Date.parse(startDate) < Date.parse(endDate), {
    message: "startDate must be before endDate",
    path: ["endDate"], 
  });