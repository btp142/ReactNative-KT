// src/useMovies.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Movie, WatchedFilter } from './types';
import db, { getMovies } from './db';

export const useMovies = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    // States cho Search/Filter (C8)
    const [searchText, setSearchText] = useState('');
    const [filterWatched, setFilterWatched] = useState<WatchedFilter>('all');

    // State cho Sort (C10)
    const [sortBy, setSortBy] = useState<'created_at' | 'year'>('created_at');
    const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC');

    // Hàm lấy dữ liệu (sẽ được sử dụng cho refresh)
    const loadMovies = useCallback(() => {
        setLoading(true);
        try {
            // Lấy tất cả phim từ DB
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

    const toggleWatched = useCallback((id: number, currentWatched: 0 | 1) => {
        const newWatched = currentWatched === 0 ? 1 : 0;
        try {
            db.runSync(
                'UPDATE movies SET watched = ? WHERE id = ?;',
                [newWatched, id]
            );
            loadMovies(); // Tải lại danh sách
            return true;
        } catch (error) {
            console.error('Failed to toggle watched state:', error);
            return false;
        }
    }, [loadMovies]);

    const updateMovie = useCallback((id: number, title: string, year: number | null, rating: number | null) => {
        try {
            db.runSync(
                'UPDATE movies SET title = ?, year = ?, rating = ? WHERE id = ?;',
                [title, year, rating, id]
            );
            loadMovies(); // Tải lại danh sách
            return true;
        } catch (error) {
            console.error('Failed to update movie:', error);
            return false;
        }
    }, [loadMovies]);

    const deleteMovie = useCallback((id: number) => {
        try {
            db.runSync('DELETE FROM movies WHERE id = ?;', [id]);
            loadMovies();
            return true;
        } catch (error) {
            console.error('Failed to delete movie:', error);
            return false;
        }
    }, [loadMovies]);

    const filteredMovies = useMemo(() => {
        let list = movies;

        // 1. Filter theo Watched (C8)
        if (filterWatched === 'watched') {
            list = list.filter(m => m.watched === 1);
        } else if (filterWatched === 'unwatched') {
            list = list.filter(m => m.watched === 0);
        }

        // 2. Tìm kiếm theo Title (C8)
        if (searchText.trim()) {
            const lowerSearchText = searchText.trim().toLowerCase();
            list = list.filter(m => m.title.toLowerCase().includes(lowerSearchText));
        }

        // 3. Sắp xếp (C10)
        list.sort((a, b) => {
            const valA = a[sortBy] || 0;
            const valB = b[sortBy] || 0;

            if (valA < valB) return sortOrder === 'ASC' ? -1 : 1;
            if (valA > valB) return sortOrder === 'ASC' ? 1 : -1;
            return 0;
        });

        return list;
    }, [movies, searchText, filterWatched, sortBy, sortOrder]); // Deps: tối ưu hóa

    return {
        movies,
        loading,
        loadMovies,
        insertMovie,
        toggleWatched,
        updateMovie,
        deleteMovie,
        filteredMovies, 
        searchText,
        setSearchText,
        filterWatched,
        setFilterWatched,
        sortBy, // C10
        setSortBy, // C10
        sortOrder, // C10
        setSortOrder, // Export để sử dụng cho pull-to-refresh
        // Các hàm CRUD (C4-C7), Search/Filter (C8), Import (C9) sẽ được thêm vào
    };
};