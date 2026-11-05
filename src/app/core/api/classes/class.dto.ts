export interface FitnessClass {
  id: string;
  time: string;
  name: string;
  trainer: string;
  studio: string;
  branch: string;
  date?: string;
  duration: number;
  state: 'Upcoming' | 'In Progress' | 'Full' | 'Completed' | 'Cancelled';
  enrolled: number;
  capacity: number;
  waitlist: number;
}
