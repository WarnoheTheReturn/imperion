import { BaseModel } from '../model';

export interface LogsEventData {
  id: number;
  name: string;
  type_id: number;
  host_id: string;
  start_time: Date | null;
  end_time: Date | null;
  created_at: Date;
  status: string;
}

export class LogsEventModel extends BaseModel<LogsEventData> {
  public tableName = 'logs_event';
  public primaryKey = 'id';
}
