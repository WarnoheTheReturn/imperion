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
  recruiter_id : string | null;
  enlistment_date : Date;
  timezone : string | null;
  how_found : string | null;
}

export class UsersModel extends BaseModel<UserData> {
  public tableName = 'users';
  public primaryKey = 'id';
}
