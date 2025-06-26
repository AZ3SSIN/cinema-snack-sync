
export interface UserTicket {
  id: string;
  movieTitle: string;
  hallNumber: string;
  scheduledTime: Date;
  seatNumber: string;
  ticketPrice: number;
  bookingDate: Date;
  adBufferMinutes: number;
}

// Demo ticket data for different users
export const getUserTickets = (userEmail: string): UserTicket[] => {
  const ticketData: Record<string, UserTicket[]> = {
    "customer@demo.com": [
      {
        id: "T001",
        movieTitle: "Spider-Man: No Way Home",
        hallNumber: "Hall 1",
        scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
        seatNumber: "A12",
        ticketPrice: 25.00,
        bookingDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        adBufferMinutes: 12
      },
      {
        id: "T002",
        movieTitle: "Avatar: The Way of Water",
        hallNumber: "Hall 2", 
        scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        seatNumber: "B8",
        ticketPrice: 28.00,
        bookingDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        adBufferMinutes: 15
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
        adBufferMinutes: 10
      }
    ],
    "staff@demo.com": []
  };

  return ticketData[userEmail] || [];
};

export const isUserLoggedIn = (): boolean => {
  return localStorage.getItem("user") !== null;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
