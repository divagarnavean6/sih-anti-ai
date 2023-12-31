'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { useGlobalListeners, focusWithoutScrolling, mergeProps, useSyncRef, useEvent, useDescription, isIOS, runAfterTransition, useLayoutEffect, isMac } from '@react-aria/utils';
import $bx7SL$react, { useRef, useState, useMemo, useEffect, useContext, useCallback } from 'react'; // Note that state only matters here for iOS. Non-iOS gets user-select: none applied to the target element
// rather than at the document level so we just need to apply/remove user-select: none for each pressed element individually

let $14c0b72509d70225$var$state = 'default';
let $14c0b72509d70225$var$savedUserSelect = '';
let $14c0b72509d70225$var$modifiedElementMap = new WeakMap();

function $14c0b72509d70225$export$16a4697467175487(target) {
  if (isIOS()) {
    if ($14c0b72509d70225$var$state === 'default') {
      $14c0b72509d70225$var$savedUserSelect = document.documentElement.style.webkitUserSelect;
      document.documentElement.style.webkitUserSelect = 'none';
    }

    $14c0b72509d70225$var$state = 'disabled';
  } else if (target instanceof HTMLElement || target instanceof SVGElement) {
    // If not iOS, store the target's original user-select and change to user-select: none
    // Ignore state since it doesn't apply for non iOS
    $14c0b72509d70225$var$modifiedElementMap.set(target, target.style.userSelect);
    target.style.userSelect = 'none';
  }
}

function $14c0b72509d70225$export$b0d6fa1ab32e3295(target) {
  if (isIOS()) {
    // If the state is already default, there's nothing to do.
    // If it is restoring, then there's no need to queue a second restore.
    if ($14c0b72509d70225$var$state !== 'disabled') return;
    $14c0b72509d70225$var$state = 'restoring'; // There appears to be a delay on iOS where selection still might occur
    // after pointer up, so wait a bit before removing user-select.

    setTimeout(() => {
      // Wait for any CSS transitions to complete so we don't recompute style
      // for the whole page in the middle of the animation and cause jank.
      runAfterTransition(() => {
        // Avoid race conditions
        if ($14c0b72509d70225$var$state === 'restoring') {
          if (document.documentElement.style.webkitUserSelect === 'none') document.documentElement.style.webkitUserSelect = $14c0b72509d70225$var$savedUserSelect || '';
          $14c0b72509d70225$var$savedUserSelect = '';
          $14c0b72509d70225$var$state = 'default';
        }
      });
    }, 300);
  } else if (target instanceof HTMLElement || target instanceof SVGElement) // If not iOS, restore the target's original user-select if any
    // Ignore state since it doesn't apply for non iOS
    {
      if (target && $14c0b72509d70225$var$modifiedElementMap.has(target)) {
        let targetOldUserSelect = $14c0b72509d70225$var$modifiedElementMap.get(target);
        if (target.style.userSelect === 'none') target.style.userSelect = targetOldUserSelect;
        if (target.getAttribute('style') === '') target.removeAttribute('style');
        $14c0b72509d70225$var$modifiedElementMap.delete(target);
      }
    }
}

function $8a9cb279dc87e130$export$60278871457622de(event) {
  // JAWS/NVDA with Firefox.
  if (event.mozInputSource === 0 && event.isTrusted) return true;
  return event.detail === 0 && !event.pointerType;
}

class $8a9cb279dc87e130$export$905e7fc544a71f36 {
  isDefaultPrevented() {
    return this.nativeEvent.defaultPrevented;
  }

  preventDefault() {
    this.defaultPrevented = true;
    this.nativeEvent.preventDefault();
  }

  stopPropagation() {
    this.nativeEvent.stopPropagation();

    this.isPropagationStopped = () => true;
  }

  isPropagationStopped() {
    return false;
  }

  persist() {}

  constructor(type, nativeEvent) {
    this.nativeEvent = nativeEvent;
    this.target = nativeEvent.target;
    this.currentTarget = nativeEvent.currentTarget;
    this.relatedTarget = nativeEvent.relatedTarget;
    this.bubbles = nativeEvent.bubbles;
    this.cancelable = nativeEvent.cancelable;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.timeStamp = nativeEvent.timeStamp;
    this.type = type;
  }

}

function $8a9cb279dc87e130$export$715c682d09d639cc(onBlur) {
  let stateRef = useRef({
    isFocused: false,
    onBlur: onBlur,
    observer: null
  });
  stateRef.current.onBlur = onBlur; // Clean up MutationObserver on unmount. See below.
  // eslint-disable-next-line arrow-body-style

  useLayoutEffect(() => {
    const state = stateRef.current;
    return () => {
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
    };
  }, []); // This function is called during a React onFocus event.

  return useCallback(e1 => {
    // React does not fire onBlur when an element is disabled. https://github.com/facebook/react/issues/9142
    // Most browsers fire a native focusout event in this case, except for Firefox. In that case, we use a
    // MutationObserver to watch for the disabled attribute, and dispatch these events ourselves.
    // For browsers that do, focusout fires before the MutationObserver, so onBlur should not fire twice.
    if (e1.target instanceof HTMLButtonElement || e1.target instanceof HTMLInputElement || e1.target instanceof HTMLTextAreaElement || e1.target instanceof HTMLSelectElement) {
      stateRef.current.isFocused = true;
      let target = e1.target;

      let onBlurHandler = e => {
        var // For backward compatibility, dispatch a (fake) React synthetic event.
        _current, ref;

        stateRef.current.isFocused = false;
        if (target.disabled) (ref = (_current = stateRef.current).onBlur) === null || ref === void 0 ? void 0 : ref.call(_current, new $8a9cb279dc87e130$export$905e7fc544a71f36('blur', e)); // We no longer need the MutationObserver once the target is blurred.

        if (stateRef.current.observer) {
          stateRef.current.observer.disconnect();
          stateRef.current.observer = null;
        }
      };

      target.addEventListener('focusout', onBlurHandler, {
        once: true
      });
      stateRef.current.observer = new MutationObserver(() => {
        if (stateRef.current.isFocused && target.disabled) {
          stateRef.current.observer.disconnect();
          target.dispatchEvent(new FocusEvent('blur'));
          target.dispatchEvent(new FocusEvent('focusout', {
            bubbles: true
          }));
        }
      });
      stateRef.current.observer.observe(target, {
        attributes: true,
        attributeFilter: ['disabled']
      });
    }
  }, []);
}

const $ae1eeba8b9eafd08$export$5165eccb35aaadb5 = /*#__PURE__*/$bx7SL$react.createContext(null);
$ae1eeba8b9eafd08$export$5165eccb35aaadb5.displayName = 'PressResponderContext';

function $f6c31cce2adf654f$var$usePressResponderContext(props) {
  // Consume context from <PressResponder> and merge with props.
  let context = useContext($ae1eeba8b9eafd08$export$5165eccb35aaadb5);

  if (context) {
    let {
      register: register
    } = context,
        contextProps = _objectWithoutPropertiesLoose(context, ["register"]);

    props = mergeProps(contextProps, props);
    register();
  }

  useSyncRef(context, props.ref);
  return props;
}

function $f6c31cce2adf654f$export$45712eceda6fad21(props) {
  let _$f6c31cce2adf654f$va = $f6c31cce2adf654f$var$usePressResponderContext(props),
      {
    onPress: onPress1,
    onPressChange: onPressChange1,
    onPressStart: onPressStart1,
    onPressEnd: onPressEnd1,
    onPressUp: onPressUp1,
    isDisabled: isDisabled1,
    isPressed: isPressedProp,
    preventFocusOnPress: preventFocusOnPress,
    shouldCancelOnPointerExit: shouldCancelOnPointerExit,
    allowTextSelectionOnPress: allowTextSelectionOnPress
  } = _$f6c31cce2adf654f$va,
      domProps = _objectWithoutPropertiesLoose(_$f6c31cce2adf654f$va, ["onPress", "onPressChange", "onPressStart", "onPressEnd", "onPressUp", "isDisabled", "isPressed", "preventFocusOnPress", "shouldCancelOnPointerExit", "allowTextSelectionOnPress", "ref"]);

  let propsRef = useRef(null);
  propsRef.current = {
    onPress: onPress1,
    onPressChange: onPressChange1,
    onPressStart: onPressStart1,
    onPressEnd: onPressEnd1,
    onPressUp: onPressUp1,
    isDisabled: isDisabled1,
    shouldCancelOnPointerExit: shouldCancelOnPointerExit
  };
  let [isPressed, setPressed] = useState(false);
  let ref = useRef({
    isPressed: false,
    ignoreEmulatedMouseEvents: false,
    ignoreClickAfterPress: false,
    didFirePressStart: false,
    activePointerId: null,
    target: null,
    isOverTarget: false,
    pointerType: null
  });
  let {
    addGlobalListener: addGlobalListener,
    removeAllGlobalListeners: removeAllGlobalListeners
  } = useGlobalListeners();
  let pressProps1 = useMemo(() => {
    let state = ref.current;

    let triggerPressStart = (originalEvent, pointerType) => {
      let {
        onPressStart: onPressStart,
        onPressChange: onPressChange,
        isDisabled: isDisabled
      } = propsRef.current;
      if (isDisabled || state.didFirePressStart) return;
      if (onPressStart) onPressStart({
        type: 'pressstart',
        pointerType: pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
      if (onPressChange) onPressChange(true);
      state.didFirePressStart = true;
      setPressed(true);
    };

    let triggerPressEnd = (originalEvent, pointerType, wasPressed = true) => {
      let {
        onPressEnd: onPressEnd,
        onPressChange: onPressChange,
        onPress: onPress,
        isDisabled: isDisabled
      } = propsRef.current;
      if (!state.didFirePressStart) return;
      state.ignoreClickAfterPress = true;
      state.didFirePressStart = false;
      if (onPressEnd) onPressEnd({
        type: 'pressend',
        pointerType: pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
      if (onPressChange) onPressChange(false);
      setPressed(false);
      if (onPress && wasPressed && !isDisabled) onPress({
        type: 'press',
        pointerType: pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    };

    let triggerPressUp = (originalEvent, pointerType) => {
      let {
        onPressUp: onPressUp,
        isDisabled: isDisabled
      } = propsRef.current;
      if (isDisabled) return;
      if (onPressUp) onPressUp({
        type: 'pressup',
        pointerType: pointerType,
        target: originalEvent.currentTarget,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    };

    let cancel = e => {
      if (state.isPressed) {
        if (state.isOverTarget) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
        state.isPressed = false;
        state.isOverTarget = false;
        state.activePointerId = null;
        state.pointerType = null;
        removeAllGlobalListeners();
        if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
      }
    };

    let pressProps = {
      onKeyDown(e) {
        if ($f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent, e.currentTarget) && e.currentTarget.contains(e.target)) {
          if ($f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target, e.key)) e.preventDefault();
          e.stopPropagation(); // If the event is repeating, it may have started on a different element
          // after which focus moved to the current element. Ignore these events and
          // only handle the first key down event.

          if (!state.isPressed && !e.repeat) {
            state.target = e.currentTarget;
            state.isPressed = true;
            triggerPressStart(e, 'keyboard'); // Focus may move before the key up event, so register the event on the document
            // instead of the same element where the key down event occurred.

            addGlobalListener(document, 'keyup', onKeyUp, false);
          }
        } else if (e.key === 'Enter' && $f6c31cce2adf654f$var$isHTMLAnchorLink(e.currentTarget)) // If the target is a link, we won't have handled this above because we want the default
          // browser behavior to open the link when pressing Enter. But we still need to prevent
          // default so that elements above do not also handle it (e.g. table row).
          e.stopPropagation();
      },

      onKeyUp(e) {
        if ($f6c31cce2adf654f$var$isValidKeyboardEvent(e.nativeEvent, e.currentTarget) && !e.repeat && e.currentTarget.contains(e.target)) triggerPressUp($f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard');
      },

      onClick(e) {
        if (e && !e.currentTarget.contains(e.target)) return;

        if (e && e.button === 0) {
          e.stopPropagation();
          if (isDisabled1) e.preventDefault(); // If triggered from a screen reader or by using element.click(),
          // trigger as if it were a keyboard click.

          if (!state.ignoreClickAfterPress && !state.ignoreEmulatedMouseEvents && (state.pointerType === 'virtual' || $8a9cb279dc87e130$export$60278871457622de(e.nativeEvent))) {
            // Ensure the element receives focus (VoiceOver on iOS does not do this)
            if (!isDisabled1 && !preventFocusOnPress) focusWithoutScrolling(e.currentTarget);
            triggerPressStart(e, 'virtual');
            triggerPressUp(e, 'virtual');
            triggerPressEnd(e, 'virtual');
          }

          state.ignoreEmulatedMouseEvents = false;
          state.ignoreClickAfterPress = false;
        }
      }

    };

    let onKeyUp = e => {
      if (state.isPressed && $f6c31cce2adf654f$var$isValidKeyboardEvent(e, state.target)) {
        if ($f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(e.target, e.key)) e.preventDefault();
        e.stopPropagation();
        state.isPressed = false;
        let target = e.target;
        triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), 'keyboard', state.target.contains(target));
        removeAllGlobalListeners(); // If the target is a link, trigger the click method to open the URL,
        // but defer triggering pressEnd until onClick event handler.

        if (state.target instanceof HTMLElement && state.target.contains(target) && ($f6c31cce2adf654f$var$isHTMLAnchorLink(state.target) || state.target.getAttribute('role') === 'link')) state.target.click();
      }
    };

    if (typeof PointerEvent !== 'undefined') {
      pressProps.onPointerDown = e => {
        // Only handle left clicks, and ignore events that bubbled through portals.
        if (e.button !== 0 || !e.currentTarget.contains(e.target)) return; // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
        // Ignore and let the onClick handler take care of it instead.
        // https://bugs.webkit.org/show_bug.cgi?id=222627
        // https://bugs.webkit.org/show_bug.cgi?id=223202

        if ($f6c31cce2adf654f$var$isVirtualPointerEvent(e.nativeEvent)) {
          state.pointerType = 'virtual';
          return;
        } // Due to browser inconsistencies, especially on mobile browsers, we prevent
        // default on pointer down and handle focusing the pressable element ourselves.


        if ($f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
        state.pointerType = e.pointerType;
        e.stopPropagation();

        if (!state.isPressed) {
          state.isPressed = true;
          state.isOverTarget = true;
          state.activePointerId = e.pointerId;
          state.target = e.currentTarget;
          if (!isDisabled1 && !preventFocusOnPress) focusWithoutScrolling(e.currentTarget);
          if (!allowTextSelectionOnPress) $14c0b72509d70225$export$16a4697467175487(state.target);
          triggerPressStart(e, state.pointerType);
          addGlobalListener(document, 'pointermove', onPointerMove, false);
          addGlobalListener(document, 'pointerup', onPointerUp, false);
          addGlobalListener(document, 'pointercancel', onPointerCancel, false);
        }
      };

      pressProps.onMouseDown = e => {
        if (!e.currentTarget.contains(e.target)) return;

        if (e.button === 0) {
          // Chrome and Firefox on touch Windows devices require mouse down events
          // to be canceled in addition to pointer events, or an extra asynchronous
          // focus event will be fired.
          if ($f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
          e.stopPropagation();
        }
      };

      pressProps.onPointerUp = e => {
        // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
        if (!e.currentTarget.contains(e.target) || state.pointerType === 'virtual') return; // Only handle left clicks
        // Safari on iOS sometimes fires pointerup events, even
        // when the touch isn't over the target, so double check.

        if (e.button === 0 && $f6c31cce2adf654f$var$isOverTarget(e, e.currentTarget)) triggerPressUp(e, state.pointerType || e.pointerType);
      }; // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
      // Use pointer move events instead to implement our own hit testing.
      // See https://bugs.webkit.org/show_bug.cgi?id=199803


      let onPointerMove = e => {
        if (e.pointerId !== state.activePointerId) return;

        if ($f6c31cce2adf654f$var$isOverTarget(e, state.target)) {
          if (!state.isOverTarget) {
            state.isOverTarget = true;
            triggerPressStart($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);
          }
        } else if (state.isOverTarget) {
          state.isOverTarget = false;
          triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
          if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
        }
      };

      let onPointerUp = e => {
        if (e.pointerId === state.activePointerId && state.isPressed && e.button === 0) {
          if ($f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);else if (state.isOverTarget) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
          state.isPressed = false;
          state.isOverTarget = false;
          state.activePointerId = null;
          state.pointerType = null;
          removeAllGlobalListeners();
          if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
        }
      };

      let onPointerCancel = e => {
        cancel(e);
      };

      pressProps.onDragStart = e => {
        if (!e.currentTarget.contains(e.target)) return; // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.

        cancel(e);
      };
    } else {
      pressProps.onMouseDown = e => {
        // Only handle left clicks
        if (e.button !== 0 || !e.currentTarget.contains(e.target)) return; // Due to browser inconsistencies, especially on mobile browsers, we prevent
        // default on mouse down and handle focusing the pressable element ourselves.

        if ($f6c31cce2adf654f$var$shouldPreventDefault(e.currentTarget)) e.preventDefault();
        e.stopPropagation();
        if (state.ignoreEmulatedMouseEvents) return;
        state.isPressed = true;
        state.isOverTarget = true;
        state.target = e.currentTarget;
        state.pointerType = $8a9cb279dc87e130$export$60278871457622de(e.nativeEvent) ? 'virtual' : 'mouse';
        if (!isDisabled1 && !preventFocusOnPress) focusWithoutScrolling(e.currentTarget);
        triggerPressStart(e, state.pointerType);
        addGlobalListener(document, 'mouseup', onMouseUp, false);
      };

      pressProps.onMouseEnter = e => {
        if (!e.currentTarget.contains(e.target)) return;
        e.stopPropagation();

        if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
          state.isOverTarget = true;
          triggerPressStart(e, state.pointerType);
        }
      };

      pressProps.onMouseLeave = e => {
        if (!e.currentTarget.contains(e.target)) return;
        e.stopPropagation();

        if (state.isPressed && !state.ignoreEmulatedMouseEvents) {
          state.isOverTarget = false;
          triggerPressEnd(e, state.pointerType, false);
          if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
        }
      };

      pressProps.onMouseUp = e => {
        if (!e.currentTarget.contains(e.target)) return;
        if (!state.ignoreEmulatedMouseEvents && e.button === 0) triggerPressUp(e, state.pointerType);
      };

      let onMouseUp = e => {
        // Only handle left clicks
        if (e.button !== 0) return;
        state.isPressed = false;
        removeAllGlobalListeners();

        if (state.ignoreEmulatedMouseEvents) {
          state.ignoreEmulatedMouseEvents = false;
          return;
        }

        if ($f6c31cce2adf654f$var$isOverTarget(e, state.target)) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType);else if (state.isOverTarget) triggerPressEnd($f6c31cce2adf654f$var$createEvent(state.target, e), state.pointerType, false);
        state.isOverTarget = false;
      };

      pressProps.onTouchStart = e => {
        if (!e.currentTarget.contains(e.target)) return;
        e.stopPropagation();
        let touch = $f6c31cce2adf654f$var$getTouchFromEvent(e.nativeEvent);
        if (!touch) return;
        state.activePointerId = touch.identifier;
        state.ignoreEmulatedMouseEvents = true;
        state.isOverTarget = true;
        state.isPressed = true;
        state.target = e.currentTarget;
        state.pointerType = 'touch'; // Due to browser inconsistencies, especially on mobile browsers, we prevent default
        // on the emulated mouse event and handle focusing the pressable element ourselves.

        if (!isDisabled1 && !preventFocusOnPress) focusWithoutScrolling(e.currentTarget);
        if (!allowTextSelectionOnPress) $14c0b72509d70225$export$16a4697467175487(state.target);
        triggerPressStart(e, state.pointerType);
        addGlobalListener(window, 'scroll', onScroll, true);
      };

      pressProps.onTouchMove = e => {
        if (!e.currentTarget.contains(e.target)) return;
        e.stopPropagation();
        if (!state.isPressed) return;
        let touch = $f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);

        if (touch && $f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
          if (!state.isOverTarget) {
            state.isOverTarget = true;
            triggerPressStart(e, state.pointerType);
          }
        } else if (state.isOverTarget) {
          state.isOverTarget = false;
          triggerPressEnd(e, state.pointerType, false);
          if (propsRef.current.shouldCancelOnPointerExit) cancel(e);
        }
      };

      pressProps.onTouchEnd = e => {
        if (!e.currentTarget.contains(e.target)) return;
        e.stopPropagation();
        if (!state.isPressed) return;
        let touch = $f6c31cce2adf654f$var$getTouchById(e.nativeEvent, state.activePointerId);

        if (touch && $f6c31cce2adf654f$var$isOverTarget(touch, e.currentTarget)) {
          triggerPressUp(e, state.pointerType);
          triggerPressEnd(e, state.pointerType);
        } else if (state.isOverTarget) triggerPressEnd(e, state.pointerType, false);

        state.isPressed = false;
        state.activePointerId = null;
        state.isOverTarget = false;
        state.ignoreEmulatedMouseEvents = true;
        if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(state.target);
        removeAllGlobalListeners();
      };

      pressProps.onTouchCancel = e => {
        if (!e.currentTarget.contains(e.target)) return;
        e.stopPropagation();
        if (state.isPressed) cancel(e);
      };

      let onScroll = e => {
        if (state.isPressed && e.target.contains(state.target)) cancel({
          currentTarget: state.target,
          shiftKey: false,
          ctrlKey: false,
          metaKey: false,
          altKey: false
        });
      };

      pressProps.onDragStart = e => {
        if (!e.currentTarget.contains(e.target)) return;
        cancel(e);
      };
    }

    return pressProps;
  }, [addGlobalListener, isDisabled1, preventFocusOnPress, removeAllGlobalListeners, allowTextSelectionOnPress]); // Remove user-select: none in case component unmounts immediately after pressStart
  // eslint-disable-next-line arrow-body-style

  useEffect(() => {
    return () => {
      if (!allowTextSelectionOnPress) $14c0b72509d70225$export$b0d6fa1ab32e3295(ref.current.target);
    };
  }, [allowTextSelectionOnPress]);
  return {
    isPressed: isPressedProp || isPressed,
    pressProps: mergeProps(domProps, pressProps1)
  };
}

function $f6c31cce2adf654f$var$isHTMLAnchorLink(target) {
  return target.tagName === 'A' && target.hasAttribute('href');
}

function $f6c31cce2adf654f$var$isValidKeyboardEvent(event, currentTarget) {
  const {
    key: key,
    code: code
  } = event;
  const element = currentTarget;
  const role = element.getAttribute('role'); // Accessibility for keyboards. Space and Enter only.
  // "Spacebar" is for IE 11

  return (key === 'Enter' || key === ' ' || key === 'Spacebar' || code === 'Space') && !(element instanceof HTMLInputElement && !$f6c31cce2adf654f$var$isValidInputKey(element, key) || element instanceof HTMLTextAreaElement || element.isContentEditable) && (!$f6c31cce2adf654f$var$isHTMLAnchorLink(element) || role === 'button' && key !== 'Enter') && // An element with role='link' should only trigger with Enter key
  !(role === 'link' && key !== 'Enter');
}

function $f6c31cce2adf654f$var$getTouchFromEvent(event) {
  const {
    targetTouches: targetTouches
  } = event;
  if (targetTouches.length > 0) return targetTouches[0];
  return null;
}

function $f6c31cce2adf654f$var$getTouchById(event, pointerId) {
  const changedTouches = event.changedTouches;

  for (let i = 0; i < changedTouches.length; i++) {
    const touch = changedTouches[i];
    if (touch.identifier === pointerId) return touch;
  }

  return null;
}

function $f6c31cce2adf654f$var$createEvent(target, e) {
  return {
    currentTarget: target,
    shiftKey: e.shiftKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey
  };
}

function $f6c31cce2adf654f$var$getPointClientRect(point) {
  let offsetX = point.width / 2 || point.radiusX || 0;
  let offsetY = point.height / 2 || point.radiusY || 0;
  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX
  };
}

function $f6c31cce2adf654f$var$areRectanglesOverlapping(a, b) {
  // check if they cannot overlap on x axis
  if (a.left > b.right || b.left > a.right) return false; // check if they cannot overlap on y axis

  if (a.top > b.bottom || b.top > a.bottom) return false;
  return true;
}

function $f6c31cce2adf654f$var$isOverTarget(point, target) {
  let rect = target.getBoundingClientRect();
  let pointRect = $f6c31cce2adf654f$var$getPointClientRect(point);
  return $f6c31cce2adf654f$var$areRectanglesOverlapping(rect, pointRect);
}

function $f6c31cce2adf654f$var$shouldPreventDefault(target) {
  // We cannot prevent default if the target is a draggable element.
  return !(target instanceof HTMLElement) || !target.draggable;
}

function $f6c31cce2adf654f$var$shouldPreventDefaultKeyboard(target, key) {
  if (target instanceof HTMLInputElement) return !$f6c31cce2adf654f$var$isValidInputKey(target, key);
  if (target instanceof HTMLButtonElement) return target.type !== 'submit';
  return true;
}

const $f6c31cce2adf654f$var$nonTextInputTypes = new Set(['checkbox', 'radio', 'range', 'color', 'file', 'image', 'button', 'submit', 'reset']);

function $f6c31cce2adf654f$var$isValidInputKey(target, key) {
  // Only space should toggle checkboxes and radios, not enter.
  return target.type === 'checkbox' || target.type === 'radio' ? key === ' ' : $f6c31cce2adf654f$var$nonTextInputTypes.has(target.type);
}

function $f6c31cce2adf654f$var$isVirtualPointerEvent(event) {
  // If the pointer size is zero, then we assume it's from a screen reader.
  // Android TalkBack double tap will sometimes return a event with width and height of 1
  // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
  // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
  // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216. event.pointerType === 'mouse' is to distingush
  // Talkback double tap from Windows Firefox touch screen press
  return event.width === 0 && event.height === 0 || event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === 'mouse';
}

const $3b117e43dc0ca95d$export$27c701ed9e449e99 = /*#__PURE__*/$bx7SL$react.forwardRef((_ref, ref) => {
  let {
    children: children
  } = _ref,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  let newRef = useRef();
  ref = ref !== null && ref !== void 0 ? ref : newRef;
  let {
    pressProps: pressProps
  } = $f6c31cce2adf654f$export$45712eceda6fad21(Object.assign({}, props, {
    ref: ref
  }));
  let child = $bx7SL$react.Children.only(children);
  return /*#__PURE__*/$bx7SL$react.cloneElement(child, // @ts-ignore
  Object.assign({
    ref: ref
  }, mergeProps(child.props, pressProps)));
});
const $f1ab8c75478c6f73$export$3351871ee4b288b8 = /*#__PURE__*/$bx7SL$react.forwardRef((_ref2, ref) => {
  let {
    children: children
  } = _ref2,
      props = _objectWithoutPropertiesLoose(_ref2, ["children"]);

  let isRegistered = useRef(false);
  let prevContext = useContext($ae1eeba8b9eafd08$export$5165eccb35aaadb5);
  let context = mergeProps(prevContext || {}, Object.assign({}, props, {
    ref: ref || (prevContext === null || prevContext === void 0 ? void 0 : prevContext.ref),

    register() {
      isRegistered.current = true;
      if (prevContext) prevContext.register();
    }

  }));
  useSyncRef(prevContext, ref);
  useEffect(() => {
    if (!isRegistered.current) console.warn("A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.");
  }, []);
  return /*#__PURE__*/$bx7SL$react.createElement($ae1eeba8b9eafd08$export$5165eccb35aaadb5.Provider, {
    value: context
  }, children);
});

function $a1ea59d68270f0dd$export$f8168d8dd8fd66e6(props) {
  let {
    isDisabled: isDisabled,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    onFocusChange: onFocusChange
  } = props;
  const onBlur = useCallback(e => {
    if (e.target === e.currentTarget) {
      if (onBlurProp) onBlurProp(e);
      if (onFocusChange) onFocusChange(false);
      return true;
    }
  }, [onBlurProp, onFocusChange]);
  const onSyntheticFocus = $8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
  const onFocus = useCallback(e => {
    if (e.target === e.currentTarget) {
      if (onFocusProp) onFocusProp(e);
      if (onFocusChange) onFocusChange(true);
      onSyntheticFocus(e);
    }
  }, [onFocusChange, onFocusProp, onSyntheticFocus]);
  return {
    focusProps: {
      onFocus: !isDisabled && (onFocusProp || onFocusChange || onBlurProp) ? onFocus : undefined,
      onBlur: !isDisabled && (onBlurProp || onFocusChange) ? onBlur : null
    }
  };
}

let $507fabe10e71c6fb$var$currentModality = null;
let $507fabe10e71c6fb$var$changeHandlers = new Set();
let $507fabe10e71c6fb$var$hasSetupGlobalListeners = false;
let $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
let $507fabe10e71c6fb$var$hasBlurredWindowRecently = false; // Only Tab or Esc keys will make focus visible on text input elements

const $507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS = {
  Tab: true,
  Escape: true
};

function $507fabe10e71c6fb$var$triggerChangeHandlers(modality, e) {
  for (let handler of $507fabe10e71c6fb$var$changeHandlers) handler(modality, e);
}
/**
 * Helper function to determine if a KeyboardEvent is unmodified and could make keyboard focus styles visible.
 */


function $507fabe10e71c6fb$var$isValidKey(e) {
  // Control and Shift keys trigger when navigating back to the tab with keyboard.
  return !(e.metaKey || !isMac() && e.altKey || e.ctrlKey || e.key === 'Control' || e.key === 'Shift' || e.key === 'Meta');
}

function $507fabe10e71c6fb$var$handleKeyboardEvent(e) {
  $507fabe10e71c6fb$var$hasEventBeforeFocus = true;

  if ($507fabe10e71c6fb$var$isValidKey(e)) {
    $507fabe10e71c6fb$var$currentModality = 'keyboard';
    $507fabe10e71c6fb$var$triggerChangeHandlers('keyboard', e);
  }
}

function $507fabe10e71c6fb$var$handlePointerEvent(e) {
  $507fabe10e71c6fb$var$currentModality = 'pointer';

  if (e.type === 'mousedown' || e.type === 'pointerdown') {
    $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    $507fabe10e71c6fb$var$triggerChangeHandlers('pointer', e);
  }
}

function $507fabe10e71c6fb$var$handleClickEvent(e) {
  if ($8a9cb279dc87e130$export$60278871457622de(e)) {
    $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    $507fabe10e71c6fb$var$currentModality = 'virtual';
  }
}

function $507fabe10e71c6fb$var$handleFocusEvent(e) {
  // Firefox fires two extra focus events when the user first clicks into an iframe:
  // first on the window, then on the document. We ignore these events so they don't
  // cause keyboard focus rings to appear.
  if (e.target === window || e.target === document) return; // If a focus event occurs without a preceding keyboard or pointer event, switch to virtual modality.
  // This occurs, for example, when navigating a form with the next/previous buttons on iOS.

  if (!$507fabe10e71c6fb$var$hasEventBeforeFocus && !$507fabe10e71c6fb$var$hasBlurredWindowRecently) {
    $507fabe10e71c6fb$var$currentModality = 'virtual';
    $507fabe10e71c6fb$var$triggerChangeHandlers('virtual', e);
  }

  $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
  $507fabe10e71c6fb$var$hasBlurredWindowRecently = false;
}

function $507fabe10e71c6fb$var$handleWindowBlur() {
  // When the window is blurred, reset state. This is necessary when tabbing out of the window,
  // for example, since a subsequent focus event won't be fired.
  $507fabe10e71c6fb$var$hasEventBeforeFocus = false;
  $507fabe10e71c6fb$var$hasBlurredWindowRecently = true;
}
/**
 * Setup global event listeners to control when keyboard focus style should be visible.
 */


function $507fabe10e71c6fb$var$setupGlobalFocusEvents() {
  if (typeof window === 'undefined' || $507fabe10e71c6fb$var$hasSetupGlobalListeners) return; // Programmatic focus() calls shouldn't affect the current input modality.
  // However, we need to detect other cases when a focus event occurs without
  // a preceding user event (e.g. screen reader focus). Overriding the focus
  // method on HTMLElement.prototype is a bit hacky, but works.

  let focus = HTMLElement.prototype.focus;

  HTMLElement.prototype.focus = function () {
    $507fabe10e71c6fb$var$hasEventBeforeFocus = true;
    focus.apply(this, arguments);
  };

  document.addEventListener('keydown', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
  document.addEventListener('keyup', $507fabe10e71c6fb$var$handleKeyboardEvent, true);
  document.addEventListener('click', $507fabe10e71c6fb$var$handleClickEvent, true); // Register focus events on the window so they are sure to happen
  // before React's event listeners (registered on the document).

  window.addEventListener('focus', $507fabe10e71c6fb$var$handleFocusEvent, true);
  window.addEventListener('blur', $507fabe10e71c6fb$var$handleWindowBlur, false);

  if (typeof PointerEvent !== 'undefined') {
    document.addEventListener('pointerdown', $507fabe10e71c6fb$var$handlePointerEvent, true);
    document.addEventListener('pointermove', $507fabe10e71c6fb$var$handlePointerEvent, true);
    document.addEventListener('pointerup', $507fabe10e71c6fb$var$handlePointerEvent, true);
  } else {
    document.addEventListener('mousedown', $507fabe10e71c6fb$var$handlePointerEvent, true);
    document.addEventListener('mousemove', $507fabe10e71c6fb$var$handlePointerEvent, true);
    document.addEventListener('mouseup', $507fabe10e71c6fb$var$handlePointerEvent, true);
  }

  $507fabe10e71c6fb$var$hasSetupGlobalListeners = true;
}

if (typeof document !== 'undefined') {
  if (document.readyState !== 'loading') $507fabe10e71c6fb$var$setupGlobalFocusEvents();else document.addEventListener('DOMContentLoaded', $507fabe10e71c6fb$var$setupGlobalFocusEvents);
}

function $507fabe10e71c6fb$export$b9b3dfddab17db27() {
  return $507fabe10e71c6fb$var$currentModality !== 'pointer';
}

function $507fabe10e71c6fb$export$630ff653c5ada6a9() {
  return $507fabe10e71c6fb$var$currentModality;
}

function $507fabe10e71c6fb$export$8397ddfc504fdb9a(modality) {
  $507fabe10e71c6fb$var$currentModality = modality;
  $507fabe10e71c6fb$var$triggerChangeHandlers(modality, null);
}

function $507fabe10e71c6fb$export$98e20ec92f614cfe() {
  $507fabe10e71c6fb$var$setupGlobalFocusEvents();
  let [modality, setModality] = useState($507fabe10e71c6fb$var$currentModality);
  useEffect(() => {
    let handler = () => {
      setModality($507fabe10e71c6fb$var$currentModality);
    };

    $507fabe10e71c6fb$var$changeHandlers.add(handler);
    return () => {
      $507fabe10e71c6fb$var$changeHandlers.delete(handler);
    };
  }, []);
  return modality;
}
/**
 * If this is attached to text input component, return if the event is a focus event (Tab/Escape keys pressed) so that
 * focus visible style can be properly set.
 */


function $507fabe10e71c6fb$var$isKeyboardFocusEvent(isTextInput, modality, e) {
  return !(isTextInput && modality === 'keyboard' && e instanceof KeyboardEvent && !$507fabe10e71c6fb$var$FOCUS_VISIBLE_INPUT_KEYS[e.key]);
}

function $507fabe10e71c6fb$export$ffd9e5021c1fb2d6(props = {}) {
  let {
    isTextInput: isTextInput,
    autoFocus: autoFocus
  } = props;
  let [isFocusVisibleState, setFocusVisible] = useState(autoFocus || $507fabe10e71c6fb$export$b9b3dfddab17db27());
  $507fabe10e71c6fb$export$ec71b4b83ac08ec3($507fabe10e71c6fb$export$b9b3dfddab17db27 => {
    setFocusVisible($507fabe10e71c6fb$export$b9b3dfddab17db27);
  }, [isTextInput], {
    isTextInput: isTextInput
  });
  return {
    isFocusVisible: isFocusVisibleState
  };
}

function $507fabe10e71c6fb$export$ec71b4b83ac08ec3(fn, deps, opts) {
  $507fabe10e71c6fb$var$setupGlobalFocusEvents();
  useEffect(() => {
    let handler = (modality, e) => {
      if (!$507fabe10e71c6fb$var$isKeyboardFocusEvent(opts === null || opts === void 0 ? void 0 : opts.isTextInput, modality, e)) return;
      fn($507fabe10e71c6fb$export$b9b3dfddab17db27());
    };

    $507fabe10e71c6fb$var$changeHandlers.add(handler);
    return () => {
      $507fabe10e71c6fb$var$changeHandlers.delete(handler);
    };
  }, deps);
}

function $9ab94262bd0047c7$export$420e68273165f4ec(props) {
  let {
    isDisabled: isDisabled,
    onBlurWithin: onBlurWithin,
    onFocusWithin: onFocusWithin,
    onFocusWithinChange: onFocusWithinChange
  } = props;
  let state = useRef({
    isFocusWithin: false
  });
  let onBlur = useCallback(e => {
    // We don't want to trigger onBlurWithin and then immediately onFocusWithin again
    // when moving focus inside the element. Only trigger if the currentTarget doesn't
    // include the relatedTarget (where focus is moving).
    if (state.current.isFocusWithin && !e.currentTarget.contains(e.relatedTarget)) {
      state.current.isFocusWithin = false;
      if (onBlurWithin) onBlurWithin(e);
      if (onFocusWithinChange) onFocusWithinChange(false);
    }
  }, [onBlurWithin, onFocusWithinChange, state]);
  let onSyntheticFocus = $8a9cb279dc87e130$export$715c682d09d639cc(onBlur);
  let onFocus = useCallback(e => {
    if (!state.current.isFocusWithin) {
      if (onFocusWithin) onFocusWithin(e);
      if (onFocusWithinChange) onFocusWithinChange(true);
      state.current.isFocusWithin = true;
      onSyntheticFocus(e);
    }
  }, [onFocusWithin, onFocusWithinChange, onSyntheticFocus]);
  if (isDisabled) return {
    focusWithinProps: {
      onFocus: null,
      onBlur: null
    }
  };
  return {
    focusWithinProps: {
      onFocus: onFocus,
      onBlur: onBlur
    }
  };
} // iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.


let $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
let $6179b936705e76d3$var$hoverCount = 0;

function $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents() {
  $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = true; // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
  // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
  // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
  // the distant future because a user previously touched the element.

  setTimeout(() => {
    $6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents = false;
  }, 50);
}

function $6179b936705e76d3$var$handleGlobalPointerEvent(e) {
  if (e.pointerType === 'touch') $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents();
}

function $6179b936705e76d3$var$setupGlobalTouchEvents() {
  if (typeof document === 'undefined') return;
  if (typeof PointerEvent !== 'undefined') document.addEventListener('pointerup', $6179b936705e76d3$var$handleGlobalPointerEvent);else document.addEventListener('touchend', $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
  $6179b936705e76d3$var$hoverCount++;
  return () => {
    $6179b936705e76d3$var$hoverCount--;
    if ($6179b936705e76d3$var$hoverCount > 0) return;
    if (typeof PointerEvent !== 'undefined') document.removeEventListener('pointerup', $6179b936705e76d3$var$handleGlobalPointerEvent);else document.removeEventListener('touchend', $6179b936705e76d3$var$setGlobalIgnoreEmulatedMouseEvents);
  };
}

function $6179b936705e76d3$export$ae780daf29e6d456(props) {
  let {
    onHoverStart: onHoverStart,
    onHoverChange: onHoverChange,
    onHoverEnd: onHoverEnd,
    isDisabled: isDisabled
  } = props;
  let [isHovered, setHovered] = useState(false);
  let state = useRef({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
    pointerType: '',
    target: null
  }).current;
  useEffect($6179b936705e76d3$var$setupGlobalTouchEvents, []);
  let {
    hoverProps: hoverProps1,
    triggerHoverEnd: triggerHoverEnd1
  } = useMemo(() => {
    let triggerHoverStart = (event, pointerType) => {
      state.pointerType = pointerType;
      if (isDisabled || pointerType === 'touch' || state.isHovered || !event.currentTarget.contains(event.target)) return;
      state.isHovered = true;
      let target = event.currentTarget;
      state.target = target;
      if (onHoverStart) onHoverStart({
        type: 'hoverstart',
        target: target,
        pointerType: pointerType
      });
      if (onHoverChange) onHoverChange(true);
      setHovered(true);
    };

    let triggerHoverEnd = (event, pointerType) => {
      state.pointerType = '';
      state.target = null;
      if (pointerType === 'touch' || !state.isHovered) return;
      state.isHovered = false;
      let target = event.currentTarget;
      if (onHoverEnd) onHoverEnd({
        type: 'hoverend',
        target: target,
        pointerType: pointerType
      });
      if (onHoverChange) onHoverChange(false);
      setHovered(false);
    };

    let hoverProps = {};

    if (typeof PointerEvent !== 'undefined') {
      hoverProps.onPointerEnter = e => {
        if ($6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents && e.pointerType === 'mouse') return;
        triggerHoverStart(e, e.pointerType);
      };

      hoverProps.onPointerLeave = e => {
        if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, e.pointerType);
      };
    } else {
      hoverProps.onTouchStart = () => {
        state.ignoreEmulatedMouseEvents = true;
      };

      hoverProps.onMouseEnter = e => {
        if (!state.ignoreEmulatedMouseEvents && !$6179b936705e76d3$var$globalIgnoreEmulatedMouseEvents) triggerHoverStart(e, 'mouse');
        state.ignoreEmulatedMouseEvents = false;
      };

      hoverProps.onMouseLeave = e => {
        if (!isDisabled && e.currentTarget.contains(e.target)) triggerHoverEnd(e, 'mouse');
      };
    }

    return {
      hoverProps: hoverProps,
      triggerHoverEnd: triggerHoverEnd
    };
  }, [onHoverStart, onHoverChange, onHoverEnd, isDisabled, state]);
  useEffect(() => {
    // Call the triggerHoverEnd as soon as isDisabled changes to true
    // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
    if (isDisabled) triggerHoverEnd1({
      currentTarget: state.target
    }, state.pointerType);
  }, [isDisabled]);
  return {
    hoverProps: hoverProps1,
    isHovered: isHovered
  };
}

function $e0b6e0b68ec7f50f$export$872b660ac5a1ff98(props) {
  let {
    ref: ref,
    onInteractOutside: onInteractOutside,
    isDisabled: isDisabled,
    onInteractOutsideStart: onInteractOutsideStart
  } = props;
  let stateRef = useRef({
    isPointerDown: false,
    ignoreEmulatedMouseEvents: false,
    onInteractOutside: onInteractOutside,
    onInteractOutsideStart: onInteractOutsideStart
  });
  let state = stateRef.current;
  state.onInteractOutside = onInteractOutside;
  state.onInteractOutsideStart = onInteractOutsideStart;
  useEffect(() => {
    if (isDisabled) return;

    let onPointerDown = e => {
      if ($e0b6e0b68ec7f50f$var$isValidEvent(e, ref) && state.onInteractOutside) {
        if (state.onInteractOutsideStart) state.onInteractOutsideStart(e);
        state.isPointerDown = true;
      }
    }; // Use pointer events if available. Otherwise, fall back to mouse and touch events.


    if (typeof PointerEvent !== 'undefined') {
      let onPointerUp = e => {
        if (state.isPointerDown && state.onInteractOutside && $e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
          state.isPointerDown = false;
          state.onInteractOutside(e);
        }
      }; // changing these to capture phase fixed combobox


      document.addEventListener('pointerdown', onPointerDown, true);
      document.addEventListener('pointerup', onPointerUp, true);
      return () => {
        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('pointerup', onPointerUp, true);
      };
    } else {
      let onMouseUp = e => {
        if (state.ignoreEmulatedMouseEvents) state.ignoreEmulatedMouseEvents = false;else if (state.isPointerDown && state.onInteractOutside && $e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
          state.isPointerDown = false;
          state.onInteractOutside(e);
        }
      };

      let onTouchEnd = e => {
        state.ignoreEmulatedMouseEvents = true;

        if (state.onInteractOutside && state.isPointerDown && $e0b6e0b68ec7f50f$var$isValidEvent(e, ref)) {
          state.isPointerDown = false;
          state.onInteractOutside(e);
        }
      };

      document.addEventListener('mousedown', onPointerDown, true);
      document.addEventListener('mouseup', onMouseUp, true);
      document.addEventListener('touchstart', onPointerDown, true);
      document.addEventListener('touchend', onTouchEnd, true);
      return () => {
        document.removeEventListener('mousedown', onPointerDown, true);
        document.removeEventListener('mouseup', onMouseUp, true);
        document.removeEventListener('touchstart', onPointerDown, true);
        document.removeEventListener('touchend', onTouchEnd, true);
      };
    }
  }, [ref, state, isDisabled]);
}

function $e0b6e0b68ec7f50f$var$isValidEvent(event, ref) {
  if (event.button > 0) return false; // if the event target is no longer in the document

  if (event.target) {
    const ownerDocument = event.target.ownerDocument;
    if (!ownerDocument || !ownerDocument.documentElement.contains(event.target)) return false;
  }

  return ref.current && !ref.current.contains(event.target);
}

function $93925083ecbb358c$export$48d1ea6320830260(handler) {
  if (!handler) return;
  let shouldStopPropagation = true;
  return e => {
    let event = Object.assign({}, e, {
      preventDefault() {
        e.preventDefault();
      },

      isDefaultPrevented() {
        return e.isDefaultPrevented();
      },

      stopPropagation() {
        console.error('stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.');
      },

      continuePropagation() {
        shouldStopPropagation = false;
      }

    });
    handler(event);
    if (shouldStopPropagation) e.stopPropagation();
  };
}

function $46d819fcbaf35654$export$8f71654801c2f7cd(props) {
  return {
    keyboardProps: props.isDisabled ? {} : {
      onKeyDown: $93925083ecbb358c$export$48d1ea6320830260(props.onKeyDown),
      onKeyUp: $93925083ecbb358c$export$48d1ea6320830260(props.onKeyUp)
    }
  };
}

function $e8a7022cf87cba2a$export$36da96379f79f245(props) {
  let {
    onMoveStart: onMoveStart,
    onMove: onMove,
    onMoveEnd: onMoveEnd
  } = props;
  let state = useRef({
    didMove: false,
    lastPosition: null,
    id: null
  });
  let {
    addGlobalListener: addGlobalListener,
    removeGlobalListener: removeGlobalListener
  } = useGlobalListeners();
  let moveProps1 = useMemo(() => {
    let moveProps = {};

    let start = () => {
      $14c0b72509d70225$export$16a4697467175487();
      state.current.didMove = false;
    };

    let move = (originalEvent, pointerType, deltaX, deltaY) => {
      if (deltaX === 0 && deltaY === 0) return;

      if (!state.current.didMove) {
        state.current.didMove = true;
        onMoveStart === null || onMoveStart === void 0 ? void 0 : onMoveStart({
          type: 'movestart',
          pointerType: pointerType,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        });
      }

      onMove({
        type: 'move',
        pointerType: pointerType,
        deltaX: deltaX,
        deltaY: deltaY,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    };

    let end = (originalEvent, pointerType) => {
      $14c0b72509d70225$export$b0d6fa1ab32e3295();
      if (state.current.didMove) onMoveEnd === null || onMoveEnd === void 0 ? void 0 : onMoveEnd({
        type: 'moveend',
        pointerType: pointerType,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    };

    if (typeof PointerEvent === 'undefined') {
      let onMouseMove = e => {
        if (e.button === 0) {
          move(e, 'mouse', e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
          state.current.lastPosition = {
            pageX: e.pageX,
            pageY: e.pageY
          };
        }
      };

      let onMouseUp = e => {
        if (e.button === 0) {
          end(e, 'mouse');
          removeGlobalListener(window, 'mousemove', onMouseMove, false);
          removeGlobalListener(window, 'mouseup', onMouseUp, false);
        }
      };

      moveProps.onMouseDown = e => {
        if (e.button === 0) {
          start();
          e.stopPropagation();
          e.preventDefault();
          state.current.lastPosition = {
            pageX: e.pageX,
            pageY: e.pageY
          };
          addGlobalListener(window, 'mousemove', onMouseMove, false);
          addGlobalListener(window, 'mouseup', onMouseUp, false);
        }
      };

      let onTouchMove = e => {
        let touch = [...e.changedTouches].findIndex(({
          identifier: identifier
        }) => identifier === state.current.id);

        if (touch >= 0) {
          let {
            pageX: pageX,
            pageY: pageY
          } = e.changedTouches[touch];
          move(e, 'touch', pageX - state.current.lastPosition.pageX, pageY - state.current.lastPosition.pageY);
          state.current.lastPosition = {
            pageX: pageX,
            pageY: pageY
          };
        }
      };

      let onTouchEnd = e => {
        let touch = [...e.changedTouches].findIndex(({
          identifier: identifier
        }) => identifier === state.current.id);

        if (touch >= 0) {
          end(e, 'touch');
          state.current.id = null;
          removeGlobalListener(window, 'touchmove', onTouchMove);
          removeGlobalListener(window, 'touchend', onTouchEnd);
          removeGlobalListener(window, 'touchcancel', onTouchEnd);
        }
      };

      moveProps.onTouchStart = e => {
        if (e.changedTouches.length === 0 || state.current.id != null) return;
        let {
          pageX: pageX,
          pageY: pageY,
          identifier: identifier
        } = e.changedTouches[0];
        start();
        e.stopPropagation();
        e.preventDefault();
        state.current.lastPosition = {
          pageX: pageX,
          pageY: pageY
        };
        state.current.id = identifier;
        addGlobalListener(window, 'touchmove', onTouchMove, false);
        addGlobalListener(window, 'touchend', onTouchEnd, false);
        addGlobalListener(window, 'touchcancel', onTouchEnd, false);
      };
    } else {
      let onPointerMove = e => {
        if (e.pointerId === state.current.id) {
          let pointerType = e.pointerType || 'mouse'; // Problems with PointerEvent#movementX/movementY:
          // 1. it is always 0 on macOS Safari.
          // 2. On Chrome Android, it's scaled by devicePixelRatio, but not on Chrome macOS

          move(e, pointerType, e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY);
          state.current.lastPosition = {
            pageX: e.pageX,
            pageY: e.pageY
          };
        }
      };

      let onPointerUp = e => {
        if (e.pointerId === state.current.id) {
          let pointerType = e.pointerType || 'mouse';
          end(e, pointerType);
          state.current.id = null;
          removeGlobalListener(window, 'pointermove', onPointerMove, false);
          removeGlobalListener(window, 'pointerup', onPointerUp, false);
          removeGlobalListener(window, 'pointercancel', onPointerUp, false);
        }
      };

      moveProps.onPointerDown = e => {
        if (e.button === 0 && state.current.id == null) {
          start();
          e.stopPropagation();
          e.preventDefault();
          state.current.lastPosition = {
            pageX: e.pageX,
            pageY: e.pageY
          };
          state.current.id = e.pointerId;
          addGlobalListener(window, 'pointermove', onPointerMove, false);
          addGlobalListener(window, 'pointerup', onPointerUp, false);
          addGlobalListener(window, 'pointercancel', onPointerUp, false);
        }
      };
    }

    let triggerKeyboardMove = (e, deltaX, deltaY) => {
      start();
      move(e, 'keyboard', deltaX, deltaY);
      end(e, 'keyboard');
    };

    moveProps.onKeyDown = e => {
      switch (e.key) {
        case 'Left':
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(e, -1, 0);
          break;

        case 'Right':
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(e, 1, 0);
          break;

        case 'Up':
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(e, 0, -1);
          break;

        case 'Down':
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(e, 0, 1);
          break;
      }
    };

    return moveProps;
  }, [state, onMoveStart, onMove, onMoveEnd, addGlobalListener, removeGlobalListener]);
  return {
    moveProps: moveProps1
  };
}

function $7d0a636d7a4dcefd$export$2123ff2b87c81ca(props, ref) {
  let {
    onScroll: onScroll,
    isDisabled: isDisabled
  } = props;
  let onScrollHandler = useCallback(e => {
    // If the ctrlKey is pressed, this is a zoom event, do nothing.
    if (e.ctrlKey) return; // stop scrolling the page

    e.preventDefault();
    e.stopPropagation();
    if (onScroll) onScroll({
      deltaX: e.deltaX,
      deltaY: e.deltaY
    });
  }, [onScroll]);
  useEvent(ref, 'wheel', isDisabled ? null : onScrollHandler);
}

const $8a26561d2877236e$var$DEFAULT_THRESHOLD = 500;

function $8a26561d2877236e$export$c24ed0104d07eab9(props) {
  let {
    isDisabled: isDisabled,
    onLongPressStart: onLongPressStart,
    onLongPressEnd: onLongPressEnd,
    onLongPress: onLongPress,
    threshold = $8a26561d2877236e$var$DEFAULT_THRESHOLD,
    accessibilityDescription: accessibilityDescription
  } = props;
  const timeRef = useRef(null);
  let {
    addGlobalListener: addGlobalListener,
    removeGlobalListener: removeGlobalListener
  } = useGlobalListeners();
  let {
    pressProps: pressProps
  } = $f6c31cce2adf654f$export$45712eceda6fad21({
    isDisabled: isDisabled,

    onPressStart(e1) {
      if (e1.pointerType === 'mouse' || e1.pointerType === 'touch') {
        if (onLongPressStart) onLongPressStart(Object.assign({}, e1, {
          type: 'longpressstart'
        }));
        timeRef.current = setTimeout(() => {
          // Prevent other usePress handlers from also handling this event.
          e1.target.dispatchEvent(new PointerEvent('pointercancel', {
            bubbles: true
          }));
          if (onLongPress) onLongPress(Object.assign({}, e1, {
            type: 'longpress'
          }));
          timeRef.current = null;
        }, threshold); // Prevent context menu, which may be opened on long press on touch devices

        if (e1.pointerType === 'touch') {
          let onContextMenu = e => {
            e.preventDefault();
          };

          addGlobalListener(e1.target, 'contextmenu', onContextMenu, {
            once: true
          });
          addGlobalListener(window, 'pointerup', () => {
            // If no contextmenu event is fired quickly after pointerup, remove the handler
            // so future context menu events outside a long press are not prevented.
            setTimeout(() => {
              removeGlobalListener(e1.target, 'contextmenu', onContextMenu);
            }, 30);
          }, {
            once: true
          });
        }
      }
    },

    onPressEnd(e) {
      if (timeRef.current) clearTimeout(timeRef.current);
      if (onLongPressEnd && (e.pointerType === 'mouse' || e.pointerType === 'touch')) onLongPressEnd(Object.assign({}, e, {
        type: 'longpressend'
      }));
    }

  });
  let descriptionProps = useDescription(onLongPress && !isDisabled ? accessibilityDescription : null);
  return {
    longPressProps: mergeProps(pressProps, descriptionProps)
  };
}

export { $f1ab8c75478c6f73$export$3351871ee4b288b8 as PressResponder, $3b117e43dc0ca95d$export$27c701ed9e449e99 as Pressable, $507fabe10e71c6fb$export$630ff653c5ada6a9 as getInteractionModality, $507fabe10e71c6fb$export$b9b3dfddab17db27 as isFocusVisible, $507fabe10e71c6fb$export$8397ddfc504fdb9a as setInteractionModality, $a1ea59d68270f0dd$export$f8168d8dd8fd66e6 as useFocus, $507fabe10e71c6fb$export$ffd9e5021c1fb2d6 as useFocusVisible, $507fabe10e71c6fb$export$ec71b4b83ac08ec3 as useFocusVisibleListener, $9ab94262bd0047c7$export$420e68273165f4ec as useFocusWithin, $6179b936705e76d3$export$ae780daf29e6d456 as useHover, $e0b6e0b68ec7f50f$export$872b660ac5a1ff98 as useInteractOutside, $507fabe10e71c6fb$export$98e20ec92f614cfe as useInteractionModality, $46d819fcbaf35654$export$8f71654801c2f7cd as useKeyboard, $8a26561d2877236e$export$c24ed0104d07eab9 as useLongPress, $e8a7022cf87cba2a$export$36da96379f79f245 as useMove, $f6c31cce2adf654f$export$45712eceda6fad21 as usePress, $7d0a636d7a4dcefd$export$2123ff2b87c81ca as useScrollWheel };