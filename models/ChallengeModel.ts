import { dbService } from '../services/dbService';
import { RowDataPacket } from 'mysql2/promise';

export interface Challenge {
  id: number;
  user_id: number;
  initial_balance: number;
  current_balance: number;
  status: string;
  max_daily_loss: number;
  max_total_loss: number;
  profit_target: number;
  created_at: Date;
  updated_at: Date;
}

export interface ChallengeInput {
  user_id: number;
  initial_balance: number;
  current_balance: number;
  status: string;
  max_daily_loss: number;
  max_total_loss: number;
  profit_target: number;
}

interface ChallengeRow extends RowDataPacket {
  id: number;
  user_id: number;
  initial_balance: number;
  current_balance: number;
  status: string;
  max_daily_loss: number;
  max_total_loss: number;
  profit_target: number;
  created_at: Date;
  updated_at: Date;
}

export class ChallengeModel {
  static tableName = 'challenges';

  static async findAll(): Promise<Challenge[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY id DESC`;
    const rows = await dbService.query<ChallengeRow[]>(query);
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      initial_balance: row.initial_balance,
      current_balance: row.current_balance,
      status: row.status,
      max_daily_loss: row.max_daily_loss,
      max_total_loss: row.max_total_loss,
      profit_target: row.profit_target,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  static async findById(id: number): Promise<Challenge | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await dbService.query<ChallengeRow[]>(query, [id]);
    if (rows.length > 0) {
      const row = rows[0];
      return {
        id: row.id,
        user_id: row.user_id,
        initial_balance: row.initial_balance,
        current_balance: row.current_balance,
        status: row.status,
        max_daily_loss: row.max_daily_loss,
        max_total_loss: row.max_total_loss,
        profit_target: row.profit_target,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    }
    return null;
  }

  static async findByUserId(userId: number): Promise<Challenge[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY id DESC`;
    const rows = await dbService.query<ChallengeRow[]>(query, [userId]);
    return rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      initial_balance: row.initial_balance,
      current_balance: row.current_balance,
      status: row.status,
      max_daily_loss: row.max_daily_loss,
      max_total_loss: row.max_total_loss,
      profit_target: row.profit_target,
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  static async create(challengeData: ChallengeInput): Promise<number> {
    const data = {
      user_id: challengeData.user_id,
      initial_balance: challengeData.initial_balance,
      current_balance: challengeData.current_balance,
      status: challengeData.status,
      max_daily_loss: challengeData.max_daily_loss,
      max_total_loss: challengeData.max_total_loss,
      profit_target: challengeData.profit_target,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    return await dbService.insert(this.tableName, data);
  }

  static async update(id: number, challengeData: Partial<ChallengeInput>): Promise<number> {
    const data: Partial<Challenge> = {
      ...challengeData,
      updated_at: new Date()
    };
    
    return await dbService.update(this.tableName, data, 'id = ?', [id]);
  }

  static async delete(id: number): Promise<number> {
    return await dbService.delete(this.tableName, 'id = ?', [id]);
  }
}