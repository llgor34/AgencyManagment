import { Injectable } from '@angular/core';
import {
  Firestore,
  updateDoc,
  doc,
  arrayRemove,
} from '@angular/fire/firestore';
import { FirestoreService } from './firestore.service';
import { Board } from './models/Board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(
    private firestoreService: FirestoreService,
    private firestore: Firestore
  ) {}

  // Updates the tasks on board
  async updateTasks(projectId: string, tasks: Board) {
    await this.firestoreService.updateDocument('projects', projectId, {
      boards: tasks,
    });
  }

  // Deletes specific task from board
  async removeTask(
    projectId: string,
    task: string,
    colName: 'assignedTasks' | 'inProgressTasks' | 'doneTasks'
  ) {
    const docRef = doc(this.firestore, 'projects', projectId);

    await updateDoc(docRef, {
      [colName]: arrayRemove(task),
    });
  }
}
