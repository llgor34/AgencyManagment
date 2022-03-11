import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { Project } from './models/Projects';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(private firestoreService: FirestoreService, private auth: Auth) {}

  async createProject(data: {
    title: string;
    description: string;
    dueDate: Date;
    assignedUsers: string[];
  }) {
    // Prepare info about project
    const newProject: Project = {
      title: data.title,
      description: data.description,
      dueDate: this.firestoreService.getTimestamp(data.dueDate),
      assignedUsers: data.assignedUsers,
      createdBy: this.auth.currentUser!.uid,
      completed: false,
      boards: {
        assignedTasks: [
          {
            title: 'Pierwsze zadanie do wykonania',
            description: 'Stworzyć jakieś zadania',
            label: 'red',
          },
        ],
        inProgressTasks: [
          {
            title: 'Zorganizować czas',
            description: 'poprostu',
            label: 'green',
          },
        ],
        doneTasks: [
          {
            title: 'Pierwsze ukończone zadanie ',
            description: 'Zostało wykonane',
            label: 'blue',
          },
        ],
      },
    };
    // Create project record
    await this.firestoreService.addDocument('projects', newProject);
  }
}
