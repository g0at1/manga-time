import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Manga, MangaDetail, Progress } from '../models/manga.model';
import { LibraryItem } from '../models/library.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  searchManga(q = '', page = 1, pageSize = 20) {
    return this.http.get<{ items: Manga[]; total: number }>(`${this.base}/manga`, {
      params: { search: q, page, pageSize } as any,
    });
  }

  getManga(id: string) {
    return this.http.get<MangaDetail>(`${this.base}/manga/${id}`);
  }

  bulkVolumes(mangaId: string, from: number, to: number) {
    return this.http.post(`${this.base}/manga/${mangaId}/volumes/bulk`, { from, to });
  }

  markRead(volumeId: string) {
    return this.http.post(`${this.base}/reading/${volumeId}`, {});
  }

  unmarkRead(volumeId: string) {
    return this.http.delete(`${this.base}/reading/${volumeId}`);
  }

  getProgress(mangaId: string) {
    return this.http.get<Progress>(`${this.base}/library/${mangaId}/progress`);
  }

  getLibrary(page = 1, pageSize = 20) {
    return this.http.get<{ items: LibraryItem[]; total: number }>(`${this.base}/library`, {
      params: { page, pageSize } as any,
    });
  }

  addToLibrary(mangaId: string, status = 'Planning') {
    return this.http.post(`${this.base}/library/${mangaId}`, { status });
  }

  setStatus(mangaId: string, status: string, score?: number, notes?: string) {
    return this.http.patch(`${this.base}/library/${mangaId}`, { status, score, notes });
  }

  getReadVolumes(mangaId: string) {
    return this.http.get<string[]>(`${this.base}/reading/manga/${mangaId}`);
  }

  create(req: any) {
    return this.http.post<Manga>(`${this.base}/manga`, req);
  }
}
