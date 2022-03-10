import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BoardService } from './board.service';
import { FirestoreService } from './firestore.service';
import { Project } from './models/Projects';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  constructor(
    private firestoreService: FirestoreService,
    private auth: Auth,
    private boardService: BoardService
  ) {}

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
      boardUids: [],
    };

    // Create first board record for project
    const boardUid = await this.boardService.createBoard({
      title: 'New Board',
      priority: 0,
    });

    // Update project boards
    newProject.boardUids.push(boardUid);

    // Create project record
    await this.firestoreService.addDocument('projects', newProject);
  }
}
