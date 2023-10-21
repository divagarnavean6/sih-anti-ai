'use es6';

import { mergeProps, filterDOMProps, chain } from '@react-aria/utils';
import { useFocusable } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';

function $701a24aa0da5b062$export$ea18c227d4417cc3(props, ref) {
  let {
    elementType = 'button',
    isDisabled: isDisabled,
    onPress: onPress,
    onPressStart: onPressStart,
    onPressEnd: onPressEnd,
    onPressChange: onPressChange,
    preventFocusOnPress: // @ts-ignore - undocumented
    preventFocusOnPress,
    allowFocusWhenDisabled: // @ts-ignore - undocumented
    allowFocusWhenDisabled,
    // @ts-ignore
    onClick: deprecatedOnClick,
    href: href,
    target: target,
    rel: rel,
    type = 'button'
  } = props;
  let additionalProps;
  if (elementType === 'button') additionalProps = {
    type: type,
    disabled: isDisabled
  };else additionalProps = {
    role: 'button',
    tabIndex: isDisabled ? undefined : 0,
    href: elementType === 'a' && isDisabled ? undefined : href,
    target: elementType === 'a' ? target : undefined,
    type: elementType === 'input' ? type : undefined,
    disabled: elementType === 'input' ? isDisabled : undefined,
    'aria-disabled': !isDisabled || elementType === 'input' ? undefined : isDisabled,
    rel: elementType === 'a' ? rel : undefined
  };
  let {
    pressProps: pressProps,
    isPressed: isPressed
  } = usePress({
    onPressStart: onPressStart,
    onPressEnd: onPressEnd,
    onPressChange: onPressChange,
    onPress: onPress,
    isDisabled: isDisabled,
    preventFocusOnPress: preventFocusOnPress,
    ref: ref
  });
  let {
    focusableProps: focusableProps
  } = useFocusable(props, ref);
  if (allowFocusWhenDisabled) focusableProps.tabIndex = isDisabled ? -1 : focusableProps.tabIndex;
  let buttonProps = mergeProps(focusableProps, pressProps, filterDOMProps(props, {
    labelable: true
  }));
  return {
    isPressed: isPressed,
    buttonProps: mergeProps(additionalProps, buttonProps, {
      'aria-haspopup': props['aria-haspopup'],
      'aria-expanded': props['aria-expanded'],
      'aria-controls': props['aria-controls'],
      'aria-pressed': props['aria-pressed'],
      onClick: e => {
        if (deprecatedOnClick) {
          deprecatedOnClick(e);
          console.warn('onClick is deprecated, please use onPress');
        }
      }
    })
  };
}

function $55f54f7887471b58$export$51e84d46ca0bc451(props, state, ref) {
  const {
    isSelected: isSelected
  } = state;
  const {
    isPressed: isPressed,
    buttonProps: buttonProps
  } = $701a24aa0da5b062$export$ea18c227d4417cc3(Object.assign({}, props, {
    onPress: chain(state.toggle, props.onPress)
  }), ref);
  return {
    isPressed: isPressed,
    buttonProps: mergeProps(buttonProps, {
      'aria-pressed': isSelected
    })
  };
}

export { $701a24aa0da5b062$export$ea18c227d4417cc3 as useButton, $55f54f7887471b58$export$51e84d46ca0bc451 as useToggleButton };