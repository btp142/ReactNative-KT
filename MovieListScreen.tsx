// src/MovieListScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { executeSql } from './db';
import { Movie } from './types';
import { Ionicons } from '@expo/vector-icons';

export const MovieListScreen = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const { rows } = await executeSql('SELECT * FROM movies ORDER BY created_at DESC;');
      const loadedMovies: Movie[] = [];
      for (let i = 0; i < rows.length; i++) {
        loadedMovies.push(rows.item(i) as Movie);
      }
      setMovies(loadedMovies);
    } catch (error) {
      console.error('Failed to load movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity style={styles.movieItem}>
      <View style={styles.infoContainer}>
        <Text style={item.watched ? styles.watchedTitle : styles.movieTitle}>
          {item.title} ({item.year})
        </Text>
        <View style={styles.details}>
          {item.rating !== null && item.rating > 0 && (
            <Text style={styles.ratingText}>
              ⭐ {item.rating}
            </Text>
          )}
          {item.watched === 1 && (
            <Ionicons name="checkmark-circle" size={20} color="green" style={styles.watchedIcon} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Chưa có phim nào trong danh sách.</Text>
        <Text style={styles.emptyText}>Nhấn nút (+) để thêm phim!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  movieItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  watchedTitle: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: 'orange',
    marginLeft: 10,
    marginRight: 10,
  },
  watchedIcon: {
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  }
});