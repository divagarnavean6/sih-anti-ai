import { makeCustomResponse } from './makeCustomResponse';
import { makeStandardResponse } from './makeStandardResponse';
export function makeTypicalResponseTimeText({
  typicalResponseTime
} = {}) {
  if (!typicalResponseTime) return undefined;
  const {
    usingCustomResponse,
    standardResponse,
    customResponseQuantity,
    customResponseUnit
  } = typicalResponseTime;

  if (usingCustomResponse && !customResponseQuantity) {
    return '';
  }

  if (usingCustomResponse) {
    return makeCustomResponse({
      customResponseQuantity,
      customResponseUnit
    });
  }

  return makeStandardResponse({
    standardResponse
  });
}