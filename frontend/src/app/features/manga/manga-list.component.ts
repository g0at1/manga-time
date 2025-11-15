import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Manga } from '../../core/models/manga.model';
import { NotificationService } from '../../core/services/notification.service';

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
  openMenuId: number | string | null = null;
  isEditing = false;
  editingId: string | undefined;
  deleteConfirmVisible = false;
  mangaToDelete: Manga | null = null;

  constructor(
    private api: ApiService,
    private notificationService: NotificationService,
  ) {}

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
    this.showAddForm = !this.showAddForm;
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
        this.notificationService.notifySuccess('Successfully created manga');
        this.api.bulkVolumes(created.id, 1, created.totalVolumes).subscribe({
          next: () => {
            this.notificationService.notifySuccess('Successfully created volumes');
            console.log('Volumes created');
          },
          error: (err) => {
            this.notificationService.notifyError('Failed to create volumes');
            console.error('Failed to create volumes:', err);
          },
        });
        this.mangas.unshift(created);
        this.newManga = {
          title: '',
          author: null,
          totalVolumes: null,
          coverUrl: null,
        };
      },
      error: (err) => {
        this.notificationService.notifyError('Failed to create manga');
        console.error(err);
      },
    });
  }
  toggleMenu(id: number | string, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  onEdit(manga: Manga, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.isEditing = true;
    this.editingId = manga.id;
    this.showAddForm = true;
    this.openMenuId = null;
  }

  @HostListener('document:click', ['$event'])
  closeMenusOnClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.mlist__actions')) {
      return;
    }

    this.openMenuId = null;
  }

  updateManga() {
    if (!this.editingId) {
      return;
    }

    const body = {
      title: this.newManga.title?.trim() ?? '',
      author: this.newManga.author?.trim() || null,
      totalVolumes: this.newManga.totalVolumes ?? null,
      coverUrl: this.newManga.coverUrl?.trim() || null,
    };

    this.api.update(this.editingId, body).subscribe({
      next: (updated) => {
        const idx = this.mangas.findIndex((m) => m.id === updated.id);
        if (idx !== -1) {
          this.mangas = [...this.mangas.slice(0, idx), updated, ...this.mangas.slice(idx + 1)];
        }
        this.notificationService.notifySuccess('Successfully updated manga');

        this.cancelAdd();
      },
      error: (err: any) => {
        this.notificationService.notifyError(`Failed to update manga: ${err}`);
        console.error('Update failed', err);
      },
    });
  }

  openDeleteModal(manga: Manga, event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    this.mangaToDelete = manga;
    this.deleteConfirmVisible = true;
    this.openMenuId = null;
  }

  closeDeleteModal() {
    this.deleteConfirmVisible = false;
    this.mangaToDelete = null;
  }

  confirmDelete() {
    const manga = this.mangaToDelete;
    if (!manga) {
      return;
    }

    this.api.delete(manga.id).subscribe({
      next: () => {
        this.mangas = this.mangas.filter((x) => x.id !== manga.id);
        this.notificationService.notifySuccess('Successfully deleted manga');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.notificationService.notifyError('Failed to delete manga');
        console.log(err);
        this.closeDeleteModal();
      },
    });
  }
}
