import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RouterLink } from '@angular/router';
import { LibraryItem } from '../../core/models/library.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-library-list',
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <h2>{{ 'LIBRARY.TITLE' | translate }}</h2>
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
