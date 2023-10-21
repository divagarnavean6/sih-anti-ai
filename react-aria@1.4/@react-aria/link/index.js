'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { filterDOMProps, mergeProps } from '@react-aria/utils';
import { useFocusable } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';

function $298d61e98472621b$export$dcf14c9974fe2767(props, ref) {
  let {
    elementType = 'a',
    onPress: onPress,
    onPressStart: onPressStart,
    onPressEnd: onPressEnd,
    // @ts-ignore
    onClick: deprecatedOnClick,
    isDisabled: isDisabled
  } = props,
      otherProps = _objectWithoutPropertiesLoose(props, ["elementType", "onPress", "onPressStart", "onPressEnd", "onClick", "isDisabled"]);

  let linkProps;
  if (elementType !== 'a') linkProps = {
    role: 'link',
    tabIndex: !isDisabled ? 0 : undefined
  };
  let {
    focusableProps: focusableProps
  } = useFocusable(props, ref);
  let {
    pressProps: pressProps,
    isPressed: isPressed
  } = usePress({
    onPress: onPress,
    onPressStart: onPressStart,
    onPressEnd: onPressEnd,
    isDisabled: isDisabled,
    ref: ref
  });
  let domProps = filterDOMProps(otherProps, {
    labelable: true
  });
  let interactionHandlers = mergeProps(focusableProps, pressProps);
  return {
    isPressed: isPressed,
    linkProps: mergeProps(domProps, Object.assign({}, interactionHandlers, {}, linkProps, {
      'aria-disabled': isDisabled || undefined,
      onClick: e => {
        pressProps.onClick(e);

        if (deprecatedOnClick) {
          deprecatedOnClick(e);
          console.warn('onClick is deprecated, please use onPress');
        }
      }
    }))
  };
}

export { $298d61e98472621b$export$dcf14c9974fe2767 as useLink };