export interface Board {
  assignedTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  label: labelColors;
}

export type labelColors = 'red' | 'yellow' | 'blue' | 'green';
