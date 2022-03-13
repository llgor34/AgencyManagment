import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Project, ProjectTransformed } from 'src/app/shared/models/Projects';
import { ProjectsService } from 'src/app/shared/projects.service';

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
    private projectsService: ProjectsService,
    private authService: AuthService,
    private rotuer: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.isAdmin = this.authService.isAdmin();
    this.getProjects();
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

  getProjects() {
    this.projectsSub = this.projectsService
      .getProjects$()
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
