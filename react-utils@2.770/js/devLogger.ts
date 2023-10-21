import enviro from 'enviro';
const logShown = {};

const shouldLog = key => {
  return !enviro.deployed() && (key == null || !logShown[key]);
};

const markAsShown = key => {
  if (key) {
    logShown[key] = true;
  }
};

export const warn = ({
  message = '',
  key,
  url
}) => {
  if (url) {
    message += `\nFor details, see: ${url}`;
  }

  if (shouldLog(key)) {
    console.warn(message);
    markAsShown(key);
  }
};
export default {
  warn
};