import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Board } from '../models/Board.model';
import { ProjectTemplate } from '../models/ProjectTemplate.model';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private firestoreService: FirestoreService) {}

  async updateTasks(projectId: string, tasks: Board) {
    await this.firestoreService.updateDocument('projects', projectId, {
      boards: tasks,
    });
  }

  async createNewBoardTemplate(projectTemplate: ProjectTemplate) {
    await this.firestoreService.addDocument(
      'projectsTemplates',
      projectTemplate
    );
  }

  async updateBoardTemplate(uid: string, data: ProjectTemplate) {
    await this.firestoreService.updateDocument('projectsTemplates', uid, data);
  }

  getBoardsTemplates$() {
    return this.firestoreService.collectionSnapshot$('projectsTemplates');
  }
}
