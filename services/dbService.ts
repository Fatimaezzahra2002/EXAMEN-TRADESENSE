import dbConfig from '../config/dbConfig';
import { ResultSetHeader, RowDataPacket, Pool } from 'mysql2/promise';

// Service pour gérer les interactions avec la base de données
export const dbService = {
  // Méthode générique pour exécuter une requête SELECT
  async query<T extends RowDataPacket[][] | RowDataPacket[]>(
    sql: string,
    params?: any[]
  ): Promise<T> {
    const connection = await dbConfig.getConnection();
    try {
      const [results] = await connection.execute(sql, params);
      return results as T;
    } finally {
      connection.release();
    }
  },

  // Méthode pour insérer des données
  async insert(
    table: string,
    data: Record<string, any>
  ): Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    const connection = await dbConfig.getConnection();
    
    try {
      const [result] = await connection.execute<ResultSetHeader>(sql, values);
      return result.insertId;
    } finally {
      connection.release();
    }
  },

  // Méthode pour mettre à jour des données
  async update(
    table: string,
    data: Record<string, any>,
    whereClause: string,
    whereParams: any[]
  ): Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const connection = await dbConfig.getConnection();
    
    try {
      const [result] = await connection.execute<ResultSetHeader>(sql, [...values, ...whereParams]);
      return result.affectedRows;
    } finally {
      connection.release();
    }
  },

  // Méthode pour supprimer des données
  async delete(
    table: string,
    whereClause: string,
    whereParams: any[]
  ): Promise<number> {
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const connection = await dbConfig.getConnection();
    
    try {
      const [result] = await connection.execute<ResultSetHeader>(sql, whereParams);
      return result.affectedRows;
    } finally {
      connection.release();
    }
  }
};