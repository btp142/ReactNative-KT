// src/MovieFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Movie } from './types';
import { useMovies } from './useMovies'; // Import hook

interface MovieFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  // onSave: () => void; // Không cần nữa vì useMovies tự refresh
  movieToEdit?: Movie | null; 
}

const CURRENT_YEAR = new Date().getFullYear();

export const MovieFormModal: React.FC<MovieFormModalProps> = ({ isVisible, onClose, movieToEdit }) => {
  const { insertMovie } = useMovies(); // Lấy hàm insertMovie
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');

  // ... (useEffect cho movieToEdit, không cần chỉnh sửa)

  useEffect(() => {
    if (movieToEdit) {
      // Logic cho Edit (C6)
      // ...
    } else {
      setTitle('');
      setYear('');
      setRating('');
    }
    setError('');
  }, [movieToEdit, isVisible]);

  // Hàm Validation
  const validate = () => {
    if (!title.trim()) {
      setError('Tên phim không được để trống.');
      return false;
    }
    const yearNum = year ? parseInt(year) : null;
    if (yearNum && (yearNum < 1900 || yearNum > CURRENT_YEAR)) {
      setError(`Năm phát hành phải từ 1900 đến ${CURRENT_YEAR}.`);
      return false;
    }
    const ratingNum = rating ? parseInt(rating) : null;
    if (ratingNum !== null && (ratingNum < 1 || ratingNum > 5)) {
      setError('Đánh giá phải từ 1 đến 5.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;

    const yearNum = year ? parseInt(year) : null;
    const ratingNum = rating ? parseInt(rating) : null;

    if (movieToEdit) {
      // Logic UPDATE (C6) - Sẽ được thêm vào sau
      Alert.alert('Chức năng sửa', 'Chức năng này sẽ được kích hoạt ở Câu 6.');
      onClose();
    } else {
      // Logic INSERT (C4)
      const success = insertMovie(title.trim(), yearNum, ratingNum);
      if (success) {
        Alert.alert('Thành công', 'Thêm phim mới thành công!');
        onClose();
      } else {
        Alert.alert('Lỗi', 'Không thể thêm phim.');
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <ScrollView contentContainerStyle={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{movieToEdit ? 'Sửa Phim' : 'Thêm Phim Mới'}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Tên phim (Bắt buộc)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder={`Năm phát hành (1900 - ${CURRENT_YEAR})`}
            value={year}
            onChangeText={text => setYear(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Đánh giá (1-5)"
            value={rating}
            onChangeText={text => setRating(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={1}
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.buttonContainer}>
            <Button title="Hủy" onPress={onClose} color="#888" />
            <Button title="Lưu" onPress={handleSave} />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

// ... (Styles)
const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  }
});