export interface Project {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  assignedUsers: string[]; // holds users uid
  createdBy: string; //  holds user uid
}
