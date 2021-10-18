// Imports.
import SQL from "sql";

// Users table.
export const USERS_TABLE = SQL.define({
  name: 'users',
  schema: '',
  columns: {
    'email': {
      dataType: 'varchar',
      unique: true,
      primaryKey: true
    },
    'linkedUniqueId': {
      dataType: 'varchar'
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

// This constant represents an object of all table creation queries.
export const TableCreation = {
  USERS: USERS_TABLE.create().ifNotExists().toQuery(),
  SERVERS: SERVERS_TABLE.create().ifNotExists().toQuery()
};

// This constant represents an object of all 'server' related queries.
export const Server = {
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
};