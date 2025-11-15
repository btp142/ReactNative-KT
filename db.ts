// src/db.ts

import * as SQLite from 'expo-sqlite';

// Mở database
// Nếu database chưa tồn tại, nó sẽ được tạo.
const db = SQLite.openDatabase('movies.db');

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