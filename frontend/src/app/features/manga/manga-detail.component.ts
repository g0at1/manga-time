import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { MangaDetail, Progress } from '../../core/models/manga.model';
import { combineLatest } from 'rxjs';

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

  onToggle(volumeId: string, checked: boolean) {
    const wasRead = this.readSet.has(volumeId);
    checked ? this.readSet.add(volumeId) : this.readSet.delete(volumeId);

    const call$ = checked ? this.api.markRead(volumeId) : this.api.unmarkRead(volumeId);
    call$.subscribe({
      next: () => this.api.getProgress(this.mangaId).subscribe((p) => (this.progress = p)),
      error: () => {
        if (wasRead) this.readSet.add(volumeId);
        else this.readSet.delete(volumeId);
        alert('Failed to update read status');
      },
    });
  }

  trackByVolumeId = (_: number, v: { id: string }) => v.id;
}
