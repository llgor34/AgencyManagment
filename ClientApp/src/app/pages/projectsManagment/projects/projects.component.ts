import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/shared/firestore.service';
import { Project, ProjectTransformed } from 'src/app/shared/models/Projects';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projectsSub: Subscription;
  loading = false;
  projects: ProjectTransformed[] = [];

  icons = ['🐱‍👤', '🛹', '🐱‍🚀'];

  constructor(
    private firestoreService: FirestoreService,
    private rotuer: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
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
          this.projects = transformedProjects;
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
