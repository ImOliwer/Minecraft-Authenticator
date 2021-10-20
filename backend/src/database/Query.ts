// Imports.
import SQL from "sql";

// Users table.
export const USERS_TABLE = SQL.define({
  name: 'users',
  schema: '',
  columns: {
    'email': {
      dataType: 'varchar',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    'password': {
      dataType: 'varchar',
      notNull: true
    },
    'linkedName': {
      dataType: 'varchar',
      notNull: false,
      defaultValue: null
    },
    'linkedUniqueId': {
      dataType: 'varchar',
      notNull: false,
      defaultValue: null
    }
  }
});

// Servers table.
export const SERVERS_TABLE = SQL.define({
  name: 'servers',
  schema: '',
  columns: {
    'email': {
      dataType: 'varchar',
      notNull: true,
      unique: true,
      primaryKey: true
    },
    'client': {
      dataType: 'varchar',
      notNull: true
    },
    'address': {
      dataType: 'varchar',
      notNull: true
    },
    'licenseKey': {
      dataType: 'varchar',
      notNull: true
    }
  }
});

// This constant represents all queries.
const Query = {
  Table: {
    USERS: USERS_TABLE.create().ifNotExists().toQuery(),
    SERVERS: SERVERS_TABLE.create().ifNotExists().toQuery()
  },
  Server: {
    INSERT: SERVERS_TABLE
      .insert({
        email: 'email',
        client: 'client',
        address: 'address',
        licenseKey: 'licenseKey'
      })
      .toQuery(),
    FETCH_ALL_IGNORING_LICENSE: SERVERS_TABLE
      .select(SERVERS_TABLE.email, SERVERS_TABLE.client, SERVERS_TABLE.address)
      .from(SERVERS_TABLE)
      .toQuery()
  },
  User: {
    SELECT_BY_EMAIL: USERS_TABLE
      .select()
      .from(USERS_TABLE)
      .where(USERS_TABLE.email.equals('anything'))
      .toQuery(),
    INSERT: USERS_TABLE
      .insert({ 
        email: 'email',
        password: 'password',
        linkedName: null,
        linkedUniqueId: null
      })
      .toQuery()
  }
};

// Default export.
export default Query;