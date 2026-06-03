import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';
import { DataNotFoundError } from "../../errors/databaseErrors";

export interface GradesData {
  role_id: string;
  xp_requirements : number;
  level : number
}

export class GradesModel extends BaseModel<GradesData> {
  public tableName = 'grades';
  public primaryKey = 'role_id';

  public async nextGrade(level: number, notNullable : boolean = false): Promise<GradesData | null> {
    const [rows] = await this.pool.query<(GradesData & RowDataPacket)[]>(
      `SELECT * FROM ?? WHERE ?? = ?`,
      [this.tableName, "level", level + 1]
    );
    if (rows.length === 0) {
      if (notNullable) {
        throw new DataNotFoundError(this.tableName);
      }
      return null;
      }

      const nextGradeData : GradesModel = new GradesModel(this.pool, rows[0]);

      return nextGradeData.data; 
    }
    





}



