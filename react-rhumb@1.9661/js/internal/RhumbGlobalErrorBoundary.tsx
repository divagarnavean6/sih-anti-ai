import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from 'react';
import NavMarker from '../NavMarker';

class RhumbGlobalErrorBoundary extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  static getDerivedStateFromError(error) {
    return {
      error
    };
  }

  componentDidCatch(error) {
    this.props.onError(error);
  }

  render() {
    return this.state.error ? /*#__PURE__*/_jsx(NavMarker, {
      name: "RHUMB_GLOBAL_ERROR_BOUNDARY"
    }) : this.props.children;
  }

}

export default RhumbGlobalErrorBoundary;