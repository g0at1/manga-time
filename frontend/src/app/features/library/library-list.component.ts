import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RouterLink } from '@angular/router';
import { LibraryItem } from '../../core/models/library.model';

@Component({
  standalone: true,
  selector: 'app-library-list',
  imports: [CommonModule, RouterLink],
  template: `
    <h2>My Library</h2>
    <div *ngFor="let i of items" class="p-2 border-b">
      <a [routerLink]="['/manga', i.mangaId]" class="text-blue-600">{{ i.title }}</a>
      — {{ i.read }} / {{ i.totalVolumes }} ({{ i.status }})
    </div>
  `,
})
export class LibraryListComponent implements OnInit {
  items: LibraryItem[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getLibrary().subscribe((r) => (this.items = r.items));
  }
}
