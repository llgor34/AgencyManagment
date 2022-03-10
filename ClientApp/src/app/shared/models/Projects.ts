import { Timestamp } from 'firebase/firestore';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { UserDoc } from './UserDoc.model';

export interface Project {
  uid?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: string[]; // holds users uid
  createdBy: string; //  holds user uid
  boardUids: string[]; // holds project boards
}

export interface ProjectTransformed {
  uid?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: UserDoc[]; // holds users documents
  createdBy: string; //  holds user uid
  boardUids: string[]; // holds project boards
}
