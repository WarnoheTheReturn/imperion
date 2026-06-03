import { BaseModel } from '../model';

export interface EventChannelsData {
  channel_id : string,
  xp_pourcentage : number
}

export class EventChannelsModel extends BaseModel<EventChannelsData> {
  public tableName = 'event_channels';
  public primaryKey = 'channel_id';
}
