'use es6';

import uniqueId from 'transmute/uniqueId';
import { warn } from 'react-utils/devLogger';
export default function deprecateFunction(message = '', fn) {
  const key = uniqueId('deprecated-function-');
  return (...args) => {
    warn({
      message: `Deprecation Warning: ${message}`,
      key
    });
    return fn(...args);
  };
}