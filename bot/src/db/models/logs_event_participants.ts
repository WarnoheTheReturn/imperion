import { BaseModel } from '../model';

export interface LogsEventParticipantsData {
  id: number;
  user_id: string;
  event_id: number;
  duration_minutes: number;
  xp: number;
  bonus_xp: number;
}

export class LogsEventParticipantsModel extends BaseModel<LogsEventParticipantsData> {
  public tableName = 'logs_event_participants';
  public primaryKey = 'id';
}
