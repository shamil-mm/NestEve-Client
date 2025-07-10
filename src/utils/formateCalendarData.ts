 interface CalendarEvent{id:string;title:string;start:string;end:string}

export async function transformToCalendarEvents(bookings: any[]):Promise<CalendarEvent[]>{
  return bookings.map((booking, index) => {
    const event = booking.eventId

    return {
      id: booking._id || String(index + 1),
      title: event?.title || 'Untitled Event',
      start: event?.startDate?.split('T')[0], 
      end: event?.endDate?.split('T')[0] 
    }
  })
}