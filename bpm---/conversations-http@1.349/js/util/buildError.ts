export const buildError = (message, ...errorProps) => Object.assign(new Error(), ...errorProps, {
  message
});