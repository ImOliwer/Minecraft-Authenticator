// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import Argon2 from "argon2";
import * as Email from "email-validator";
import { SERVER_ORIGIN } from "../util/Origins";
const cors = require("cors"); // Declaration is invalid so this will do..

/**
 * Export the representative.
 */
export default {
  register: (
    application: Application,
    database: Database,
    _: SoftwareLicenser,
    stringUndefinedIfLength: (it: any, length: number) => string | undefined
  ) => {
    // cors options for (our) server related endpoints.
    const serverOnlyCorsOptions = { origin: SERVER_ORIGIN };

    // create a user
    application.post('/users/create', cors(serverOnlyCorsOptions), async (request, response) => {
      const body           = request.body;
      const email          = stringUndefinedIfLength(body?.email, 0);
      const password       = stringUndefinedIfLength(body?.password, 0);
      const linkedName     = stringUndefinedIfLength(body?.linkedName, 0);
      const linkedUniqueId = stringUndefinedIfLength(body?.linkedUniqueId, 0);

      if (!email || !password || !linkedName || !linkedUniqueId) {
        return response.status(400).send({
          message: 'missing email, password, ingame name and/or unique id'
        });
      }

      if (!Email.validate(email)) {
        return response.status(400).send({
          message: 'email is invalid'
        });
      }

      if (password.length < 6) {
        return response.status(400).send({
          message: 'password must contain at least 6 characters'
        });
      }

      const linkedNameLength = linkedName.length;
      if (linkedNameLength < 3 || linkedNameLength > 16) {
        return response.status(400).send({
          message: 'ingame name must be at least 3 characters and at highest 16'
        });
      }

      if (linkedUniqueId.length != 36) {
        return response.status(400).send({
          message: 'unique id must be 36 characters'
        });
      }
    
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(linkedUniqueId)) {
        return response.status(400).send({
          message: 'invalid unique id'
        });
      }

      const selectResult = await database.userModel.findOne({
        where: { email }
      });

      if (selectResult != null) {
        return response.status(400).send({
          message: 'email already exists'
        });
      }

      const hashedPassword = await Argon2.hash(password);
      try {
        await database.userModel.create({
          email,
          password: hashedPassword,
          linkedName,
          linkedUniqueId
        });

        response.send({
          message: 'successfully created user',
          data: { email }
        });
      } catch (e) {
        response.status(500).send({
          message: 'failed creating user'
        });
      }
    });

    // validate user
    application.post('/users/validate', async (request, response) => {
      const body     = request.body;
      const email    = stringUndefinedIfLength(body?.email, 0);
      const password = stringUndefinedIfLength(body?.password, 0);

      if (!email || !password) {
        return response.status(400).send({
          message: 'missing email and/or password'
        });
      }

      if (!Email.validate(email)) {
        return response.status(400).send({
          message: 'email is invalid'
        });
      }

      const result = await database.userModel.findOne({
        where: { email }
      });

      if (!result) {
        return response.status(400).send({
          message: 'invalid email and/or password'
        });
      }

      try {
        if (!await Argon2.verify(result.password, password)) {
          return response.status(400).send({
            message: 'invalid email and/or password'
          });
        }
      } catch (_) {
        return response.status(500).send({
          message: 'failed verifying user'
        });
      }

      response.send({
        message: 'user was successfully validated',
        data: {
          email,
          linkedName: result.linkedName,
          linkedUniqueId: result.linkedUniqueId
        }
      });
    });
  }
};