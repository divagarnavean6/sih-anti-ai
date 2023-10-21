import BaseReporter from './BaseReporter';
export default class DOMEventReporter extends BaseReporter {
  report(action) {
    if (action.type === 'ROUTE_STARTED') {
      try {
        const {
          route,
          globalNav
        } = action.payload.routeSpec;
        window.dispatchEvent(new CustomEvent('rhumb-route-started', {
          detail: {
            route,
            globalNav
          }
        }));
      } catch (e) {// TODO remove try/catch after IE11
      }
    }
  }

}