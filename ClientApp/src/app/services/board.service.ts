import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Board } from '../models/Board.model';
import { ProjectTemplate } from '../models/ProjectTemplate.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private firestoreService: FirestoreService) {}

  // Updates the tasks on board
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
}
