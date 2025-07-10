import { IBooking } from "../interfaces/Booking/IBooking";

export async function transformBookingData(bookings: IBooking[]) {
  return bookings.map((booking) => {
    const totalAmount = Array.isArray(booking.tickets)
      ? booking.tickets.reduce((sum: number, ticket: any) => {
          return sum + (ticket.price * ticket.quantity);
        }, 0)
      : 0;

    const formattedDate = new Date(booking.createdAt).toLocaleDateString('en-GB');

    return {
      orderId: booking._id.slice(-4),
      eventName:(booking as any)?.event?.title || '',
      attendeeName:(booking as any)?.user?.name || '',
      status: booking.status,
      date: formattedDate,
      totalAmount: totalAmount,
    };
  });
}