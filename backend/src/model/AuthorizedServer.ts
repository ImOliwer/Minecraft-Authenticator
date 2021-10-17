/**
 * Destruct addresses from an authorized server.
 * 
 * @param {AuthorizedServer} server the authorized server to destruct from.
 * @returns {string[]}
 */
export function destructAddresses(server: AuthorizedServer): string[] {
  return server.address.split(';');
}

/**
 * This interface represents an authorized server.
 */
export default interface AuthorizedServer {
  /**
   * @returns {string} a string containing an array of addresses relative
   *                   to this authorized server (separated by ';').
   */
  address: string;

  /**
   * @returns {string} the license of this authorized server.
   */
  licenseKey: string;
}