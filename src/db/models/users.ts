import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface UserData {
  id: string;
  roblox_id : number;
  xp : number;
  current_grade : string;
  black_listed : boolean;
  in_faction : boolean;
  in_tww_faction : boolean;
  rank_lock_grade_id : number | null;
  is_inactivity : boolean;
  inactivity_duration : Date | null;
  ticket_link : string;
  recruiter_id : string | null;
  enlistment_date : Date;
}

export class UsersModel extends BaseModel<UserData> {
  public tableName = 'users';
  public primaryKey = 'id';
}
