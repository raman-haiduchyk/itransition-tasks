import { Company } from './company.model';

export interface Job {
  id: number;
  name: string;
  salary: number;
  requirments: string;
  responsibilities: string;
  offers: string;
  specialization: string;
  createdAt: string;
  company: Company;
}
