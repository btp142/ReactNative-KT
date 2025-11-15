// src/types.ts

export interface Movie {
  id: number;
  title: string;
  year: number;
  watched: 0 | 1;
  rating: number | null; // 1-5, có thể null
  created_at: number;
}

// Kiểu dữ liệu cho bộ lọc
export type WatchedFilter = 'all' | 'watched' | 'unwatched';