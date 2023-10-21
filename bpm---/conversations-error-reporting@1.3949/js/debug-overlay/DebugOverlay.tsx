import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";

/* hs-eslint ignored failing-rules */

/* eslint-disable react/jsx-no-literals */
import Raven from 'raven-js';
import styled from 'styled-components';
import { Component } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isEnabled, toggleVerboseLogging } from './operators/verboseLogging';
const LETTER_D = 68;
const Backdrop = styled.div.withConfig({
  displayName: "DebugOverlay__Backdrop",
  componentId: "sc-11w837q-0"
})(["position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.75);z-index:1000;"]);
const Overlay = styled.div.withConfig({
  displayName: "DebugOverlay__Overlay",
  componentId: "sc-11w837q-1"
})(["display:flex;align-items:center;justify-content:center;height:100%;"]);
const OverlayContent = styled.div.withConfig({
  displayName: "DebugOverlay__OverlayContent",
  componentId: "sc-11w837q-2"
})(["background-color:white;position:relative;padding:20px;border:solid 1px;box-shadow:grey 0px 0px 10px;width:360px;"]);
const DebugButton = styled.button.withConfig({
  displayName: "DebugOverlay__DebugButton",
  componentId: "sc-11w837q-3"
})(["margin-right:4px;"]);
const CloseButton = styled.button.withConfig({
  displayName: "DebugOverlay__CloseButton",
  componentId: "sc-11w837q-4"
})(["position:absolute;border:white;top:0;right:0;"]);

class DebugOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDebug: false,
      lastEventId: null,
      verboseLoggingEnabled: isEnabled()
    };
    this.toggleVerboseLogging = this.toggleVerboseLogging.bind(this);
    this.sendDebugData = this.sendDebugData.bind(this);
    this.closeDebug = this.closeDebug.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp(event) {
    const {
      altKey,
      ctrlKey,
      shiftKey,
      keyCode
    } = event;

    if (altKey && ctrlKey && shiftKey && keyCode === LETTER_D) {
      this.setState({
        showDebug: true
      });

      if (this.props.onEnterDebug) {
        this.props.onEnterDebug();
      }
    }
  }

  closeDebug() {
    this.setState({
      showDebug: false
    });
  }

  toggleVerboseLogging() {
    this.setState(state => {
      return {
        verboseLoggingEnabled: !state.verboseLoggingEnabled
      };
    });
    toggleVerboseLogging();
  }

  sendDebugData() {
    Raven.captureMessage(`Debug Data ${Date.now()}`, {
      level: 'info'
    });
    this.setState({
      lastEventId: Raven.lastEventId()
    });
  }

  render() {
    if (!this.state.showDebug) {
      return null;
    }

    return /*#__PURE__*/_jsx(Backdrop, {
      children: /*#__PURE__*/_jsx(Overlay, {
        children: /*#__PURE__*/_jsxs(OverlayContent, {
          children: [/*#__PURE__*/_jsx("h3", {
            children: "Debug Menu"
          }), this.props.renderNetworkStatistics ? this.props.renderNetworkStatistics() : null, /*#__PURE__*/_jsx(DebugButton, {
            onClick: this.toggleVerboseLogging,
            children: this.state.verboseLoggingEnabled ? /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-error-reporting.debugOverlay.disableLogs"
            }) : /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-error-reporting.debugOverlay.enableLogs"
            })
          }), /*#__PURE__*/_jsx(DebugButton, {
            onClick: this.sendDebugData,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-error-reporting.debugOverlay.sendData"
            })
          }), /*#__PURE__*/_jsx("br", {}), this.state.lastEventId ? /*#__PURE__*/_jsx("span", {
            style: {
              color: 'green'
            },
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "conversations-error-reporting.debugOverlay.lastEventMessage",
              options: {
                lastEventId: this.state.lastEventId
              }
            })
          }) : null, /*#__PURE__*/_jsx(CloseButton, {
            onClick: this.closeDebug,
            children: "x"
          })]
        })
      })
    });
  }

}

DebugOverlay.displayName = 'DebugOverlay';
export default DebugOverlay;