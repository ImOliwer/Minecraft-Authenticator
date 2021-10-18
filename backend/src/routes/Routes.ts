// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import { Server } from "../database/Query";
import { LICENSE_WEB_LOCATION } from "../util/URL";
const cors = require("cors"); // Declaration is invalid so this will do..

/**
 * Export the representative.
 */
export default {
  register: (
    application: Application, 
    database: Database, 
    licenser: SoftwareLicenser
  ) => {
    // Cors options of license related endpoints.
    const licenseCorsOptions = { origin: LICENSE_WEB_LOCATION };

    // Add a new server with license.
    application.post('/servers/add', cors(licenseCorsOptions), async (request, response) => {
      const body = request.body;
      if (!body) {
        return response.status(400).send({
          message: 'client and address must be specified'
        });
      }
      
      let client = body.client;
      let address = body.address;

      if (
        !client || typeof client !== 'string' || (client = client.trim()).length == 0 || 
        !address || typeof address !== 'string' || (address = address.trim()).length == 0
      ) {
        return response.status(400).send({
          message: 'client and/or address specified was invalid'
        });
      }

      try {
        const license = licenser.create({ address });
        await database.query(Server.INSERT, client, address, license);
      } catch (_) {
        return response.status(400).send({
          message: 'client already exists'
        });
      }

      response.send({
        message: 'successfully set up address with a license',
        data: { client, address }
      });
    });

    // Get all servers.
    application.get('/servers', cors(licenseCorsOptions), async (_, response) => {
      const found = await database.query(Server.FETCH_ALL_IGNORING_LICENSE);
      response.send({ data: found?.rows });
    });
  }
};