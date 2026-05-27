import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';


export abstract class BaseModel<T> {
  protected pool: Pool;
  
  public abstract tableName: string;
  public abstract primaryKey: string;

  public data : T;

  constructor(pool: Pool, data: T = {} as T) {
    this.pool = pool;
    this.data = data;
  }

  public async getAll(): Promise<this[]> {
    const [rows] = await this.pool.query<(T & RowDataPacket)[]>(
      `SELECT * FROM ??`, 
      [this.tableName]
    );
    return rows.map(row => new (this.constructor as any)(this.pool, row));
  }

  public async getById(id: number | string , notNullable : boolean = false): Promise<this | null> {
    const [rows] = await this.pool.query<(T & RowDataPacket)[]>(
      `SELECT * FROM ?? WHERE ?? = ?`,
      [this.tableName, this.primaryKey, id]
    );
    if (rows.length === 0) {
      if (notNullable) {
        throw new Error(`No ${this.tableName} found with id ${id}`);
      }
      return null;
    };
    const instance = new (this.constructor as any)(this.pool, rows[0])
    return instance;
  }

  public async save(): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>(
      `UPDATE ?? SET ? WHERE ?? = ?`,
      [this.tableName, this.data, this.primaryKey, this.data[this.primaryKey as keyof T]]
    );
    return result.affectedRows > 0;
  }

  public async create(data: T): Promise<number | string> {
    const [result] = await this.pool.query<ResultSetHeader>(
      `INSERT INTO ?? SET ?`,
      [this.tableName, data]
    );
    return result.insertId; 
  }

  public async delete(id: number | string): Promise<boolean> {
    const [result] = await this.pool.query<ResultSetHeader>(
      `DELETE FROM ?? WHERE ?? = ?`,
      [this.tableName, this.primaryKey, id]
    );
    return result.affectedRows > 0;
  }
}
