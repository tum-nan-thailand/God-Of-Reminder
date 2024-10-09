export interface JobInterface {
  id: number;
  company: string;
  position: string;
  applicationDate: string;
  status: string;
  notes?: string;
  salary?: string;
  location?: string;
}
