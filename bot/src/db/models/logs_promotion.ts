import { RowDataPacket } from 'mysql2/promise';
import { BaseModel } from '../model';

export interface LogsPromotionRow {
  id: number;
  previous_grade_id : string;
  updated_grade_id : string;
  user_id : string;
  moderateur_id : string;
  date : Date;

}

export class LogsPromotionModel extends BaseModel<LogsPromotionRow> {
  public tableName = 'logs_promotion';
  public primaryKey = 'id';
}


