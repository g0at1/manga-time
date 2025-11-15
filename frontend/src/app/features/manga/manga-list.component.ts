import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  selector: 'app-manga-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './manga-list.component.html',
  styleUrls: ['./manga-list.component.scss'],
})
export class MangaListComponent implements OnInit, OnDestroy {
  mangas: any[] = [];
  query = '';
  isLoading = false;

  private query$ = new Subject<string>();
  private destroy$ = new Subject<void>();
  showAddForm = false;
  newManga = {
    title: '',
    author: null as string | null,
    totalVolumes: null as number | null,
    coverUrl: null as string | null,
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load('');

    this.query$
      .pipe(debounceTime(250), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => this.load(q));
  }

  onQueryChange(value: string) {
    this.query$.next(value ?? '');
  }

  load(q: string) {
    this.isLoading = true;
    this.api.searchManga(q).subscribe({
      next: (r) => {
        this.mangas = r.items ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.mangas = [];
        this.isLoading = false;
      },
    });
  }

  trackById = (_: number, m: any) => m?.id;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'manga-placeholder.svg';
  }

  openAddForm() {
    this.showAddForm = true;
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newManga = {
      title: '',
      author: null,
      totalVolumes: null,
      coverUrl: null,
    };
  }

  createManga() {
    if (!this.newManga.title.trim()) {
      return;
    }

    this.api.create(this.newManga).subscribe({
      next: (created) => {
        this.showAddForm = false;
        this.api
          .bulkVolumes(created.id, 1, created.totalVolumes)
          .subscribe(() => console.log('Volumes created'));
        this.mangas.unshift(created);
        this.newManga = {
          title: '',
          author: null,
          totalVolumes: null,
          coverUrl: null,
        };
      },
      error: (err) => console.error(err),
    });
  }
}
