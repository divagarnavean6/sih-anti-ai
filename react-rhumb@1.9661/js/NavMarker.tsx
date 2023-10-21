import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import useNavMarker from './useNavMarker';

const NavMarkerImpl = ({
  name
}) => {
  useNavMarker(name);
  return null;
};

if (process.env.NODE_ENV !== 'production') {
  NavMarkerImpl.propTypes = {
    name: PropTypes.string.isRequired
  };
}

const NavMarker = ({
  children,
  name
}) => /*#__PURE__*/_jsxs(_Fragment, {
  children: [children, /*#__PURE__*/_jsx(NavMarkerImpl, {
    name: name
  })]
});

if (process.env.NODE_ENV !== 'production') {
  NavMarker.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node
  };
}

export default NavMarker;