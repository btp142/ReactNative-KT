// src/MovieListScreen.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Button, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie, WatchedFilter } from './types';
import { useMovies } from './useMovies'; // Sử dụng hook mới

import { MovieFormModal } from './MovieFormModal'; // Import Modal
import { Picker } from '@react-native-picker/picker';

export const MovieListScreen = () => {
    const { movies, loading, loadMovies, toggleWatched, deleteMovie, filteredMovies,
        searchText,
        setSearchText,
        filterWatched,
        setFilterWatched,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder, } = useMovies();
    const [isModalVisible, setIsModalVisible] = React.useState(false); // State Modal
    const [movieToEdit, setMovieToEdit] = React.useState<Movie | null>(null); // State sửa phim (C6)

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setMovieToEdit(null);
    }

    const handleEdit = (movie: Movie) => {
        setMovieToEdit(movie);
        setIsModalVisible(true);
    };

    const handleDelete = (movie: Movie) => {
        Alert.alert(
            'Xác nhận Xóa',
            `Bạn có chắc chắn muốn xóa phim "${movie.title}" khỏi danh sách?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        if (deleteMovie(movie.id)) {
                            Alert.alert('Thành công', 'Đã xóa phim.');
                        } else {
                            Alert.alert('Lỗi', 'Không thể xóa phim.');
                        }
                    }
                },
            ]
        );
    };

    // *** Logic render Item (Câu 3) ***
    const renderItem = ({ item }: { item: Movie }) => (
        <TouchableOpacity
            style={styles.movieItem}
            onLongPress={() => handleEdit(item)}
            onPress={() => toggleWatched(item.id, item.watched)} // Toggle khi chạm vào
        >
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
                    <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginLeft: 10 }}>
                        <Ionicons name="create-outline" size={24} color="#333" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginLeft: 10 }}>
                        <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
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
            {/* Header và Import Button */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>🎬 Movie Watchlist</Text>
                {/* Placeholder cho Import API (C9) */}
                <Button title="Import API" onPress={() => console.log('Chức năng Import (C9)')} color="#007AFF" /> 
            </View>
            
            {/* Search and Filter Bar (C8) */}
            <View style={styles.searchFilterContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm theo tên phim..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <View style={styles.filterPickerContainer}>
                    <Picker
                        selectedValue={filterWatched}
                        onValueChange={(itemValue) => setFilterWatched(itemValue as WatchedFilter)}
                        style={styles.filterPicker}
                    >
                        <Picker.Item label="Tất cả" value="all" />
                        <Picker.Item label="Đã xem" value="watched" />
                        <Picker.Item label="Chưa xem" value="unwatched" />
                    </Picker>
                </View>
            </View>
            
            {/* Sort Controls (C10) */}
            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sắp xếp:</Text>
                <Picker
                    selectedValue={sortBy}
                    onValueChange={(itemValue) => setSortBy(itemValue as 'created_at' | 'year')}
                    style={styles.sortPicker}
                >
                    <Picker.Item label="Mới tạo" value="created_at" />
                    <Picker.Item label="Năm phát hành" value="year" />
                </Picker>
                <TouchableOpacity onPress={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}>
                    <Ionicons 
                        name={sortOrder === 'ASC' ? "arrow-up" : "arrow-down"} 
                        size={24} 
                        color="#333" 
                        style={{ marginLeft: 5 }} 
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredMovies}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                // Pull to Refresh (C10)
                onRefresh={loadMovies} 
                refreshing={loading}
                ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy phim.</Text>}
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
    // --- C9 & Header Styles ---
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // --- C8 Search & Filter Styles ---
    searchFilterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 15,
        alignItems: 'center',
        zIndex: 1, // Đảm bảo picker hiển thị trên các phần tử khác
    },
    searchInput: {
        flex: 2,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    filterPickerContainer: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    filterPicker: {
        height: 40,
        // Dùng margin âm nếu Picker bị cắt trên iOS/Android
        marginVertical: -10, 
    },
    // --- C10 Sort Styles ---
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingVertical: 5,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    sortLabel: {
        fontSize: 14,
        marginRight: 5,
        fontWeight: '500',
    },
    sortPicker: {
        flex: 1,
        height: 30,
        marginVertical: -10,
    },
    // --- C3 List Styles ---
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 100, // Đủ chỗ cho nút Add
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
    // --- C3 Empty State Styles ---
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
    // --- C4 Add Button Styles ---
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