// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import { Server, SERVERS_TABLE } from "../database/Query";
import { LICENSE_WEB_LOCATION } from "../util/URL";
import * as Email from "email-validator";
const cors = require("cors"); // Declaration is invalid so this will do..

/**
 * Export the representative.
 */
export default {
  register: (
    application: Application, 
    database: Database, 
    licenser: SoftwareLicenser,
    stringUndefinedIfLength: (it: any, length: number) => string | undefined
  ) => {
    // Cors options of license related endpoints.
    const licenseCorsOptions = { origin: LICENSE_WEB_LOCATION };

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

      if (!Email.validate(email!)) {
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

    // Edit a server by email.
    application.patch('/servers/edit/:email', cors(licenseCorsOptions), async (request, response) => {
      const email = request.params['email'];
      if (!email || !Email.validate(email!)) {
        return response.status(400).send({
          message: 'an invalid email was specified'
        });
      }

      const body       = request.body;
      const newEmail   = stringUndefinedIfLength(body?.email, 0);
      const newClient  = stringUndefinedIfLength(body?.client, 0);
      const newAddress = stringUndefinedIfLength(body?.address, 0);
      
      if (!newEmail && !newClient && !newAddress) {
        return response.status(400).send({
          message: 'no data provided to be edited'
        });
      }

      const partial: Partial<{
        email: unknown,
        client: unknown,
        address: unknown,
        licenseKey: unknown
      }> = {};

      if (newEmail) {
        partial.email = newEmail;
      }

      if (newClient) {
        partial.client = newClient;
      }

      if (newAddress) {
        partial.address = newAddress;
      }

      const updateResult = await database.queryNoValues(
        SERVERS_TABLE
          .update(partial)
          .where(SERVERS_TABLE.email.equals(email))
          .toQuery()
      );

      if (updateResult.rowCount == 0) {
        return response.status(400).send({
          message: 'email is not registered in the database'
        });
      }

      response.send({ newValues: partial });
    });

    // Get all servers.
    application.get('/servers', cors(licenseCorsOptions), async (_, response) => {
      const found = await database.query(Server.FETCH_ALL_IGNORING_LICENSE);
      response.send({ data: found?.rows });
    });
  }
};