// App.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { initDB } from './db';
import { MovieListScreen } from './MovieListScreen';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      // Gọi initDB đồng bộ khi app khởi động
      initDB();
      setDbReady(true);
    } catch (error) {
      console.error('App init failed:', error);
    }
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Movie Watchlist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Màn hình danh sách phim (Câu 3-10) */}
      <MovieListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});