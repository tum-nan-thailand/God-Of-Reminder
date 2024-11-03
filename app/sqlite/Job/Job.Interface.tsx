export interface JobInterface {
  id: number;
  company: string;
  position: string;
  jobdate: string;
  status: string;
  notes?: string;
  salary?: number;
  location?: string;
}
