'use es6';

import { AVATAR_SIZES } from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import { MEDIUM, SMALL } from 'visitor-ui-component-library/constants/sizes';
/*
 * @param {object} options - sizing options
 * @param {object} options.mobile - boolean => is visitor on a mobile device
 * @param {object} options.border - number => the width of the border around the avatar
 *
 */

export function getChatHeadGroupStyle({
  mobile,
  border = 0
}) {
  if (mobile) {
    return {
      flex: '0 0 32px',
      height: AVATAR_SIZES[SMALL] + border * 2
    };
  }

  return {
    height: AVATAR_SIZES[MEDIUM] + border * 2
  };
}