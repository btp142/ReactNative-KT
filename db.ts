// src/db.ts

import * as SQLite from 'expo-sqlite';

// Mở database
// Nếu database chưa tồn tại, nó sẽ được tạo.
const db = SQLite.openDatabase('movies.db');

export const initDB = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER,
      watched INTEGER DEFAULT 0, -- 0: chưa xem, 1: đã xem
      rating INTEGER, -- 1-5
      created_at INTEGER
    );`
  );
  console.log('Movie table created or already exists.');
  await seedSampleData();
};

const seedSampleData = async () => {
  try {
    const { rows } = await executeSql('SELECT COUNT(*) as count FROM movies;');
    const count = rows.item(0).count;

    if (count === 0) {
      console.log('Seeding sample data...');
      const currentTime = Date.now();
      await executeSql(
        'INSERT INTO movies (title, year, watched, rating, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Inception', 2010, 0, 5, currentTime]
      );
      await executeSql(
        'INSERT INTO movies (title, year, watched, rating, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Interstellar', 2014, 1, 5, currentTime + 1]
      );
      await executeSql(
        'INSERT INTO movies (title, year, watched, rating, created_at) VALUES (?, ?, ?, ?, ?);',
        ['The Social Network', 2010, 0, 4, currentTime + 2]
      );
      console.log('Sample data seeded successfully.');
    } else {
      console.log('Database already has data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
};

/**
 * Hàm thực thi một giao dịch SQL
 * @param sql Câu lệnh SQL
 * @param params Tham số cho câu lệnh
 * @returns Promise<SQLite.SQLResultSet>
 */
export const executeSql = (
  sql: string,
  params: (string | number | null)[] = []
): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          console.error(`SQL Error: ${sql}`, error);
          reject(error);
          return true; // Return true to rollback the transaction if needed
        }
      );
    });
  });
};

export default db;