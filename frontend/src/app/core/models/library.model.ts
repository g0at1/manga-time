export interface LibraryItem {
  mangaId: string;
  title: string;
  status: 'Planning' | 'Reading' | 'Completed' | 'Dropped';
  score?: number;
  totalVolumes: number;
  read: number;
}
