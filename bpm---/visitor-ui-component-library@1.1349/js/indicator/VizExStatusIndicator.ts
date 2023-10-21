import { getStatusIndicatorBorderColor, getStatusIndicatorOfflineBackgroundColor, getStatusIndicatorOnlineBackgroundColor } from './theme/statusIndicatorThemeOperators';
import styled, { css } from 'styled-components';
import { EXTRA_SMALL, MEDIUM, SMALL } from '../constants/sizes';
import PropTypes from 'prop-types';
import { OFFLINE, ONLINE } from './constants/StatusIndicatorStatus';

const getSizeStyles = ({
  size
}) => {
  switch (size) {
    case EXTRA_SMALL:
      {
        return css(["width:10px;height:10px;"]);
      }

    case MEDIUM:
      {
        return css(["width:13px;height:13px;"]);
      }

    case SMALL:
    default:
      return css(["height:11px;width:11px;"]);
  }
};

const getStatusStyles = ({
  status
}) => {
  switch (status) {
    case ONLINE:
      {
        return css(["background:", ";"], getStatusIndicatorOnlineBackgroundColor());
      }

    case OFFLINE:
    default:
      {
        return css(["background:", ";"], getStatusIndicatorOfflineBackgroundColor());
      }
  }
};

const VizExStatusIndicator = styled.div.withConfig({
  displayName: "VizExStatusIndicator",
  componentId: "r0olyh-0"
})(["position:relative;display:inline-flex;::after{content:'';position:absolute;right:0;bottom:1px;border-radius:50%;border:2px solid;border-color:", ";", " ", "}"], getStatusIndicatorBorderColor, getSizeStyles, getStatusStyles);
VizExStatusIndicator.propTypes = {
  size: PropTypes.oneOf([EXTRA_SMALL, MEDIUM, SMALL]),
  status: PropTypes.oneOf([ONLINE, OFFLINE])
};
export default VizExStatusIndicator;