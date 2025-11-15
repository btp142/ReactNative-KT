// src/db.ts

import * as SQLite from "expo-sqlite";
import { Alert } from "react-native";
import { Movie } from "./types";

// Mở database SQLite (API đồng bộ mới)
// Chúng ta sẽ sử dụng 'movies.db' theo tên đề bài.
const db = SQLite.openDatabaseSync("movies.db");

/**
 * Hàm khởi tạo database:
 * - Tạo bảng movies nếu chưa có
 * - Seed dữ liệu mẫu nếu bảng trống
 */
export const initDB = () => {
  try {
    console.log("🛠️ Initializing Movie Database...");

    // 1. Tạo bảng movies theo cấu trúc đề xuất
    db.execSync(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER,
        watched INTEGER DEFAULT 0, -- 0: chưa xem, 1: đã xem
        rating INTEGER, -- 1–5, có thể null nếu chưa đánh giá
        created_at INTEGER
      );
    `);

    // 2. Kiểm tra có bao nhiêu bản ghi
    // LƯU Ý: Nếu không có bản ghi nào, getFirstSync trả về null.
    const result = db.getFirstSync<{ count: number }>(
      "SELECT COUNT(*) as count FROM movies;"
    );

    // 3. Nếu bảng trống -> seed dữ liệu mẫu
    if (!result || result.count === 0) {
      const now = Date.now();
      
      db.runSync(
        `
          INSERT INTO movies (title, year, watched, rating, created_at)
          VALUES (?, ?, ?, ?, ?),
                 (?, ?, ?, ?, ?),
                 (?, ?, ?, ?, ?)
        `,
        "Inception", 2010, 0, 5, now, 
        "Interstellar", 2014, 1, 5, now + 1,
        "The Social Network", 2010, 0, 4, now + 2
      );
      console.log("✅ Seeded sample movies");
    } else {
      console.log(`🎬 Database ready with ${result.count} records.`);
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
    Alert.alert("Lỗi CSDL", "Khởi tạo database thất bại.");
  }
};

/**
 * Hàm lấy tất cả phim từ DB.
 * @param query Điều kiện WHERE SQL (ví dụ: "WHERE watched = 0")
 * @param params Tham số SQL
 */
export const getMovies = (query = 'ORDER BY created_at DESC', params: (string | number)[] = []) => {
  return db.getAllSync<Movie>(`SELECT * FROM movies ${query};`, params);
};

export default db;