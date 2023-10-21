"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUrl = exports.parseHostname = exports.parseUrl = void 0;
const regex = /^(?:(?:([^:/?#]+):)?(?:\/\/([^:/?#]+)(?::([0-9]+))?)+?)?([^?#]+)?(?:\?([^#]*))?(?:#(.+))?/;

const getDefaultPort = protocol => {
  const normalizedProtocol = (protocol || '').toLowerCase();
  if (!normalizedProtocol) return null;
  if (normalizedProtocol === 'http') return 80;
  if (normalizedProtocol === 'https') return 443;
  return null;
};

const parseUrl = url => {
  const [, protocol, hostname, port, path, query, hash] = regex.exec(url);
  return {
    protocol,
    hostname,
    port: port !== undefined ? parseInt(port, 10) : getDefaultPort(protocol),
    path,
    query,
    hash
  };
};

exports.parseUrl = parseUrl;

const parseHostname = location => {
  if (location && location.hostname) {
    const segments = location.hostname.split('.');

    if (segments.length !== 3) {
      return {};
    }

    const [loadBalancer] = segments;
    const [loadBalancerBase] = loadBalancer.split('-');
    return {
      loadBalancer,
      loadBalancerBase
    };
  }

  return {};
};

exports.parseHostname = parseHostname;

const isDefaultPort = descriptor => {
  if (!descriptor.port) return true;
  if (!descriptor.protocol) return true;
  const protocol = (descriptor.protocol || '').toLowerCase();
  if (protocol === 'http' && descriptor.port === 80) return true;
  if (protocol === 'https' && descriptor.port === 443) return true;
  return false;
};

const buildUrl = descriptor => [descriptor.hostname ? `${descriptor.protocol || 'https'}://` : '', descriptor.hostname, isDefaultPort(descriptor) ? '' : `:${descriptor.port}`, descriptor.hostname && descriptor.path && descriptor.path.substr(0, 1) !== '/' ? `/${descriptor.path}` : descriptor.path, descriptor.query ? `?${descriptor.query}` : '', descriptor.hash ? `#${descriptor.hash}` : ''].join('');

exports.buildUrl = buildUrl;