// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import BCrypt from "bcrypt";
import * as Email from "email-validator";
import Query from "../database/Query";
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
    licenser: SoftwareLicenser,
    stringUndefinedIfLength: (it: any, length: number) => string | undefined
  ) => {
    // cors options for (our) server related endpoints.
    const serverOnlyCorsOptions = { origin: SERVER_ORIGIN };

    // queries
    const { SELECT_BY_EMAIL, INSERT } = Query.User;

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

      const selectResult = await database.query(SELECT_BY_EMAIL, email);
      if (selectResult.rowCount > 0) {
        return response.status(400).send({
          message: 'email already exists'
        });
      }

      const hashedPassword = await BCrypt.hash(password, PASSWORD_SALT_ROUNDS);
      try {
        const insertResult = await database.query(INSERT, email, hashedPassword);
        
        if (insertResult.rowCount == 0) {
          return response.status(500).send({
            message: 'failed creating user'
          });
        }

        response.send({
          message: 'successfully created user',
          data: { email }
        });
      } catch (_) {
        response.status(500).send({
          message: 'failed creating user'
        });
      }
    });
  }
};