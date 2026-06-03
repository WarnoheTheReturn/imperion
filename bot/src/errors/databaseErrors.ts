export class DataNotFoundError extends Error {
    constructor(tableName : string) {
        super(`Data not found in ${tableName}`);
        this.name = "DataNotFoundError";
    }
}