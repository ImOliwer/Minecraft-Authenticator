// Imports.
import { 
  Model,
  ModelCtor,
  Sequelize,
  STRING,
  INTEGER
} from "sequelize";

/**
 * Destruct addresses from an authorized server.
 * 
 * @param {AuthorizedServer} server the authorized server to destruct from.
 * @returns {string[]}
 */
export function destructAddresses(server: AuthorizedServer): string[] {
  return server.address.split(';');
}

/**
 * This interface represents an authorized server.
 */
export default interface AuthorizedServer extends Model {
  /**
   * @extends {number} identifier of the creation of this server.
   */
  identifier: number;

  /**
   * @returns {string} email of the owner of this server.
   */
  email: string;

  /**
   * @returns {string} name of the owner of this server.
   */
  client: string;

  /**
   * @returns {string} a string containing an array of addresses relative
   *                   to this authorized server (separated by ';').
   */
  address: string;

  /**
   * @returns {string} the license of this authorized server.
   */
  licenseKey: string;
}

/**
 * This constant represents the columns of our server model.
 */
export const SERVER_MODEL_COLUMNS = {
  identifier: {
    type: INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true
  },
  client: {
    type: STRING,
    allowNull: false
  },
  address: {
    type: STRING(512),
    allowNull: false
  },
  licenseKey: {
    type: STRING(2048),
    allowNull: false
  }
};

/**
 * Create a new model ctor of authorized server.
 * 
 * @param {Sequelize} sequelize the instance to define our model via.
 * @returns {ModelCtor<AuthorizedServer>}
 */
export function createServerModel(sequelize: Sequelize): ModelCtor<AuthorizedServer> {
  return sequelize.define(
    'Server', 
    SERVER_MODEL_COLUMNS,
    { tableName: 'servers' }
  );
}