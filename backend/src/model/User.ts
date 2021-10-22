// Imports.
import { 
  Model, 
  ModelCtor, 
  Sequelize,
  STRING,
  INTEGER
} from "sequelize";

/**
 * This interface represents an authorizable user.
 */
export default interface User extends Model {
  /**
   * @returns {number} identifier of this registered user.
   */
  identifier: number;

  /**
   * @returns {string} email assigned on registration.
   */
  email: string;

  /**
   * @returns {string} hashed password of this user.
   */
  password: string;

  /**
   * @returns {string} minecraft name of this user.
   */
  linkedName: string;

  /**
   * @returns {string} minecraft unique id of this user.
   */
  linkedUniqueId: string;
}

/**
 * This constant represents the columns in our user model.
 */
export const USER_MODEL_COLUMNS = {
  identifier: {
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    type: INTEGER
  },
  email: {
    unique: true,
    type: STRING,
    allowNull: false
  },
  password: {
    type: STRING(2048),
    allowNull: false
  },
  linkedName: {
    type: STRING(16),
    allowNull: false
  },
  linkedUniqueId: {
    type: STRING(36),
    allowNull: false
  }
};

/**
 * Create the model ctor of {@link User}.
 * 
 * @param {Sequelize} sequelize the sequelize instance to define our model via.
 * @returns {ModelCtor<User>}
 */
export function createUserModel(sequelize: Sequelize): ModelCtor<User> {
  return sequelize.define<User>(
    'User', 
    USER_MODEL_COLUMNS,
    { tableName: 'users' }
  );
}