import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsLogChannelRow  {
  channel_id: string;
  type : string;
}

export class LogsLogChannelModel extends BaseModel<LogsLogChannelRow> {
  public tableName = 'logs_log_channel';
  public primaryKey = 'type';
}


