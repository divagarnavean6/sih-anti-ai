import Raven from 'raven-js'; // @ts-expect-error untyped

import HexCodePattern from 'PatternValidationJS/patterns/HexCode'; // shimmed as we cannot depend on HubStyleTokens

const OLAF = '#ffffff';
const OBSIDIAN = '#33475b';
const SHORTHAND_HEX_PATTERN = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const REGULAR_HEX_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
export function hexToRgb(hex) {
  let rgbObject;

  try {
    const regularHex = hex.replace(SHORTHAND_HEX_PATTERN, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = REGULAR_HEX_PATTERN.exec(regularHex);

    if (!result) {
      throw new Error('Invalid hex code');
    }

    rgbObject = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  } catch (error) {
    if (error instanceof Error) {
      Raven.captureException(error, {
        extra: {
          hex
        }
      });
    }

    rgbObject = {
      r: 0,
      g: 0,
      b: 0
    };
  }

  return rgbObject;
}

function getLightness(hex) {
  const {
    r: rRaw,
    g: gRaw,
    b: bRaw
  } = hexToRgb(hex);
  const r = rRaw / 255.0;
  const rLightness = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const g = gRaw / 255.0;
  const gLightness = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const b = bRaw / 255.0;
  const bLightness = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * rLightness + 0.7152 * gLightness + 0.0722 * bLightness;
}

export function canReadText(backgroundHex, textColor) {
  const backLightness = getLightness(backgroundHex);
  const textLightness = getLightness(textColor);
  const contrastRatio = (textLightness + 0.05) / (backLightness + 0.05);
  return contrastRatio > 2.0;
}
let canReadTextVal;
let lastAccent;

function getCanReadTextOnce(accent) {
  if (accent !== lastAccent) {
    lastAccent = accent;
    canReadTextVal = canReadText(accent, OLAF);
  }

  return canReadTextVal;
}

export function getTextColor(accent) {
  if (!HexCodePattern.test(accent)) {
    return OBSIDIAN;
  }

  return getCanReadTextOnce(accent) ? OLAF : OBSIDIAN;
}
export function useDefaultElementColor(accent) {
  if (!HexCodePattern.test(accent)) {
    return true;
  }

  return !getCanReadTextOnce(accent);
}