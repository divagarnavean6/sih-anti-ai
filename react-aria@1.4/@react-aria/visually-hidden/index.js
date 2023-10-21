'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { mergeProps } from '@react-aria/utils';
import $9BxnE$react, { useState, useMemo } from 'react';
import { useFocus } from '@react-aria/interactions';
const $5c3e21d68f1c4674$var$styles = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  margin: '0 -1px -1px 0',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: 1,
  whiteSpace: 'nowrap'
};

function $5c3e21d68f1c4674$export$a966af930f325cab(props = {}) {
  let {
    style: style,
    isFocusable: isFocusable
  } = props;
  let [isFocused, setFocused] = useState(false);
  let {
    focusProps: focusProps
  } = useFocus({
    isDisabled: !isFocusable,
    onFocusChange: setFocused
  }); // If focused, don't hide the element.

  let combinedStyles = useMemo(() => {
    if (isFocused) return style;else if (style) return Object.assign({}, $5c3e21d68f1c4674$var$styles, {}, style);else return $5c3e21d68f1c4674$var$styles;
  }, [isFocused]);
  return {
    visuallyHiddenProps: Object.assign({}, focusProps, {
      style: combinedStyles
    })
  };
}

function $5c3e21d68f1c4674$export$439d29a4e110a164(props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let {
    children: children,
    elementType: Element = 'div'
  } = props,
      otherProps = _objectWithoutPropertiesLoose(props, ["children", "elementType", "isFocusable", "style"]);

  let {
    visuallyHiddenProps: visuallyHiddenProps
  } = $5c3e21d68f1c4674$export$a966af930f325cab(props);
  return /*#__PURE__*/$9BxnE$react.createElement(Element, mergeProps(otherProps, visuallyHiddenProps), children);
}

export { $5c3e21d68f1c4674$export$439d29a4e110a164 as VisuallyHidden, $5c3e21d68f1c4674$export$a966af930f325cab as useVisuallyHidden };