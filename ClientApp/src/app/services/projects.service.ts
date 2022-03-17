import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import { Project } from '../models/Projects';
import { ToastService } from './toast.service';
import { Board } from '../models/Board.model';
import { Timestamp } from 'firebase/firestore';

interface projectData {
  title: string;
  description: string;
  dueDate: Date | Timestamp;
  assignedUsers: string[];
  boards: Board;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(
    private firestoreService: FirestoreService,
    private auth: Auth,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  private doesntHaveEnoughPermissions() {
    if (!this.authService.isAdmin()) {
      this.toastService.error('Nie posiadasz uprawnień!');
      return true;
    }
    return false;
  }

  private handleSuccess(message: string) {
    this.toastService.success(message);
    this.router.navigate(['/projects']);
  }

  private handleError(error: any) {
    this.toastService.error(error.message);
  }

  async createProject(data: projectData) {
    const newProject: Project = {
      title: data.title,
      description: data.description,
      dueDate:
        data.dueDate instanceof Date
          ? this.firestoreService.getTimestamp(data.dueDate)
          : data.dueDate,
      assignedUsers: data.assignedUsers,
      createdBy: this.auth.currentUser!.uid,
      completed: false,
      boards: data.boards,
    };

    await this.firestoreService.addDocument('projects', newProject);
  }

  async toggleProjectCompleteStatus(project: { uid: string; data: Project }) {
    if (this.doesntHaveEnoughPermissions()) return;

    try {
      await this.firestoreService.updateDocument('projects', project.uid, {
        completed: !project.data.completed,
      });

      this.handleSuccess('Status projektu został zmieniony!');
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async deleteProject(uid: string) {
    if (this.doesntHaveEnoughPermissions()) return;

    try {
      await this.firestoreService.deleteDocument('projects', uid);
      this.handleSuccess('Usunięto projekt!');
    } catch (error: any) {
      this.handleError(error);
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
