import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/shared/models/Projects';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [
    {
      title: 'Programowanie dla wszystkich',
      description: 'Zrobić filmik o programowaniu',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum maiores optio obcaecati dignissimos aperiam commodi eligendi. Dolorem molestias tempora iure temporibus laudantium dignissimos exercitationem facere nesciunt corporis, voluptates aut quis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur nulla sunt voluptatem suscipit temporibus iste laboriosam eos animi repellat quas voluptas! Reiciendis numquam, maiores itaque ratione quidem asperiores illo.',
      dueDate: new Date('10.03.2022'),
      createdBy: 'UID-IGOR34',
      assignedUsers: ['Igor M', 'Jacek Kowalski', 'Marian Dąbrowski'],
      completed: false,
    },
    {
      title: 'Angular 13',
      description: 'Zrobić prezentację na temat nowej wersji Angulara',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum maiores optio obcaecati dignissimos aperiam commodi eligendi. Dolorem molestias tempora iure temporibus laudantium dignissimos exercitationem facere nesciunt corporis, voluptates aut quis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur nulla sunt voluptatem suscipit temporibus iste laboriosam eos animi repellat quas voluptas! Reiciendis numquam, maiores itaque ratione quidem asperiores illo.',
      dueDate: new Date('09.21.2022'),
      createdBy: 'UID-ADAM-MALECKI',
      assignedUsers: ['Janek Pszczyński', 'Adam Małecki', 'Daria Krakowska'],
      completed: false,
    },
    {
      title: 'Plany na weekend',
      description: 'Wymyśleć jakiś dobry plan na weekend :D',
      content:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum maiores optio obcaecati dignissimos aperiam commodi eligendi. Dolorem molestias tempora iure temporibus laudantium dignissimos exercitationem facere nesciunt corporis, voluptates aut quis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur nulla sunt voluptatem suscipit temporibus iste laboriosam eos animi repellat quas voluptas! Reiciendis numquam, maiores itaque ratione quidem asperiores illo.',
      dueDate: new Date('12.03.2022'),
      createdBy: 'UID-NATALIA-TUK',
      assignedUsers: ['Natalia Tuk', 'Marian Kozłowski', 'Natan Bojczygroda'],
      completed: false,
    },
  ];

  getIcon() {
    const randomNumber = Math.floor(Math.random() * 5);
    if (randomNumber == 0) {
      return '🐱';
    }
    if (randomNumber == 1) {
      return '🐱‍👤';
    }
    if (randomNumber == 2) {
      return '🐱‍🚀';
    }
    if (randomNumber == 3) {
      return '🐌';
    }
    if (randomNumber == 4) {
      return '🐸';
    }
    if (randomNumber == 5) {
      return '🛹';
    }
    return '';
  }

  constructor() {}

  ngOnInit(): void {}
}
