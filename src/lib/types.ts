export type JobStatus = 'saved' | 'applied' | 'interview' | 'rejected';

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  status: JobStatus;
  dateAdded: string;
  matchScore?: number;
  matchExplanation?: string;
  tailoredCv?: string;
  coverLetter?: string;
}