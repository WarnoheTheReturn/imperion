import { BaseModel } from '../model';

export interface EventTypeData {
  id : number
  name : string
  xp_per_hour : number
  bonus_xp : number
  min_minutes : number
}

export class EventTypeModel extends BaseModel<EventTypeData> {
  public tableName = 'event_types';
  public primaryKey = 'id';
}

