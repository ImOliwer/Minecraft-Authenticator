// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import BCrypt from "bcrypt";
import * as Email from "email-validator";
import { SERVER_ORIGIN } from "../util/Origins";
const cors = require("cors"); // Declaration is invalid so this will do..

/**
 * @returns {number} the salt rounds for password hashing.
 */
const PASSWORD_SALT_ROUNDS = 12;

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

      if (password.length < 6) {
        return response.status(400).send({
          message: 'password must contain at least 6 characters'
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

      const hashedPassword = await BCrypt.hash(password, PASSWORD_SALT_ROUNDS);
      try {
        await database.userModel.create({
          email,
          password: hashedPassword,
          linkedName: null,
          linkedUniqueId: null
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
  }
};