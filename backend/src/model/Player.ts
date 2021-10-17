/**
 * This interface represents a player.
 */
export default interface Player {
  /**
   * @returns {string} name of this player.
   */
  name: string;

  /**
   * @returns {string} unique id of this player.
   */
  uniqueId: string;
}
