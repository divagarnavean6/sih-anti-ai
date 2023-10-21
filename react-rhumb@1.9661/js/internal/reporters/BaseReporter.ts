import enviro from 'enviro';
import hubspot from 'hubspot';
import Raven from 'raven-js';
import { GlobalErrorMetrics } from '../Metrics';
import { UNEXPECTED_ROUTE_ERROR } from '../Constants';
export const Color = {
  OBSIDIAN: '#33475b',
  OZ: '#00bda5',
  OZ_LIGHT: '#e5f8f6',
  OZ_DARK: '#00a38d',
  CANDY_APPLE_DARK: '#d94c53',
  SLINKY: '#516f90',
  KOALA: '#eaf0f6',
  MARIGOLD: '#f5c26b',
  MARIGOLD_LIGHT: '#fef8f0',
  CANDY_APPLE_LIGHT: '#fdedee',
  CANDY_APPLE: '#f2545b',
  THUNDERDOME: '#6a78d1',
  THUNDERDOME_LIGHT: '#f0f1fa'
};

function getStaticAppName(options = {}) {
  let staticAppName = '';

  if (options.staticAppInfo && options.staticAppInfo.staticAppName) {
    staticAppName = options.staticAppInfo.staticAppName;
  } else if (hubspot && hubspot.bender && hubspot.bender.currentProject) {
    staticAppName = hubspot.bender.currentProject;
  }

  return staticAppName;
}

function getStaticAppVersion(options = {}) {
  let staticAppVersion = '';

  if (options.staticAppInfo && options.staticAppInfo.staticAppVersion) {
    staticAppVersion = options.staticAppInfo.staticAppVersion;
  } else if (hubspot && hubspot.bender && hubspot.bender.currentProjectVersion) {
    staticAppVersion = hubspot.bender.currentProjectVersion;
  }

  return staticAppVersion;
}

export default class BaseReporter {
  constructor(options = {}) {
    this.options = options;
    this.debug = enviro.debug('react-rhumb') === 'true';
    this.libName = `react-rhumb`;
    this.staticAppName = getStaticAppName(options);
    this.staticAppVersion = getStaticAppVersion(options);
  }

  performanceMark(name) {
    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
  }

  performanceEntries() {
    if (typeof performance.getEntries === 'function') {
      return performance.getEntries() || [];
    }

    return [];
  }

  toDuration(checks, timestamp, markers) {
    const longest = Math.max(...markers.filter(marker => Object.prototype.hasOwnProperty.call(checks, marker)).map(marker => checks[marker].timestamp));
    return Math.max(0, longest - timestamp);
  }

  setCustomAttribute(attributeName, attributeValue) {
    if (window.newrelic) {
      window.newrelic.setCustomAttribute(attributeName, attributeValue);
    }
  }

  addPageAction(actionName, actionPayload) {
    if (window.newrelic) {
      window.newrelic.addPageAction(actionName, actionPayload);
    }
  }

  captureError(error, attributes) {
    let data = {};
    let tags = {};

    if (attributes) {
      data = attributes.data;
      tags = attributes.tags;
    }

    if (window.newrelic) {
      window.newrelic.noticeError(error, Object.assign({}, data, {}, tags));
    }

    Raven.captureException(error, {
      extra: data,
      tags
    });
    GlobalErrorMetrics.counter('captured').increment();
  }

  report(__action) {
    throw new Error('Reporters must define a custom report() function');
  }

  labelCss(background, border) {
    return `background-color:${background};color:${Color.OBSIDIAN};padding: 0 .5rem;border-left: 4px solid ${border};`;
  }

  colorCss(val) {
    return `color:${val};`;
  }

  logGroupWithBadge(title, lightColor, darkColor, groupContents) {
    let loggedAppName = this.libName;

    try {
      // If we're logging from an app within an iframe, include the app name in the log line
      if (window.self !== window.top) {
        loggedAppName += ` (child frame: ${this.staticAppName})`;
      }
    } catch (error) {
      // Accessing window.top can throw an error if the iframe and parent window have different domains,
      // so an error thrown here is another indicator that this is being called from within an iframe
      loggedAppName += ` (child frame: ${this.staticAppName})`;
    }

    console.groupCollapsed(`%c${loggedAppName}%c ${title}`, this.labelCss(lightColor, darkColor), '');
    groupContents();
    console.groupEnd();
  }

  captureUnexpectedRoute(pathname) {
    if (window.newrelic) {
      window.newrelic.noticeError(UNEXPECTED_ROUTE_ERROR, {
        pathname
      });
    }

    Raven.captureException(UNEXPECTED_ROUTE_ERROR, {
      level: 'warning',
      tags: {
        pathname
      }
    });
  }

}