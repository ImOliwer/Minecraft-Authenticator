// Imports.
import { ModelCtor, Sequelize } from "sequelize";
import PropertiesReader from "properties-reader";
import User, { createUserModel } from "../model/User";
import AuthorizedServer, { createServerModel } from "../model/AuthorizedServer";

/**
 * This class represents the controller of our database.
 */
export default class Database {
  /**
   * @returns {Sequelize} this property represents the instance for PostgreSQL handles.
   */
  readonly instance: Sequelize;

  /**
   * @returns {ModelCtor<User>} the user model.
   */
  public readonly userModel: ModelCtor<User>;

  /**
   * @returns {ModelCtor<AuthorizedServer>} the server model.
   */
  public readonly serverModel: ModelCtor<AuthorizedServer>;

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
      throw new Error("Username, password, hostname, database and/or table are invalid.");
    }

    this.instance = new Sequelize({
      dialect : 'postgres',
      username: username as string,
      password: password as string,
      database: database as string,
      host    : hostname as string,
      port    : port as number,
      logging : false
    });

    this.userModel   = createUserModel(this.instance);
    this.serverModel = createServerModel(this.instance);
  }

  /**
   * Synchronize all batches.
   */
  async sync() {
    await this.instance.sync();
  }
}