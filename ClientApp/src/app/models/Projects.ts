import { Timestamp } from 'firebase/firestore';
import { UserDoc } from './UserDoc.model';
import { Task } from './Board.model';

export interface Project {
  uid?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: string[]; // holds users uid
  createdBy: string; //  holds user uid
  boards: {
    assignedTasks: Task[];
    inProgressTasks: Task[];
    doneTasks: Task[];
  };
}

export interface ProjectTransformed {
  uid?: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  completed: boolean;
  assignedUsers: UserDoc[]; // holds users documents
  createdBy: string; //  holds user uid
  boards: {
    assignedTasks: Task[];
    inProgressTasks: Task[];
    doneTasks: Task[];
  };
}
