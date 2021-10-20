// Imports.
import { Pool, QueryResult } from "pg";
import PropertiesReader from "properties-reader";
import SQL from "sql";
import Query from "./Query";

/**
 * This class represents the controller of our database.
 */
export default class Database {
  /**
   * @returns {Pool} this property represents the PostgreSQL pool.
   */
  instance: Pool;

  /**
   * Primary constructor.
   * 
   * @param {PropertiesReader.Reader} properties the properties instance to read 
   *                                             credentials and information from.
   */
  constructor(properties: PropertiesReader.Reader) {
    const username = properties.get('username');
    const password = properties.get('password');
    const hostname = properties.get('hostname');
    const database = properties.get('database');
    const port     = properties.get('port');

    if (!username || !password || !hostname || !database || (!port || typeof port !== 'number')) {
      throw new Error("Username, password, hostname, database or table is invalid.");
    }

    this.instance = new Pool({
      user    : username as string,
      password: password as string,
      database: database as string,
      host    : hostname as string,
      port    : port as number
    });
  }

  /**
   * Query all preparation batches.
   */
  async prepare() {
    // table queries
    const { USERS, SERVERS } = Query.Table;

    // create the users & servers tables if they don't exist
    await Promise.all([
      this.instance.query(USERS.text),
      this.instance.query(SERVERS.text)
    ]);
  }

  /**
   * Relative to "see" - just without a 'values' specification.
   * @see Database.query
   */
  async queryNoValues(it: SQL.QueryLike): Promise<QueryResult<any>> {
    return await this.instance.query(it);
  }

  /**
   * Dispatch a query by string.
   * 
   * @param {string} it the query to dispatch.
   * @param {any[]} values array of values to pass with the query.
   * @returns {Promise<QueryResult>}
   */
  async query(it: SQL.QueryLike, ...values: any): Promise<QueryResult<any>> {
    return await this.instance.query(it.text, values);
  }
}