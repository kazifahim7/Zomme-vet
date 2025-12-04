import { Pet, DateOption, AppointmentTime } from "./types";

export const pets: Pet[] = [
  { id: 1, name: "Bella", breed: "Golden Retriever", years: 3, months: 2, image: "🐕" },
  { id: 2, name: "Nala", breed: "Persian", years: 3, months: 0, image: "🐱" },
  { id: 3, name: "Cooper", breed: "Labrador", years: 2, months: 6, image: "🐕" },
  { id: 4, name: "Milo", breed: "British Shorthair", years: 1, months: 3, image: "🐱" },
  { id: 5, name: "Bella", breed: "Golden Retriever", years: 3, months: 2, image: "🐕" },
  { id: 6, name: "Nala", breed: "Persian", years: 3, months: 0, image: "🐱" },
  { id: 7, name: "Cooper", breed: "Labrador", years: 2, months: 6, image: "🐕" },
  { id: 8, name: "Milo", breed: "British Shorthair", years: 1, months: 3, image: "🐱" },
];

export const dates: DateOption[] = [
  { day: "Fri", date: "05", available: true },
  { day: "Sat", date: "06", available: true },
  { day: "Sun", date: "07", available: false },
  { day: "Mon", date: "08", available: false },
  { day: "Tue", date: "09", available: true },
];

export const appointmentTimes: AppointmentTime[] = [
  // This slot is booked
  { 
    time: "01:31–02:00 PM", 
    booked: true, 
    available: false, // Booked implies not available
    timeRange: "Afternoon" 
  },
  
  // These slots are available
  { 
    time: "03:01–03:30 PM", 
    booked: false,     // Must be explicitly set to false if available
    available: true, 
    timeRange: "Afternoon" 
  },
  { 
    time: "03:31–04:00 PM", 
    booked: false, 
    available: true, 
    timeRange: "Afternoon" 
  },
  { 
    time: "04:01–04:30 PM", 
    booked: false, 
    available: true, 
    timeRange: "Afternoon" 
  },
  { 
    time: "03:01–03:30 AM", 
    booked: false,     // Must be explicitly set to false if available
    available: true, 
    timeRange: "Early Morning" 
  },
  { 
    time: "03:31–04:00 AM", 
    booked: false, 
    available: true, 
    timeRange: "Early Morning" 
  },
  { 
    time: "04:01–04:30 AM", 
    booked: false, 
    available: true, 
    timeRange: "Early Morning" 
  },
   { 
    time: "06:31–07:00 PM", 
    booked: true, 
    available: false, // Booked implies not available
    timeRange: "Morning" 
  },
  
  // These slots are available
  { 
    time: "07:01–07:30 PM", 
    booked: false,     // Must be explicitly set to false if available
    available: true, 
    timeRange: "Morning" 
  },
  { 
    time: "08:31–09:00 PM", 
    booked: false, 
    available: true, 
    timeRange: "Morning" 
  },
  { 
    time: "09:01–10:30 PM", 
    booked: false, 
    available: true, 
    timeRange: "Morning" 
  },
 {  
    time: "06:31–07:00 PM", 
    booked: true, 
    available: false, // Booked implies not available
    timeRange: "Evening" 
  },
  
  // These slots are available
  { 
    time: "07:01–07:30 PM", 
    booked: false,     // Must be explicitly set to false if available
    available: true, 
    timeRange: "Evening" 
  },
  { 
    time: "08:31–09:00 PM", 
    booked: false, 
    available: true, 
    timeRange: "Evening" 
  },
  { 
    time: "09:01–09:30 PM", 
    booked: false, 
    available: true, 
    timeRange: "Evening" 
  },
];
