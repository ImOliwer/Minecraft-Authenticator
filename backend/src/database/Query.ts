// Imports.
import SQL from "sql";

// Users table.
const USERS_TABLE = SQL.define({
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
const SERVERS_TABLE = SQL.define({
  name: 'servers',
  schema: '',
  columns: {
    'client': {
      dataType: 'varchar',
      notNull: true,
      unique: true,
      primaryKey: true
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
  EXISTS_BY_CLIENT: SERVERS_TABLE
    .select(SERVERS_TABLE.client)
    .from(SERVERS_TABLE)
    .where(SERVERS_TABLE.client.equals("anything"))
    .toQuery(),
  INSERT: SERVERS_TABLE
    .insert({
      client: 'client',
      address: 'address',
      licenseKey: 'licenseKey'
    })
    .toQuery(),
  FETCH_ALL_IGNORING_LICENSE: SERVERS_TABLE
    .select(SERVERS_TABLE.client, SERVERS_TABLE.address)
    .from(SERVERS_TABLE)
    .toQuery()
};