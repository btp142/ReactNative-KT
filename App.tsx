// App.tsx

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initDB } from './db';
import { MovieListScreen } from './MovieListScreen';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDB()
      .then(() => {
        setDbReady(true);
      })
      .catch(error => {
        console.error('Database initialization failed:', error);
      });
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <Text>Loading application...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MovieListScreen />
      {/* Màn hình danh sách phim sẽ được đặt ở đây */}
      <Text>Database ready. Start building the list screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});