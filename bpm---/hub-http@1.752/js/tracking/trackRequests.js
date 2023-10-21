"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportDomain = exports.reportStatusCode = void 0;

var _url = require("../helpers/url");

var _core = require("../middlewares/core");

var _metrics = require("./metrics");

const HARVEST_DELAY = 1000 * 10;
const METRICS_ENDPOINT = `https://${(0, _core.resolveApi)((0, _core.hubletApi)('app', 'hubspot'))}/api/metrics/v1/frontend/send`;
const AJAX_QUEUE = new Set(); // We are properly handling cases where this API is undefined.
// eslint-disable-next-line compat/compat

const trackRequests = Boolean(navigator.sendBeacon);
let flushRequestsTimeout = undefined;
let enabledSendOnUnload = false;

const getPerfData = windowObj => {
  const entries = windowObj.performance.getEntriesByType('resource');

  if (!entries || !entries.length) {
    return {};
  }

  const requests = entries.filter(res => res.initiatorType === 'xmlhttprequest');
  const entryMap = {};
  requests.forEach(({
    name,
    duration,
    requestStart,
    responseStart,
    transferSize
  }) => {
    if (!entryMap[name]) {
      entryMap[name] = [];
    }

    entryMap[name].push({
      duration,
      transferSize,
      serverTime: responseStart - requestStart,
      requestStart
    });
  });
  return entryMap;
};

const findPerfData = (requestDataForUrl, requestSendTime) => {
  if (!requestDataForUrl) {
    return {};
  }

  const requestData = requestDataForUrl.filter(perfData => {
    return requestSendTime - perfData.requestStart < 10;
  });
  return requestData.length ? requestData[0] : {};
};

const send = () => {
  try {
    if (AJAX_QUEUE.size === 0) {
      return;
    }

    const ajaxData = [...AJAX_QUEUE];
    AJAX_QUEUE.clear();
    let iframeData = {};
    let apiIframeUsed;

    try {
      apiIframeUsed = // see https://git.hubteam.com/HubSpot/hub-http/pull/372
      window.apiIframeUsed && window.apiIframe && window.apiIframe.contentWindow;
      iframeData = apiIframeUsed ? getPerfData(window.apiIframe.contentWindow) : {};
    } catch (e) {// Skip iframe data
    }

    let currentWindowPerfData = {};

    try {
      currentWindowPerfData = getPerfData(window);
    } catch (e) {// Skip current window data
    }

    const requestPerfData = Object.assign({}, currentWindowPerfData, {}, iframeData);
    const hydratedRequests = ajaxData.map(({
      url,
      sendTime,
      statusCode,
      statusDesc
    }) => {
      const metadataForRequest = {
        url,
        statusCode
      };

      if (statusDesc) {
        metadataForRequest.statusDesc = statusDesc;
      }

      const perfDataForRequest = findPerfData(requestPerfData[url], sendTime);
      return Object.assign({}, metadataForRequest, {}, perfDataForRequest);
    }); // sendBeacon will never be called if trackRequests (existence check on sendBeacon API) is false
    // eslint-disable-next-line compat/compat

    const sent = navigator.sendBeacon(METRICS_ENDPOINT, JSON.stringify({
      datapoints: hydratedRequests
    }));

    if (!sent) {
      ajaxData.forEach(request => AJAX_QUEUE.add(request));
    }
  } catch (sendError) {// Don't do anything if this fails.
  }
};

const reportStatusCode = requestStatus => {
  if (!trackRequests) {
    return;
  }

  AJAX_QUEUE.add(requestStatus);
  clearTimeout(flushRequestsTimeout);

  if (AJAX_QUEUE.size >= 25) {
    send();
  }

  flushRequestsTimeout = setTimeout(send, HARVEST_DELAY);

  if (!enabledSendOnUnload) {
    window.addEventListener('unload', send, false);
    enabledSendOnUnload = true;
  }
};

exports.reportStatusCode = reportStatusCode;

const reportDomain = url => {
  if (typeof url !== 'string') return;

  try {
    const {
      hostname
    } = (0, _url.parseUrl)(url);
    const [subdomain, domain, tld] = hostname.split('.');

    _metrics.Metrics.counter('request-sent', {
      hostname: [subdomain.replace(/\d+/, ''), domain.replace(/qa$/, ''), tld].join('.'),
      prom_only: true
    }).increment();
  } catch (err) {// can't do much here if we get a domain that isn't actually a domain, ignore
  }
};

exports.reportDomain = reportDomain;