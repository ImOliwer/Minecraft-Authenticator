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

    // Utils.
    const stringUndefinedIfLength = (it: any, length: number): string | undefined => {
      if (!it || typeof it !== 'string') {
        return undefined;
      }
      const stringOf = it.trim();
      return stringOf.length === length ? undefined : stringOf;
    }

    // Regex.
    const emailRegex = RegExp('[a-zA-Z0-9_\\.]+@([a-zA-Z]+\\.([a-zA-Z]{3})|[a-zA-Z]+\\.[a-zA-Z]{2}\\.[a-zA-Z]{2})');

    // Add a new server with license.
    application.post('/servers/add', cors(licenseCorsOptions), async (request, response) => {
      const body = request.body;
      if (!body) {
        return response.status(400).send({
          message: 'email, client and address must be specified'
        });
      }
      
      const email   = stringUndefinedIfLength(body.email, 0);
      const client  = stringUndefinedIfLength(body.client, 0);
      const address = stringUndefinedIfLength(body.address, 0);

      if (!email || !client || !address) {
        return response.status(400).send({
          message: 'email, client and/or address specified was invalid'
        });
      }

      if (!emailRegex.test(email!)) {
        return response.status(400).send({
          message: 'an invalid email was specified'
        });
      }

      try {
        const license = licenser.create({ address });
        await database.query(Server.INSERT, email, client, address, license);
      } catch (_) {
        return response.status(400).send({
          message: 'client email already exists'
        });
      }

      response.send({
        message: 'successfully set up address with a license',
        data: { email, client, address }
      });
    });

    // Get all servers.
    application.get('/servers', cors(licenseCorsOptions), async (_, response) => {
      const found = await database.query(Server.FETCH_ALL_IGNORING_LICENSE);
      response.send({ data: found?.rows });
    });
  }
};