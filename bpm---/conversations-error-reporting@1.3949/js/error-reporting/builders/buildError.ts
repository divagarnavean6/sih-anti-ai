/**
 * Build an error object.
 *
 * @example
 * const myError = buildError('its broken', { usefulDataThatWillReportToSentry: true }, { moreUsefulData: 'is good' });
 *
 * @param {String} message - error message
 * @param {...Object} errorProps - props to add to the error
 *
 * @return {Error}
 */
export const buildError = (message, ...errorProps) => Object.assign(new Error(), ...errorProps, {
  message
});