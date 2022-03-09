import { Timestamp } from 'firebase/firestore';

export interface Project {
  uid?: string;
  title: string;
  description: string;
  content: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: string[]; // holds users uid
  createdBy: string; //  holds user uid
}
