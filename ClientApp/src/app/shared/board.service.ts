import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  arrayRemove,
  writeBatch,
} from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { switchMap } from 'rxjs/operators';
import { Board, Task } from './models/Board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Creates a new board for current project
  async createBoard(data: Board) {
    const col = collection(this.firestore, 'boards');

    const newBoard = await addDoc(col, {
      ...data,
      tasks: [{ description: 'Hello World!' }],
    });
    return newBoard.id;
  }

  // Deletes board
  deleteBoard(boardId: string) {
    const docToDelete = doc(this.firestore, 'boards', boardId);

    return deleteDoc(docToDelete);
  }

  // Updates the tasks on board
  updateTasks(boardId: string, tasks: Task[]) {
    const docToUpdate = doc(this.firestore, 'boards', boardId);

    return updateDoc(docToUpdate, {
      tasks,
    });
  }

  // Deletes specific task from board
  removeTask(boardId: string, task: Task) {
    const docRef = doc(this.firestore, 'boards', boardId);

    return updateDoc(docRef, {
      tasks: arrayRemove(task),
    });
  }

  // Gets all boards assigned to a current user
  getCurrentBoards(projectUid: string) {
    return authState(this.auth).pipe(
      switchMap(async (user) => {
        if (user) {
          const currentProjectSnap = await getDoc(
            doc(this.firestore, 'projects', projectUid)
          );
          const boardsRef: string[] = currentProjectSnap.data()!['boardUids'];

          const boards: Board[] = await Promise.all(
            boardsRef.map(async (boardRef) => {
              const boardSnap = await getDoc(doc(this.firestore, boardRef));
              return { ...boardSnap.data(), uid: boardSnap.id };
            })
          );

          return boards.sort((a, b) => (a.priority! > b.priority! ? 1 : -1));
        } else {
          return [];
        }
      })
    );
  }

  // Run a batch write to change the priority of each board for sorting
  sortBoards(boards: Board[]) {
    const refs = boards.map((b) => doc(this.firestore, 'boards', b.uid!));
    const batch = writeBatch(this.firestore);

    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
