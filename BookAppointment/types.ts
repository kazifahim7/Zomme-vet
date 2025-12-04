export type Pet = {
  id: number;
  name: string;
  breed: string;
  years: number;
  months: number;
  image: string;
};

export type DateOption = {
  day: string;
  date: string;
  available: boolean;
};



export interface AppointmentTime {
  time: string;
  booked: boolean; 
  available: boolean; 
  timeRange: string; 
}



export type Reason = "checkup" | "sick" | "vaccination" | "grooming";
