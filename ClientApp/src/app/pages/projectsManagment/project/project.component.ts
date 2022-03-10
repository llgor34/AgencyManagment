import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}
  project: any;

  ngOnInit(): void {
    const { uid } = this.route.snapshot.params;
    this.firestoreService.getDocument('projects', uid).then((res) => {
      this.project = res;
    });
  }
}
