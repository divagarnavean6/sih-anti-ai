import invariant from 'react-utils/invariant';

const segmentize = uri => uri.replace(/(^\/+|\/+$)/g, '').split('/').filter(Boolean);

const paramRe = /^:(.+)/;
export default (routes => {
  const routeSegmentsCache = {};
  routes.forEach(route => {
    routeSegmentsCache[route] = segmentize(route);
  });
  return (route, pathname) => {
    const pathnameSegments = segmentize(pathname);
    const routeSegments = routeSegmentsCache[route];
    invariant(routeSegments, `unexpected route ${route}`);

    if (routeSegments[routeSegments.length - 1] === '*' ? pathnameSegments.length < routeSegments.length : pathnameSegments.length !== routeSegments.length) {
      return false;
    }

    let index = 0;

    for (; index < routeSegments.length; index++) {
      const routeSegment = routeSegments[index];
      const pathnameSegment = pathnameSegments[index];

      if (routeSegment === '*' && index === routeSegments.length - 1) {
        return true;
      } else if (routeSegment !== pathnameSegment && !paramRe.exec(routeSegment)) {
        return false;
      }
    }

    return true;
  };
});