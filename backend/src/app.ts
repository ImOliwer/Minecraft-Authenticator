// Imports.
import FileSystem from "fs";
import Express from 'express';
import { json } from "body-parser";
import Routes from "./routes/Routes";
import SoftwareLicenser from "./controller/SoftwareLicenser";
import Database from "./database/Database";
import PropertiesReader from "properties-reader";

// Paths.
const RESOURCES = `${__dirname}\\..\\resources`;

// Software licenser.
const licenser = new SoftwareLicenser(
  FileSystem.readFileSync(
    `${RESOURCES}\\private_key.pem`,
    { encoding: 'utf8' }
  ).toString()
);

// Database.
const database = new Database(
  PropertiesReader(`${RESOURCES}\\database.properties`)
);

// Endpoint accessors.
const application = Express();
const http = require('http');
const server = http.createServer(application);

// Middleware.
application.use(json());

// Start.
async function start() {
  // Prepare database.
  await database.prepare();

  // Endpoints.
  Routes.register(
    application,
    database,
    licenser
  );

  // Listen to HTTP server on port.
  const PORT = process.env.PORT || 3030;
  server.listen(PORT, '0.0.0.0', () =>
    console.log(`Listening on http://localhost:${PORT}.`)
  );
}

// Prepare everything if database operation(s) was successful.
start();