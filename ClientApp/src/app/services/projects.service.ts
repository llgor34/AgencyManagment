import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { Project } from '../models/Projects';
import { ToastService } from './toast.service';
import { Board } from '../models/Board.model';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(
    private firestoreService: FirestoreService,
    private auth: Auth,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  async createProject(data: {
    title: string;
    description: string;
    dueDate: Date;
    assignedUsers: string[];
    boards: Board;
  }) {
    // Prepare info about project
    const newProject: Project = {
      title: data.title,
      description: data.description,
      dueDate: this.firestoreService.getTimestamp(data.dueDate),
      assignedUsers: data.assignedUsers,
      createdBy: this.auth.currentUser!.uid,
      completed: false,
      boards: data.boards,
    };
    // Create project record
    await this.firestoreService.addDocument('projects', newProject);
  }

  async toggleProjectCompleteStatus(project: { uid: string; data: Project }) {
    if (!this.authService.isAdmin()) {
      this.toastService.error('Nie posiadasz uprawnień!');
      return;
    }
    try {
      await this.firestoreService.updateDocument('projects', project.uid, {
        completed: !project.data.completed,
      });

      this.toastService.success('Status projektu został zmieniony!');
      this.router.navigate(['/projects']);
    } catch (error: any) {
      this.toastService.error(error.message);
    }
  }

  async deleteProject(uid: string) {
    if (!this.authService.isAdmin()) {
      this.toastService.error('Nie posiadasz uprawnień!');
      return;
    }

    try {
      await this.firestoreService.deleteDocument('projects', uid);
      this.toastService.success('Usunięto projekt!');
      this.router.navigateByUrl('/projects');
    } catch (error: any) {
      this.toastService.error(error.message);
    }
  }

  getProjects$() {
    if (this.authService.isAdmin()) {
      return this.firestoreService.collectionSnapshot$('projects');
    }

    return this.firestoreService.collectionQuery$('projects', [
      'assignedUsers',
      'array-contains',
      this.auth.currentUser!.uid,
    ]);
  }
}
