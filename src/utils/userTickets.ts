
export interface UserTicket {
  id: string;
  movieTitle: string;
  hallNumber: string;
  scheduledTime: Date;
  seatNumber: string;
  ticketPrice: number;
  bookingDate: Date;
  adBufferMinutes: number;
  cinemaName?: string;
}

// Demo ticket data for different users - these are static defaults
const staticTicketData: Record<string, UserTicket[]> = {
  "customer@demo.com": [
    {
      id: "T001",
      movieTitle: "Spider-Man: No Way Home",
      hallNumber: "Hall 1",
      scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      seatNumber: "A12",
      ticketPrice: 25.00,
      bookingDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      adBufferMinutes: 12,
      cinemaName: "GSC Pavilion KL"
    },
    {
      id: "T002",
      movieTitle: "Avatar: The Way of Water",
      hallNumber: "Hall 2", 
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      seatNumber: "B8",
      ticketPrice: 28.00,
      bookingDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      adBufferMinutes: 15,
      cinemaName: "GSC Pavilion KL"
    }
  ],
  "admin@demo.com": [
    {
      id: "T003",
      movieTitle: "Top Gun: Maverick",
      hallNumber: "Hall 3",
      scheduledTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      seatNumber: "C15",
      ticketPrice: 26.00,
      bookingDate: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      adBufferMinutes: 10,
      cinemaName: "GSC Mid Valley"
    }
  ],
  "staff@demo.com": []
};

// Key for storing dynamic bookings in localStorage
const DYNAMIC_BOOKINGS_KEY = "dynamicBookings";

export const getDynamicBookings = (userEmail: string): UserTicket[] => {
  const bookings = localStorage.getItem(DYNAMIC_BOOKINGS_KEY);
  if (!bookings) return [];
  
  const allBookings = JSON.parse(bookings);
  const userBookings = allBookings[userEmail] || [];
  
  // Convert date strings back to Date objects
  return userBookings.map((booking: any) => ({
    ...booking,
    scheduledTime: new Date(booking.scheduledTime),
    bookingDate: new Date(booking.bookingDate)
  }));
};

export const saveDynamicBooking = (userEmail: string, booking: UserTicket) => {
  const existingBookings = localStorage.getItem(DYNAMIC_BOOKINGS_KEY);
  const allBookings = existingBookings ? JSON.parse(existingBookings) : {};
  
  if (!allBookings[userEmail]) {
    allBookings[userEmail] = [];
  }
  
  allBookings[userEmail].push(booking);
  localStorage.setItem(DYNAMIC_BOOKINGS_KEY, JSON.stringify(allBookings));
};

export const deleteDynamicBooking = (userEmail: string, bookingId: string) => {
  const existingBookings = localStorage.getItem(DYNAMIC_BOOKINGS_KEY);
  if (!existingBookings) return;
  
  const allBookings = JSON.parse(existingBookings);
  if (allBookings[userEmail]) {
    allBookings[userEmail] = allBookings[userEmail].filter((booking: UserTicket) => booking.id !== bookingId);
    localStorage.setItem(DYNAMIC_BOOKINGS_KEY, JSON.stringify(allBookings));
  }
};

export const getUserTickets = (userEmail: string): UserTicket[] => {
  // For demo purposes, start with empty tickets - only show dynamically booked ones
  const dynamicBookings = getDynamicBookings(userEmail);
  return dynamicBookings;
};

export const isUserLoggedIn = (): boolean => {
  return localStorage.getItem("user") !== null;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
