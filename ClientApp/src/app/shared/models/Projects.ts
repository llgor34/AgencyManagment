export interface Project {
  title: string;
  description: string;
  content: string;
  dueDate: Date;
  completed: boolean;
  assignedUsers: string[]; // holds users uid
  createdBy: string; //  holds user uid
}
