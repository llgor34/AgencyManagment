export interface Board {
  assignedTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
}

export interface Task {
  title: string;
  description: string;
  label: 'red' | 'yellow' | 'blue' | 'green';
}
