/**
 * Format a string with passed down arguments & said format.
 * 
 * @param {string} it the format to use during this operation.
 * @param {any[]} args array of arguments to replace accordingly in the format.
 * @returns {string}
 */
export function format(it: string, ...args: any): string {
  return it.replace(/{(\d+)}/g, (match, number) => {
    const argument = args[number];
    return typeof argument != 'undefined' ? argument : match;
  });
}