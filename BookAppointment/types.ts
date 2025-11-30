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
  booked: boolean; // MISSING
  available: boolean; // PROVIDED
  timeRange: string; // MISSING
}



export type Reason = "checkup" | "sick" | "vaccination" | "grooming";
