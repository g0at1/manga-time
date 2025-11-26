import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { MangaDetail, Progress } from '../../core/models/manga.model';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-manga-detail',
  imports: [CommonModule],
  templateUrl: './manga-detail.component.html',
  styleUrls: ['./manga-detail.component.scss'],
})
export class MangaDetailComponent implements OnInit {
  mangaId!: string;
  data?: MangaDetail;
  progress?: Progress;
  readSet = new Set<string>();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
  ) {}

  ngOnInit() {
    this.mangaId = this.route.snapshot.paramMap.get('id')!;
    combineLatest([
      this.api.getManga(this.mangaId),
      this.api.getReadVolumes(this.mangaId),
      this.api.getProgress(this.mangaId),
    ]).subscribe(([detail, readIds, prog]) => {
      this.data = detail;
      this.progress = prog;
      this.readSet = new Set(readIds);
    });
  }

  onToggle(volume: { id: string; number: number }, checked: boolean) {
    const wasRead = this.readSet.has(volume.id);
    const previousState = new Set(this.readSet);

    if (!checked) {
      this.readSet.delete(volume.id);

      this.api.unmarkRead(volume.id).subscribe({
        next: () => this.api.getProgress(this.mangaId).subscribe((p) => (this.progress = p)),
        error: () => {
          this.readSet = previousState;
          alert('Failed to update read status');
        },
      });

      return;
    }

    let idsToMark: string[] = [volume.id];

    if (this.data) {
      const previousUnreads = this.data.volumes
        .filter((v) => v.number < volume.number && !this.readSet.has(v.id))
        .sort((a, b) => a.number - b.number);

      if (previousUnreads.length > 0) {
        const nums = previousUnreads.map((v) => v.number).join(', ');
        const shouldMarkPrev = confirm(`Mark all previous tomes as read?`);

        if (shouldMarkPrev) {
          idsToMark = [...previousUnreads.map((v) => v.id), volume.id];
        }
      }
    }

    idsToMark.forEach((id) => this.readSet.add(id));

    forkJoin(idsToMark.map((id) => this.api.markRead(id))).subscribe({
      next: () => {
        this.api.getProgress(this.mangaId).subscribe((p) => (this.progress = p));
      },
      error: () => {
        this.readSet = previousState;
        alert('Failed to update read status');
      },
    });
  }

  trackByVolumeId = (_: number, v: { id: string }) => v.id;
}
