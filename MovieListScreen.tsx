// src/MovieListScreen.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from './types';
import { useMovies } from './useMovies'; // Sử dụng hook mới

import { MovieFormModal } from './MovieFormModal'; // Import Modal

export const MovieListScreen = () => {
  const { movies, loading, loadMovies } = useMovies(); 
  const [isModalVisible, setIsModalVisible] = React.useState(false); // State Modal
  const [movieToEdit, setMovieToEdit] = React.useState<Movie | null>(null); // State sửa phim (C6)

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setMovieToEdit(null);
  }

  // *** Logic render Item (Câu 3) ***
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

  // *** Empty State (Câu 3) ***
  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Chưa có phim nào trong danh sách.</Text>
      <Text style={styles.emptyText}>Nhấn nút (+) để thêm phim!</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🎬 Movie Watchlist</Text>
      
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyList />}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)} // Mở Modal
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      
      {/* Modal thêm/sửa phim */}
      <MovieFormModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        movieToEdit={movieToEdit} // Hiện tại là null cho chức năng thêm
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50, // Điều chỉnh để có không gian cho header/status bar
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 100,
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
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'dodgerblue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});