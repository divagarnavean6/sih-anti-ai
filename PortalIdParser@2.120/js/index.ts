"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  id: null,
  pathRegex: /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/,
  queryParamRegex: /(?:\?|&)portalid=(\d+)/i,

  getPortalIdFromPath(regex) {
    if (document) {
      if (regex == null) {
        regex = this.pathRegex;
      }

      return this.parsePortalIdFromString(document.location.pathname, regex);
    }
  },

  getPortalIdFromQueryParam() {
    if (document) {
      return this.parsePortalIdFromString(document.location.search, this.queryParamRegex);
    }
  },

  parsePortalIdFromString(string, regex) {
    const idRe = regex.exec(string);
    const portalId = idRe != null ? idRe[1] : undefined;
    return portalId ? +portalId : undefined;
  },

  get(options) {
    if (options == null) {
      options = {};
    }

    if (this.id && !options.reparse) {
      return this.id;
    }

    const id = this.getPortalIdFromPath(options.regex) || this.getPortalIdFromQueryParam();

    if (!options.preserveGlobalId) {
      if (window.hubspot == null) {
        window.hubspot = {};
      }

      if (window.hubspot.portal == null) {
        window.hubspot.portal = {};
      }

      if (window.hubspot.portal.id == null) {
        window.hubspot.portal.id = id;
      }

      if (id) {
        this.id = id;
      }
    }

    return id;
  }

};
exports.default = _default;
module.exports = exports.default;