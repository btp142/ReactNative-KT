// src/useMovies.ts

import { useState, useEffect, useCallback } from 'react';
import { Movie, WatchedFilter } from './types';
import db, { getMovies } from './db';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Hàm lấy dữ liệu (sẽ được sử dụng cho refresh)
  const loadMovies = useCallback(() => {
    setLoading(true);
    try {
      // Lấy tất cả phim từ DB (sẽ tối ưu hóa cho search/filter sau)
      const loadedMovies = getMovies(); 
      setMovies(loadedMovies);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải phim khi component mount
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);
  
  // Các hàm CRUD khác sẽ được thêm vào ở các câu sau

  const insertMovie = useCallback((title: string, year: number | null, rating: number | null) => {
    try {
      db.runSync(
        'INSERT INTO movies (title, year, watched, rating, created_at) VALUES (?, ?, ?, ?, ?);',
        [title, year, 0, rating, Date.now()]
      );
      loadMovies(); // Tải lại danh sách
      return true;
    } catch (error) {
      console.error('Failed to insert movie:', error);
      return false;
    }
  }, [loadMovies]); // loadMovies là dependency

  return { 
    movies, 
    loading, 
    loadMovies,
    insertMovie, // Export để sử dụng cho pull-to-refresh
    // Các hàm CRUD (C4-C7), Search/Filter (C8), Import (C9) sẽ được thêm vào
  };
};