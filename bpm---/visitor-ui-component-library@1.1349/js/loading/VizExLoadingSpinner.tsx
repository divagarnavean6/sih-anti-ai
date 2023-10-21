import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { EXTRA_SMALL, SMALL, MEDIUM } from '../constants/sizes';
import { LOADING_SPINNER_SIZES } from './constants/LoadingSpinnerSizes';
import themePropType from '../utils/themePropType';
import { getLoadingSpinnerColor, getSecondaryLoadingSpinnerColor } from './theme/loadingSpinnerOperators';
import * as SpinnerUses from './constants/SpinnerUses';
const privateSpin = keyframes(["100%{transform:rotate(360deg)}"]);
const SpinnerOuter = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__SpinnerOuter",
  componentId: "sc-1i0b5a7-0"
})(["position:relative;align-items:center;display:flex;margin:8px;", ";"], ({
  grow
}) => grow && css(["flex-directions:column;justify-content:center;width:100%;height:100%;margin:0;"]));
const SpinnerInner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__SpinnerInner",
  componentId: "sc-1i0b5a7-1"
})(["position:relative;align-items:center;display:flex;justify-content:center;width:", ";height:", ";color:", ";"], ({
  size
}) => `${size}px`, ({
  size
}) => `${size}px`, ({
  theme,
  use
}) => use === SpinnerUses.PRIMARY ? getLoadingSpinnerColor(theme) : getSecondaryLoadingSpinnerColor(theme));
const ResultSpinner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__ResultSpinner",
  componentId: "sc-1i0b5a7-2"
})(["align-items:center;display:flex;justify-content:center;opacity:", ";position:absolute;transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1) 0.1s,transform 0.2s cubic-bezier(0.2,0.9,0.3,2) 0.1s;transform:scale(1);"], ({
  showResult
}) => showResult ? '1' : '0');
const Spinner = styled.div.withConfig({
  displayName: "VizExLoadingSpinner__Spinner",
  componentId: "sc-1i0b5a7-3"
})(["transition:opacity 0.2s cubic-bezier(0.42,0,0.58,1),transform 0.2s cubic-bezier(0.89,0.03,0.68,0.22);opacity:", ";position:absolute;display:block;width:100%;height:100%;&::after{position:relative;box-sizing:border-box;content:'';width:100%;height:100%;display:inline-block;border:2px solid currentColor;border-bottom-color:transparent;border-left-color:transparent;border-radius:100%;background:transparent;animation:", " 0.75s linear infinite;}"], ({
  showResult
}) => showResult ? '0' : '1', privateSpin);
const defaultProps = {
  grow: false,
  showResult: false,
  resultAnimationDuration: 1500,
  onResultDisplayFinish: () => {},
  role: 'status',
  size: 'sm',
  use: SpinnerUses.PRIMARY,
  'data-testid': 'loading-spinner'
};

const VizExLoadingSpinner = props => {
  const {
    children,
    grow,
    onResultDisplayFinish,
    resultAnimationDuration,
    showResult,
    size,
    theme,
    use
  } = props,
        rest = _objectWithoutPropertiesLoose(props, ["children", "grow", "onResultDisplayFinish", "resultAnimationDuration", "showResult", "size", "theme", "use"]);

  const resultDisplayTimeoutRef = useRef();
  useEffect(() => {
    if (!showResult) return undefined;
    resultDisplayTimeoutRef.current = setTimeout( // eslint-disable-next-line @typescript-eslint/no-implied-eval
    onResultDisplayFinish, resultAnimationDuration);
    return () => {
      clearTimeout(resultDisplayTimeoutRef.current);
    };
  }, [onResultDisplayFinish, resultAnimationDuration, showResult]);
  const spinnerSizePx = LOADING_SPINNER_SIZES[size];
  return /*#__PURE__*/_jsx(SpinnerOuter, Object.assign({}, rest, {
    grow: grow,
    children: /*#__PURE__*/_jsxs(SpinnerInner, {
      size: spinnerSizePx,
      theme: theme,
      use: use,
      "data-testid": "spinner-inner",
      children: [/*#__PURE__*/_jsx(Spinner, {
        showResult: showResult
      }), /*#__PURE__*/_jsx(ResultSpinner, {
        showResult: showResult,
        "data-testid": "spinner-result",
        children: children
      })]
    })
  }));
};

VizExLoadingSpinner.propTypes = {
  children: PropTypes.node,
  grow: PropTypes.bool,
  onResultDisplayFinish: PropTypes.func,
  resultAnimationDuration: PropTypes.number.isRequired,
  role: PropTypes.string,
  showResult: PropTypes.bool,
  size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
  style: PropTypes.object,
  theme: themePropType,
  use: PropTypes.oneOf(Object.values(SpinnerUses))
};
VizExLoadingSpinner.defaultProps = defaultProps;
VizExLoadingSpinner.displayName = 'VizExLoadingSpinner';
export default VizExLoadingSpinner;