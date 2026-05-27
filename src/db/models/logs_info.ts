import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsInfoRow extends RowDataPacket {
  id: number;
  user_id: string;
  moderator_id: string;
  date: Date;
  reason: string;
  type_id: string;
  is_removed: boolean;
}

export class LogsInfoModel extends BaseModel<LogsInfoRow> {
  public tableName = 'logs_type';
  public primaryKey = 'id';
}


