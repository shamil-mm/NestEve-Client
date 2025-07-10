import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/AuthHook'
import { getUserBookings } from '../../services/bookingService'
import { transformToCalendarEvents } from '../../utils/formateCalendarData'
 
function Calendar() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const userId = useAppSelector((state) => state.authUser.user?.id)
  
  
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [], 
    plugins: [eventsService]
  })

  useEffect(() => {
    const GetUserBookings = async () => {
      if (userId) {
        try {
          const response = await getUserBookings(userId)
          const booking = response?.data.data || []
          const transformed = await transformToCalendarEvents(booking)

          if (transformed && Array.isArray(transformed)) {
            eventsService.getAll().forEach(event => {
              eventsService.remove(event.id)
            })
            
          
            transformed.forEach(event => {
              eventsService.add(event)
            })
          }
        } catch (error) {
          console.error('Error loading bookings:', error)
        }
      }
    }
    GetUserBookings()
  }, [userId, eventsService])
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default Calendar