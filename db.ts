// db.ts
import * as SQLite from 'expo-sqlite';

// Mở database
const db = SQLite.openDatabase('movies.db');

/**
 * Hàm thực thi SQL query.
 * @param sql Câu lệnh SQL.
 * @param params Tham số cho câu lệnh.
 * @returns Promise<SQLite.SQLResultSet>
 */
const executeSql = (sql: string, params: any[] = []): Promise<SQLite.SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_, result) => resolve(result),
        (_, error) => {
          reject(error);
          return true; // Trả về true để rollback transaction
        }
      );
    });
  });
};

export { db, executeSql };