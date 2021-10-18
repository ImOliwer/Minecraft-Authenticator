// Imports.
import { Application } from "express";
import SoftwareLicenser from "../controller/SoftwareLicenser";
import Database from "../database/Database";

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
    
  }
};