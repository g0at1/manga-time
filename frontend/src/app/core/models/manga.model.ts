export interface Manga {
  id: string;
  title: string;
  coverUrl?: string;
  totalVolumes?: number | null;
}

export interface Volume {
  id: string;
  mangaId: string;
  number: number;
  title?: string;
  isRead: boolean;
}

export interface MangaDetail {
  manga: Manga;
  volumes: Volume[];
}

export interface Progress {
  total: number;
  read: number;
  percent: number;
}
