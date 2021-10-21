// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import { LICENSE_WEB_ORIGIN } from "../util/Origins";
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
    const licenseCorsOptions = { origin: LICENSE_WEB_ORIGIN };

    // Add a new server.
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
        const license = licenser.create({ email });
        await database.serverModel.create({
          email,
          client,
          address,
          licenseKey: license
        });
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
    application.put('/servers/edit/:email', cors(licenseCorsOptions), async (request, response) => {
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

      const toUpdate: {
        email?: string,
        client?: string,
        address?: string,
        licenseKey?: string
      } = {};

      if (newEmail && newEmail !== email) {
        toUpdate.email = newEmail;
        toUpdate.licenseKey = licenser.create({ newEmail });
      }

      if (newClient) {
        toUpdate.client = newClient;
      }

      if (newAddress) {
        toUpdate.address = newAddress;
      }

      const updateResult = await database.serverModel.update(
        toUpdate, { 
          where: { email },
          returning: true
        }
      );

      if (updateResult[1].length == 0) {
        return response.status(400).send({
          message: 'email is not registered in the database'
        });
      }

      if (toUpdate.licenseKey) {
        delete toUpdate.licenseKey;
      }

      response.send({ newValues: toUpdate });
    });

    // Get all servers.
    application.get('/servers', cors(licenseCorsOptions), async (_, response) => {
      const found = await database.serverModel.findAll();
      response.send({ 
        data: found.map(it => { 
          return {
            identifier: it.identifier, 
            email: it.email, 
            client: it.client, 
            address: it.address
          };
        })
      });
    });
  }
};