import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsRankLockRow {
  id: number;
  grade_id : string;
  is_removed : boolean;
  duration : Date;
  user_id : string;
  moderateur_id : string;
  date : Date;
  reason : string;
}

export class LogsRankLockModel extends BaseModel<LogsRankLockRow> {
  public tableName = 'logs_rank_lock';
  public primaryKey = 'id';
}


