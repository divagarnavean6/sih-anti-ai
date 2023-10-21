import memoize from 'transmute/memoize';
import { secureDocument } from '../sanitizers/SanitizeConfiguration';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import I18n from 'I18n';
/**
 *  /S*       - matches any non-whitespace character zero to unlimited times
 *  cdn2      - matches cdn2 literally (case-sensitive)
 *  \.        - matches character . literally (case-sensitive)
 *  net       - matches net literally (case-sensitive)
 *  (qa)?     - matches qa 0 or 1 times
 *  /thumb    - matches /thumb literally (case-sensitive)
 *  [a-zA-Z]+ - match a single character in the range one or more times
 */

const HUBSPOT_HOSTED_THUMBNAIL_REGEX = /\S*cdn2\.hubspot(qa)?\.net\S*\/thumb\.[a-zA-Z]+$/;
const THUMB_REGEX = /\/thumb\.[a-zA-Z]+$/;
const BASE_64_REGEX = /data:/;
const HUBSPOT_URL_REGEX = /app(-[a-z0-9]+)?.hubspot(qa)?.com\/login-api/;
export const isLinkToThumbnail = memoize(src => {
  return HUBSPOT_HOSTED_THUMBNAIL_REGEX.test(src);
});
const isBase64 = memoize(src => {
  return BASE_64_REGEX.test(src);
});
export const isLinkToHubspotLogoutPage = memoize(src => HUBSPOT_URL_REGEX.test(src));

const errorStyling = height => `
  border: 1px solid ${BATTLESHIP};
  justify-content: center;
  padding: 20px;
  display: flex;
  align-items: center;
  height: ${height ? `${height}px` : 'auto'};
  width: 100%;
`;

const errorMessage = memoize(height => `<h3 style="${errorStyling(height)}">${I18n.text('sanitizedEmail.imageError')}</h3>
  `);
export const fixImages = ({
  node,
  node_name
}) => {
  if (node && node_name === 'img' && node.attributes) {
    const src = node.getAttribute('src');

    if (src && isBase64(src) && src.length > 2000) {
      const height = node.getAttribute('height');
      const wrapper = secureDocument.createElement('div');
      wrapper.innerHTML = errorMessage(height);
      return {
        node: wrapper
      };
    }
    /**
     * TEMPORARY: Remove "/thumb.<extension>" from "src" so that we point to the full size image.
     *
     * Once https://git.hubteam.com/HubSpot/ConnectedEmail/issues/357 is done,
     * all image "src"s will be backfilled to point to the full size image
     *
     *  */


    if (src && isLinkToThumbnail(src)) {
      node.setAttribute('src', src.replace(THUMB_REGEX, ''));
    }

    if (isLinkToHubspotLogoutPage(src)) {
      node.setAttribute('src', '');
    }
    /**
     * TEMPORARY: Overwrite the image width with the full size image width
     *
     * Once https://git.hubteam.com/HubSpot/ConnectedEmail/issues/357 is done,
     * the height and width attributes will be set
     *
     *  */


    const originalWidth = node.getAttribute('data-original-width');

    if (originalWidth) {
      node.setAttribute('width', originalWidth);
    }
    /**
     * TEMPORARY: Overwrite the image height with the full size image height
     *
     * Once https://git.hubteam.com/HubSpot/ConnectedEmail/issues/357 is done,
     * the height and width attributes will be set
     *
     *  */


    const originalHeight = node.getAttribute('data-original-height');

    if (originalHeight) {
      node.setAttribute('height', originalHeight);
    }

    return {
      node
    };
  }

  return null;
};