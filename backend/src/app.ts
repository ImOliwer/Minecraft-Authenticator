// Imports
import FileSystem from "fs";
import Express from 'express';
import SoftwareLicenser from "./controller/SoftwareLicenser";
import Routes from "./routes/Routes";

// Software licenser
const licenser = new SoftwareLicenser(
  FileSystem.readFileSync(
    `${__dirname}\\..\\resources\\private_key.pem`,
    { encoding: 'utf8' }
  ).toString()
);

// Endpoint accessors.
const application = Express();
const http = require('http');
const server = http.createServer(application);

// Endpoints.
Routes.register(
  application,
  licenser
);

// Listen HTTP server to port.
const PORT = process.env.PORT || 3030;
server.listen(PORT, '0.0.0.0', () =>
  console.log(`Listening on http://localhost:${PORT}.`)
);