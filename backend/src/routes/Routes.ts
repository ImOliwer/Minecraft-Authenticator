// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";
import ServerRoutes from "./ServerRoutes";
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
    // Utils.
    const stringUndefinedIfLength = (it: any, length: number): string | undefined => {
      if (!it || typeof it !== 'string') {
        return undefined;
      }
      const stringOf = it.trim();
      return stringOf.length === length ? undefined : stringOf;
    }

    // Register server routes.
    ServerRoutes.register(
      application, 
      database, 
      licenser, 
      stringUndefinedIfLength
    );
  }
};