import { Timestamp } from 'firebase/firestore';
import { DocumentReference } from 'rxfire/firestore/interfaces';
import { UserDocRaw } from './UserDoc.model';

export interface Project {
  uid?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: DocumentReference<UserDocRaw>[]; // holds refs to user docs
  createdBy: string; //  holds user uid
}

export interface ProjectTransformed {
  uid?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: UserDocRaw[]; // holds users documents
  createdBy: string; //  holds user uid
}
