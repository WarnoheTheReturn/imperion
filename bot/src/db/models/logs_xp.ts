import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsXpRow {
  id: number;
  previous : number;
  updated : number;
  user_id : string;
  moderateur_id : string;
  date : Date;
  reason : string;
}

export class LogsXpModel extends BaseModel<LogsXpRow> {
  public tableName = 'logs_xp';
  public primaryKey = 'id';
}


