"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullUrl = getFullUrl;

var _internal = require("./internal");

function getFullUrl(subDomainPrefix, overrideConfig) {
  const subDomain = (0, _internal.getSubDomain)(subDomainPrefix, overrideConfig);
  const domain = (0, _internal.getDomain)(overrideConfig);
  const tld = (0, _internal.getTld)(overrideConfig);
  const pathPrefix = (0, _internal.getPathPrefix)(subDomainPrefix);
  return `https://${subDomain}.${domain}.${tld}${pathPrefix}`;
}