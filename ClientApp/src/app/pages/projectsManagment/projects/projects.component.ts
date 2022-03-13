import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Project, ProjectTransformed } from 'src/app/shared/models/Projects';
import { UserDocRaw } from 'src/app/shared/models/UserDoc.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  _projects: ProjectTransformed[] = [];
  projectsSub: Subscription;
  isAdmin = false;
  loading = false;
  filter: 'all' | 'completed' = 'all';

  constructor(
    private firestoreService: FirestoreService,
    private rotuer: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const userDoc: UserDocRaw = JSON.parse(localStorage.getItem('userDoc')!);
    if (userDoc.roles['admin']) {
      this.getAllProjects();
      this.isAdmin = true;
    } else {
      this.getUserProjects();
    }
  }

  get projects() {
    return this._projects.filter((project) => {
      switch (this.filter) {
        case 'all':
          return !project.completed;
        case 'completed':
          return project.completed;
        default:
          return true;
      }
    });
  }

  getAllProjects() {
    this.projectsSub = this.firestoreService
      .collectionSnapshot$('projects')
      .subscribe((projectDocs: any) => {
        Promise.all(
          projectDocs.map(async (projectDoc: Project) => ({
            ...projectDoc,
            assignedUsers: await Promise.all(
              projectDoc.assignedUsers.map(
                async (assignedUser) =>
                  await this.firestoreService.getDocument('users', assignedUser)
              )
            ),
          }))
        ).then((transformedProjects) => {
          this._projects = transformedProjects;
          this.loading = false;
        });
      });
  }

  getUserProjects() {
    this.projectsSub = this.firestoreService
      .collectionQuery$('projects', [
        'assignedUsers',
        'array-contains',
        this.auth.currentUser!.uid,
      ])
      .subscribe((projectDocs: any) => {
        Promise.all(
          projectDocs.map(async (projectDoc: Project) => ({
            ...projectDoc,
            assignedUsers: await Promise.all(
              projectDoc.assignedUsers.map(
                async (assignedUser) =>
                  await this.firestoreService.getDocument('users', assignedUser)
              )
            ),
          }))
        ).then((transformedProjects) => {
          this._projects = transformedProjects;
          this.loading = false;
        });
      });
  }

  onProjectClick(projectUid: string) {
    this.rotuer.navigate(['/projects', projectUid]);
  }

  ngOnDestroy(): void {
    this.projectsSub.unsubscribe();
  }
}
