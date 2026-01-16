import { dbService } from '../services/dbService';
import { RowDataPacket } from 'mysql2/promise';

export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  email: string;
  name: string;
  password_hash: string;
  role: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static tableName = 'users';

  static async findAll(): Promise<User[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY id DESC`;
    const rows = await dbService.query<UserRow[]>(query);
    return rows.map(row => ({
      id: row.id,
      email: row.email,
      name: row.name,
      password_hash: row.password_hash,
      role: row.role,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  static async findById(id: number): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await dbService.query<UserRow[]>(query, [id]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        password_hash: row.password_hash,
        role: row.role,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    }
    return null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    const rows = await dbService.query<UserRow[]>(query, [email]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        password_hash: row.password_hash,
        role: row.role,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    }
    return null;
  }

  static async create(userData: UserInput): Promise<number> {
    const data = {
      email: userData.email,
      name: userData.name,
      password_hash: userData.password_hash,
      role: userData.role,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return await dbService.insert(this.tableName, data);
  }

  static async update(id: number, userData: Partial<UserInput>): Promise<number> {
    const data: Partial<User> = {
      ...userData,
      updated_at: new Date()
    };
    
    return await dbService.update(this.tableName, data, 'id = ?', [id]);
  }

  static async delete(id: number): Promise<number> {
    return await dbService.delete(this.tableName, 'id = ?', [id]);
  }
}