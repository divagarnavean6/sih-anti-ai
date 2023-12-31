'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import $k7QOs$react, { useState, useCallback, useRef, useEffect, useContext, useMemo } from 'react';
import { useLayoutEffect, useId, isIOS, chain, useLabels, getScrollParent } from '@react-aria/utils';
import { useLocale, useLocalizedStringFormatter } from '@react-aria/i18n';
import { useInteractOutside, useFocusWithin } from '@react-aria/interactions';
import $k7QOs$reactdom from 'react-dom';
import { useIsSSR } from '@react-aria/ssr';
import { VisuallyHidden } from '@react-aria/visually-hidden';

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

const $edcf132a9284368a$var$AXIS = {
  top: 'top',
  bottom: 'top',
  left: 'left',
  right: 'left'
};
const $edcf132a9284368a$var$FLIPPED_DIRECTION = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
};
const $edcf132a9284368a$var$CROSS_AXIS = {
  top: 'left',
  left: 'top'
};
const $edcf132a9284368a$var$AXIS_SIZE = {
  top: 'height',
  left: 'width'
};
const $edcf132a9284368a$var$PARSED_PLACEMENT_CACHE = {}; // @ts-ignore

let $edcf132a9284368a$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;

function $edcf132a9284368a$var$getContainerDimensions(containerNode) {
  let width = 0,
      height = 0,
      top = 0,
      left = 0;
  let scroll = {};

  if (containerNode.tagName === 'BODY') {
    let documentElement = document.documentElement;
    var ref;
    width = (ref = $edcf132a9284368a$var$visualViewport === null || $edcf132a9284368a$var$visualViewport === void 0 ? void 0 : $edcf132a9284368a$var$visualViewport.width) !== null && ref !== void 0 ? ref : documentElement.clientWidth;
    var ref1;
    height = (ref1 = $edcf132a9284368a$var$visualViewport === null || $edcf132a9284368a$var$visualViewport === void 0 ? void 0 : $edcf132a9284368a$var$visualViewport.height) !== null && ref1 !== void 0 ? ref1 : documentElement.clientHeight;
    scroll.top = documentElement.scrollTop || containerNode.scrollTop;
    scroll.left = documentElement.scrollLeft || containerNode.scrollLeft;
  } else {
    ({
      width: width,
      height: height,
      top: top,
      left: left
    } = $edcf132a9284368a$var$getOffset(containerNode));
    scroll.top = containerNode.scrollTop;
    scroll.left = containerNode.scrollLeft;
  }

  return {
    width: width,
    height: height,
    scroll: scroll,
    top: top,
    left: left
  };
}

function $edcf132a9284368a$var$getScroll(node) {
  return {
    top: node.scrollTop,
    left: node.scrollLeft,
    width: node.scrollWidth,
    height: node.scrollHeight
  };
}

function $edcf132a9284368a$var$getDelta(axis, offset, size, containerDimensions, padding) {
  let containerScroll = containerDimensions.scroll[axis];
  let containerHeight = containerDimensions[$edcf132a9284368a$var$AXIS_SIZE[axis]];
  let startEdgeOffset = offset - padding - containerScroll;
  let endEdgeOffset = offset + padding - containerScroll + size;
  if (startEdgeOffset < 0) return -startEdgeOffset;else if (endEdgeOffset > containerHeight) return Math.max(containerHeight - endEdgeOffset, -startEdgeOffset);else return 0;
}

function $edcf132a9284368a$var$getMargins(node) {
  let style = window.getComputedStyle(node);
  return {
    top: parseInt(style.marginTop, 10) || 0,
    bottom: parseInt(style.marginBottom, 10) || 0,
    left: parseInt(style.marginLeft, 10) || 0,
    right: parseInt(style.marginRight, 10) || 0
  };
}

function $edcf132a9284368a$var$parsePlacement(input) {
  if ($edcf132a9284368a$var$PARSED_PLACEMENT_CACHE[input]) return $edcf132a9284368a$var$PARSED_PLACEMENT_CACHE[input];
  let [placement, crossPlacement] = input.split(' ');
  let axis = $edcf132a9284368a$var$AXIS[placement] || 'right';
  let crossAxis = $edcf132a9284368a$var$CROSS_AXIS[axis];
  if (!$edcf132a9284368a$var$AXIS[crossPlacement]) crossPlacement = 'center';
  let size = $edcf132a9284368a$var$AXIS_SIZE[axis];
  let crossSize = $edcf132a9284368a$var$AXIS_SIZE[crossAxis];
  $edcf132a9284368a$var$PARSED_PLACEMENT_CACHE[input] = {
    placement: placement,
    crossPlacement: crossPlacement,
    axis: axis,
    crossAxis: crossAxis,
    size: size,
    crossSize: crossSize
  };
  return $edcf132a9284368a$var$PARSED_PLACEMENT_CACHE[input];
}

function $edcf132a9284368a$var$computePosition(childOffset, boundaryDimensions, overlaySize, placementInfo, offset, crossOffset, containerOffsetWithBoundary, isContainerPositioned) {
  let {
    placement: placement,
    crossPlacement: crossPlacement,
    axis: axis,
    crossAxis: crossAxis,
    size: size,
    crossSize: crossSize
  } = placementInfo;
  let position = {}; // button position

  position[crossAxis] = childOffset[crossAxis];
  if (crossPlacement === 'center') //  + (button size / 2) - (overlay size / 2)
    // at this point the overlay center should match the button center
    position[crossAxis] += (childOffset[crossSize] - overlaySize[crossSize]) / 2;else if (crossPlacement !== crossAxis) //  + (button size) - (overlay size)
    // at this point the overlay bottom should match the button bottom
    position[crossAxis] += childOffset[crossSize] - overlaySize[crossSize];
  /* else {
  the overlay top should match the button top
  } */
  // add the crossOffset from props

  position[crossAxis] += crossOffset; // this is button center position - the overlay size + half of the button to align bottom of overlay with button center

  let minViablePosition = childOffset[crossAxis] + childOffset[crossSize] / 2 - overlaySize[crossSize]; // this is button position of center, aligns top of overlay with button center

  let maxViablePosition = childOffset[crossAxis] + childOffset[crossSize] / 2; // clamp it into the range of the min/max positions

  position[crossAxis] = Math.min(Math.max(minViablePosition, position[crossAxis]), maxViablePosition); // Floor these so the position isn't placed on a partial pixel, only whole pixels. Shouldn't matter if it was floored or ceiled, so chose one.

  if (placement === axis) {
    // If the container is positioned (non-static), then we use the container's actual
    // height, as `bottom` will be relative to this height.  But if the container is static,
    // then it can only be the `document.body`, and `bottom` will be relative to _its_
    // container, which should be as large as boundaryDimensions.
    const containerHeight = isContainerPositioned ? containerOffsetWithBoundary[size] : boundaryDimensions[size];
    position[$edcf132a9284368a$var$FLIPPED_DIRECTION[axis]] = Math.floor(containerHeight - childOffset[axis] + offset);
  } else position[axis] = Math.floor(childOffset[axis] + childOffset[size] + offset);

  return position;
}

function $edcf132a9284368a$var$getMaxHeight(position, boundaryDimensions, containerOffsetWithBoundary, childOffset, margins, padding) {
  return position.top != null ? Math.max(0, boundaryDimensions.height + boundaryDimensions.top + boundaryDimensions.scroll.top - (containerOffsetWithBoundary.top + position.top) - (margins.top + margins.bottom + padding) // save additional space for margin and padding
  ) : Math.max(0, childOffset.top + containerOffsetWithBoundary.top - (boundaryDimensions.top + boundaryDimensions.scroll.top) - (margins.top + margins.bottom + padding) // save additional space for margin and padding
  );
}

function $edcf132a9284368a$var$getAvailableSpace(boundaryDimensions, containerOffsetWithBoundary, childOffset, margins, padding, placementInfo) {
  let {
    placement: placement,
    axis: axis,
    size: size
  } = placementInfo;
  if (placement === axis) return Math.max(0, childOffset[axis] - boundaryDimensions[axis] - boundaryDimensions.scroll[axis] + containerOffsetWithBoundary[axis] - margins[axis] - margins[$edcf132a9284368a$var$FLIPPED_DIRECTION[axis]] - padding);
  return Math.max(0, boundaryDimensions[size] + boundaryDimensions[axis] + boundaryDimensions.scroll[axis] - containerOffsetWithBoundary[axis] - childOffset[axis] - childOffset[size] - margins[axis] - margins[$edcf132a9284368a$var$FLIPPED_DIRECTION[axis]] - padding);
}

function $edcf132a9284368a$export$6839422d1f33cee9(placementInput, childOffset, overlaySize, scrollSize, margins, padding, flip, boundaryDimensions, containerOffsetWithBoundary, offset, crossOffset, isContainerPositioned, userSetMaxHeight) {
  let placementInfo = $edcf132a9284368a$var$parsePlacement(placementInput);
  let {
    size: size,
    crossAxis: crossAxis,
    crossSize: crossSize,
    placement: placement,
    crossPlacement: crossPlacement
  } = placementInfo;
  let position = $edcf132a9284368a$var$computePosition(childOffset, boundaryDimensions, overlaySize, placementInfo, offset, crossOffset, containerOffsetWithBoundary, isContainerPositioned);
  let normalizedOffset = offset;
  let space = $edcf132a9284368a$var$getAvailableSpace(boundaryDimensions, containerOffsetWithBoundary, childOffset, margins, padding + offset, placementInfo); // Check if the scroll size of the overlay is greater than the available space to determine if we need to flip

  if (flip && scrollSize[size] > space) {
    let flippedPlacementInfo = $edcf132a9284368a$var$parsePlacement(`${$edcf132a9284368a$var$FLIPPED_DIRECTION[placement]} ${crossPlacement}`);
    let flippedPosition = $edcf132a9284368a$var$computePosition(childOffset, boundaryDimensions, overlaySize, flippedPlacementInfo, offset, crossOffset, containerOffsetWithBoundary, isContainerPositioned);
    let flippedSpace = $edcf132a9284368a$var$getAvailableSpace(boundaryDimensions, containerOffsetWithBoundary, childOffset, margins, padding + offset, flippedPlacementInfo); // If the available space for the flipped position is greater than the original available space, flip.

    if (flippedSpace > space) {
      placementInfo = flippedPlacementInfo;
      position = flippedPosition;
      normalizedOffset = offset;
    }
  }

  let delta = $edcf132a9284368a$var$getDelta(crossAxis, position[crossAxis], overlaySize[crossSize], boundaryDimensions, padding);
  position[crossAxis] += delta;
  let maxHeight = $edcf132a9284368a$var$getMaxHeight(position, boundaryDimensions, containerOffsetWithBoundary, childOffset, margins, padding);
  if (userSetMaxHeight && userSetMaxHeight < maxHeight) maxHeight = userSetMaxHeight;
  overlaySize.height = Math.min(overlaySize.height, maxHeight);
  position = $edcf132a9284368a$var$computePosition(childOffset, boundaryDimensions, overlaySize, placementInfo, normalizedOffset, crossOffset, containerOffsetWithBoundary, isContainerPositioned);
  delta = $edcf132a9284368a$var$getDelta(crossAxis, position[crossAxis], overlaySize[crossSize], boundaryDimensions, padding);
  position[crossAxis] += delta;
  let arrowPosition = {};
  arrowPosition[crossAxis] = childOffset[crossAxis] - position[crossAxis] + childOffset[crossSize] / 2;
  return {
    position: position,
    maxHeight: maxHeight,
    arrowOffsetLeft: arrowPosition.left,
    arrowOffsetTop: arrowPosition.top,
    placement: placementInfo.placement
  };
}

function $edcf132a9284368a$export$b3ceb0cbf1056d98(opts) {
  let {
    placement: placement,
    targetNode: targetNode,
    overlayNode: overlayNode,
    scrollNode: scrollNode,
    padding: padding,
    shouldFlip: shouldFlip,
    boundaryElement: boundaryElement,
    offset: offset,
    crossOffset: crossOffset,
    maxHeight: maxHeight
  } = opts;
  let container = overlayNode instanceof HTMLElement && overlayNode.offsetParent || document.body;
  let isBodyContainer = container.tagName === 'BODY';
  const containerPositionStyle = window.getComputedStyle(container).position;
  let isContainerPositioned = !!containerPositionStyle && containerPositionStyle !== 'static';
  let childOffset = isBodyContainer ? $edcf132a9284368a$var$getOffset(targetNode) : $edcf132a9284368a$var$getPosition(targetNode, container);

  if (!isBodyContainer) {
    let {
      marginTop: marginTop,
      marginLeft: marginLeft
    } = window.getComputedStyle(targetNode);
    childOffset.top += parseInt(marginTop, 10) || 0;
    childOffset.left += parseInt(marginLeft, 10) || 0;
  }

  let overlaySize = $edcf132a9284368a$var$getOffset(overlayNode);
  let margins = $edcf132a9284368a$var$getMargins(overlayNode);
  overlaySize.width += margins.left + margins.right;
  overlaySize.height += margins.top + margins.bottom;
  let scrollSize = $edcf132a9284368a$var$getScroll(scrollNode);
  let boundaryDimensions = $edcf132a9284368a$var$getContainerDimensions(boundaryElement);
  let containerOffsetWithBoundary = boundaryElement.tagName === 'BODY' ? $edcf132a9284368a$var$getOffset(container) : $edcf132a9284368a$var$getPosition(container, boundaryElement);
  return $edcf132a9284368a$export$6839422d1f33cee9(placement, childOffset, overlaySize, scrollSize, margins, padding, shouldFlip, boundaryDimensions, containerOffsetWithBoundary, offset, crossOffset, isContainerPositioned, maxHeight);
}

function $edcf132a9284368a$var$getOffset(node) {
  let {
    top: top,
    left: left,
    width: width,
    height: height
  } = node.getBoundingClientRect();
  let {
    scrollTop: scrollTop,
    scrollLeft: scrollLeft,
    clientTop: clientTop,
    clientLeft: clientLeft
  } = document.documentElement;
  return {
    top: top + scrollTop - clientTop,
    left: left + scrollLeft - clientLeft,
    width: width,
    height: height
  };
}

function $edcf132a9284368a$var$getPosition(node, parent) {
  let style = window.getComputedStyle(node);
  let offset;

  if (style.position === 'fixed') {
    let {
      top: top,
      left: left,
      width: width,
      height: height
    } = node.getBoundingClientRect();
    offset = {
      top: top,
      left: left,
      width: width,
      height: height
    };
  } else {
    offset = $edcf132a9284368a$var$getOffset(node);
    let parentOffset = $edcf132a9284368a$var$getOffset(parent);
    let parentStyle = window.getComputedStyle(parent);
    parentOffset.top += (parseInt(parentStyle.borderTopWidth, 10) || 0) - parent.scrollTop;
    parentOffset.left += (parseInt(parentStyle.borderLeftWidth, 10) || 0) - parent.scrollLeft;
    offset.top -= parentOffset.top;
    offset.left -= parentOffset.left;
  }

  offset.top -= parseInt(style.marginTop, 10) || 0;
  offset.left -= parseInt(style.marginLeft, 10) || 0;
  return offset;
}

const $dd149f63282afbbf$export$f6211563215e3b37 = new WeakMap();

function $dd149f63282afbbf$export$18fc8428861184da(opts) {
  let {
    triggerRef: triggerRef,
    isOpen: isOpen,
    onClose: onClose
  } = opts;
  useEffect(() => {
    if (!isOpen) return;

    let onScroll = e => {
      // Ignore if scrolling an scrollable region outside the trigger's tree.
      let target = e.target; // window is not a Node and doesn't have contain, but window contains everything

      if (!triggerRef.current || target instanceof Node && !target.contains(triggerRef.current)) return;
      let onCloseHandler = onClose || $dd149f63282afbbf$export$f6211563215e3b37.get(triggerRef.current);
      if (onCloseHandler) onCloseHandler();
    };

    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [isOpen, onClose, triggerRef]);
} // @ts-ignore


let $2a41e45df1593e64$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;

function $2a41e45df1593e64$export$d39e1813b3bdd0e1(props) {
  let {
    direction: direction
  } = useLocale();
  let {
    targetRef: targetRef,
    overlayRef: overlayRef,
    scrollRef = overlayRef,
    placement = 'bottom',
    containerPadding = 12,
    shouldFlip = true,
    boundaryElement = typeof document !== 'undefined' ? document.body : null,
    offset = 0,
    crossOffset = 0,
    shouldUpdatePosition = true,
    isOpen = true,
    onClose: onClose,
    maxHeight: maxHeight
  } = props;
  let [position, setPosition] = useState({
    position: {},
    arrowOffsetLeft: undefined,
    arrowOffsetTop: undefined,
    maxHeight: undefined,
    placement: undefined
  });
  let deps = [shouldUpdatePosition, placement, overlayRef.current, targetRef.current, scrollRef.current, containerPadding, shouldFlip, boundaryElement, offset, crossOffset, isOpen, direction, maxHeight];
  let updatePosition = useCallback(() => {
    if (shouldUpdatePosition === false || !isOpen || !overlayRef.current || !targetRef.current || !scrollRef.current || !boundaryElement) return;
    setPosition($edcf132a9284368a$export$b3ceb0cbf1056d98({
      placement: $2a41e45df1593e64$var$translateRTL(placement, direction),
      overlayNode: overlayRef.current,
      targetNode: targetRef.current,
      scrollNode: scrollRef.current,
      padding: containerPadding,
      shouldFlip: shouldFlip,
      boundaryElement: boundaryElement,
      offset: offset,
      crossOffset: crossOffset,
      maxHeight: maxHeight
    }));
  }, deps); // Update position when anything changes

  useLayoutEffect(updatePosition, deps); // Update position on window resize

  $2a41e45df1593e64$var$useResize(updatePosition); // Reposition the overlay and do not close on scroll while the visual viewport is resizing.
  // This will ensure that overlays adjust their positioning when the iOS virtual keyboard appears.

  let isResizing = useRef(false);
  useLayoutEffect(() => {
    let timeout;

    let onResize = () => {
      isResizing.current = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isResizing.current = false;
      }, 500);
      updatePosition();
    };

    $2a41e45df1593e64$var$visualViewport === null || $2a41e45df1593e64$var$visualViewport === void 0 ? void 0 : $2a41e45df1593e64$var$visualViewport.addEventListener('resize', onResize);
    return () => {
      $2a41e45df1593e64$var$visualViewport === null || $2a41e45df1593e64$var$visualViewport === void 0 ? void 0 : $2a41e45df1593e64$var$visualViewport.removeEventListener('resize', onResize);
    };
  }, [updatePosition]);
  let close = useCallback(() => {
    if (!isResizing.current) onClose();
  }, [onClose, isResizing]); // When scrolling a parent scrollable region of the trigger (other than the body),
  // we hide the popover. Otherwise, its position would be incorrect.

  $dd149f63282afbbf$export$18fc8428861184da({
    triggerRef: targetRef,
    isOpen: isOpen,
    onClose: onClose ? close : undefined
  });
  return {
    overlayProps: {
      style: Object.assign({
        position: 'absolute',
        zIndex: 100000
      }, position.position, {
        maxHeight: position.maxHeight
      })
    },
    placement: position.placement,
    arrowProps: {
      style: {
        left: position.arrowOffsetLeft,
        top: position.arrowOffsetTop
      }
    },
    updatePosition: updatePosition
  };
}

function $2a41e45df1593e64$var$useResize(onResize) {
  useLayoutEffect(() => {
    window.addEventListener('resize', onResize, false);
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, [onResize]);
}

function $2a41e45df1593e64$var$translateRTL(position, direction) {
  if (direction === 'rtl') return position.replace('start', 'right').replace('end', 'left');
  return position.replace('start', 'left').replace('end', 'right');
}

const $a11501f3d1d39e6c$var$visibleOverlays = [];

function $a11501f3d1d39e6c$export$ea8f71083e90600f(props, ref) {
  let {
    onClose: onClose,
    shouldCloseOnBlur: shouldCloseOnBlur,
    isOpen: isOpen,
    isDismissable = false,
    isKeyboardDismissDisabled = false,
    shouldCloseOnInteractOutside: shouldCloseOnInteractOutside
  } = props; // Add the overlay ref to the stack of visible overlays on mount, and remove on unmount.

  useEffect(() => {
    if (isOpen) $a11501f3d1d39e6c$var$visibleOverlays.push(ref);
    return () => {
      let index = $a11501f3d1d39e6c$var$visibleOverlays.indexOf(ref);
      if (index >= 0) $a11501f3d1d39e6c$var$visibleOverlays.splice(index, 1);
    };
  }, [isOpen, ref]); // Only hide the overlay when it is the topmost visible overlay in the stack.

  let onHide = () => {
    if ($a11501f3d1d39e6c$var$visibleOverlays[$a11501f3d1d39e6c$var$visibleOverlays.length - 1] === ref && onClose) onClose();
  };

  let onInteractOutsideStart = e => {
    if (!shouldCloseOnInteractOutside || shouldCloseOnInteractOutside(e.target)) {
      if ($a11501f3d1d39e6c$var$visibleOverlays[$a11501f3d1d39e6c$var$visibleOverlays.length - 1] === ref) {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  };

  let onInteractOutside = e => {
    if (!shouldCloseOnInteractOutside || shouldCloseOnInteractOutside(e.target)) {
      if ($a11501f3d1d39e6c$var$visibleOverlays[$a11501f3d1d39e6c$var$visibleOverlays.length - 1] === ref) {
        e.stopPropagation();
        e.preventDefault();
      }

      onHide();
    }
  }; // Handle the escape key


  let onKeyDown = e => {
    if (e.key === 'Escape' && !isKeyboardDismissDisabled) {
      e.stopPropagation();
      e.preventDefault();
      onHide();
    }
  }; // Handle clicking outside the overlay to close it


  useInteractOutside({
    ref: ref,
    onInteractOutside: isDismissable ? onInteractOutside : null,
    onInteractOutsideStart: onInteractOutsideStart
  });
  let {
    focusWithinProps: focusWithinProps
  } = useFocusWithin({
    isDisabled: !shouldCloseOnBlur,
    onBlurWithin: e => {
      if (!shouldCloseOnInteractOutside || shouldCloseOnInteractOutside(e.relatedTarget)) onClose();
    }
  });

  let onPointerDownUnderlay = e => {
    // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
    if (e.target === e.currentTarget) e.preventDefault();
  };

  return {
    overlayProps: Object.assign({
      onKeyDown: onKeyDown
    }, focusWithinProps),
    underlayProps: {
      onPointerDown: onPointerDownUnderlay
    }
  };
}

function $628037886ba31236$export$f9d5c8beee7d008d(props, state, ref) {
  let {
    type: type
  } = props;
  let {
    isOpen: isOpen
  } = state; // Backward compatibility. Share state close function with useOverlayPosition so it can close on scroll
  // without forcing users to pass onClose.

  useEffect(() => {
    if (ref && ref.current) $dd149f63282afbbf$export$f6211563215e3b37.set(ref.current, state.close);
  }); // Aria 1.1 supports multiple values for aria-haspopup other than just menus.
  // https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
  // However, we only add it for menus for now because screen readers often
  // announce it as a menu even for other values.

  let ariaHasPopup = undefined;
  if (type === 'menu') ariaHasPopup = true;else if (type === 'listbox') ariaHasPopup = 'listbox';
  let overlayId = useId();
  return {
    triggerProps: {
      'aria-haspopup': ariaHasPopup,
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? overlayId : null,
      onPress: state.toggle
    },
    overlayProps: {
      id: overlayId
    }
  };
} // @ts-ignore


const $49c51c25361d4cd2$var$visualViewport = typeof window !== 'undefined' && window.visualViewport; // HTML input types that do not cause the software keyboard to appear.

const $49c51c25361d4cd2$var$nonTextInputTypes = new Set(['checkbox', 'radio', 'range', 'color', 'file', 'image', 'button', 'submit', 'reset']);

function $49c51c25361d4cd2$export$ee0f7cc6afcd1c18(options = {}) {
  let {
    isDisabled: isDisabled
  } = options;
  useLayoutEffect(() => {
    if (isDisabled) return;
    if (isIOS()) return $49c51c25361d4cd2$var$preventScrollMobileSafari();else return $49c51c25361d4cd2$var$preventScrollStandard();
  }, [isDisabled]);
} // For most browsers, all we need to do is set `overflow: hidden` on the root element, and
// add some padding to prevent the page from shifting when the scrollbar is hidden.


function $49c51c25361d4cd2$var$preventScrollStandard() {
  return chain($49c51c25361d4cd2$var$setStyle(document.documentElement, 'paddingRight', `${window.innerWidth - document.documentElement.clientWidth}px`), $49c51c25361d4cd2$var$setStyle(document.documentElement, 'overflow', 'hidden'));
} // Mobile Safari is a whole different beast. Even with overflow: hidden,
// it still scrolls the page in many situations:
//
// 1. When the bottom toolbar and address bar are collapsed, page scrolling is always allowed.
// 2. When the keyboard is visible, the viewport does not resize. Instead, the keyboard covers part of
//    it, so it becomes scrollable.
// 3. When tapping on an input, the page always scrolls so that the input is centered in the visual viewport.
//    This may cause even fixed position elements to scroll off the screen.
// 4. When using the next/previous buttons in the keyboard to navigate between inputs, the whole page always
//    scrolls, even if the input is inside a nested scrollable element that could be scrolled instead.
//
// In order to work around these cases, and prevent scrolling without jankiness, we do a few things:
//
// 1. Prevent default on `touchmove` events that are not in a scrollable element. This prevents touch scrolling
//    on the window.
// 2. Prevent default on `touchmove` events inside a scrollable element when the scroll position is at the
//    top or bottom. This avoids the whole page scrolling instead, but does prevent overscrolling.
// 3. Prevent default on `touchend` events on input elements and handle focusing the element ourselves.
// 4. When focusing an input, apply a transform to trick Safari into thinking the input is at the top
//    of the page, which prevents it from scrolling the page. After the input is focused, scroll the element
//    into view ourselves, without scrolling the whole page.
// 5. Offset the body by the scroll position using a negative margin and scroll to the top. This should appear the
//    same visually, but makes the actual scroll position always zero. This is required to make all of the
//    above work or Safari will still try to scroll the page when focusing an input.
// 6. As a last resort, handle window scroll events, and scroll back to the top. This can happen when attempting
//    to navigate to an input with the next/previous buttons that's outside a modal.


function $49c51c25361d4cd2$var$preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;

  let onTouchStart = e => {
    // Store the nearest scrollable parent element from the element that the user touched.
    scrollable = getScrollParent(e.target);
    if (scrollable === document.documentElement && scrollable === document.body) return;
    lastY = e.changedTouches[0].pageY;
  };

  let onTouchMove = e => {
    // Prevent scrolling the window.
    if (scrollable === document.documentElement || scrollable === document.body) {
      e.preventDefault();
      return;
    } // Prevent scrolling up when at the top and scrolling down when at the bottom
    // of a nested scrollable area, otherwise mobile Safari will start scrolling
    // the window instead. Unfortunately, this disables bounce scrolling when at
    // the top but it's the best we can do.


    let y = e.changedTouches[0].pageY;
    let scrollTop = scrollable.scrollTop;
    let bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) e.preventDefault();
    lastY = y;
  };

  let onTouchEnd = e => {
    let target = e.target; // Apply this change if we're not already focused on the target element

    if ($49c51c25361d4cd2$var$willOpenKeyboard(target) && target !== document.activeElement) {
      e.preventDefault(); // Apply a transform to trick Safari into thinking the input is at the top of the page
      // so it doesn't try to scroll it into view. When tapping on an input, this needs to
      // be done before the "focus" event, so we have to focus the element ourselves.

      target.style.transform = 'translateY(-2000px)';
      target.focus();
      requestAnimationFrame(() => {
        target.style.transform = '';
      });
    }
  };

  let onFocus = e => {
    let target = e.target;

    if ($49c51c25361d4cd2$var$willOpenKeyboard(target)) {
      // Transform also needs to be applied in the focus event in cases where focus moves
      // other than tapping on an input directly, e.g. the next/previous buttons in the
      // software keyboard. In these cases, it seems applying the transform in the focus event
      // is good enough, whereas when tapping an input, it must be done before the focus event. 🤷‍♂️
      target.style.transform = 'translateY(-2000px)';
      requestAnimationFrame(() => {
        target.style.transform = ''; // This will have prevented the browser from scrolling the focused element into view,
        // so we need to do this ourselves in a way that doesn't cause the whole page to scroll.

        if ($49c51c25361d4cd2$var$visualViewport) {
          if ($49c51c25361d4cd2$var$visualViewport.height < window.innerHeight) // If the keyboard is already visible, do this after one additional frame
            // to wait for the transform to be removed.
            requestAnimationFrame(() => {
              $49c51c25361d4cd2$var$scrollIntoView(target);
            });else // Otherwise, wait for the visual viewport to resize before scrolling so we can
            // measure the correct position to scroll to.
            $49c51c25361d4cd2$var$visualViewport.addEventListener('resize', () => $49c51c25361d4cd2$var$scrollIntoView(target), {
              once: true
            });
        }
      });
    }
  };

  let onWindowScroll = () => {
    // Last resort. If the window scrolled, scroll it back to the top.
    // It should always be at the top because the body will have a negative margin (see below).
    window.scrollTo(0, 0);
  }; // Record the original scroll position so we can restore it.
  // Then apply a negative margin to the body to offset it by the scroll position. This will
  // enable us to scroll the window to the top, which is required for the rest of this to work.


  let scrollX = window.pageXOffset;
  let scrollY = window.pageYOffset;
  let restoreStyles = chain($49c51c25361d4cd2$var$setStyle(document.documentElement, 'paddingRight', `${window.innerWidth - document.documentElement.clientWidth}px`), $49c51c25361d4cd2$var$setStyle(document.documentElement, 'overflow', 'hidden'), $49c51c25361d4cd2$var$setStyle(document.body, 'marginTop', `-${scrollY}px`)); // Scroll to the top. The negative margin on the body will make this appear the same.

  window.scrollTo(0, 0);
  let removeEvents = chain($49c51c25361d4cd2$var$addEvent(document, 'touchstart', onTouchStart, {
    passive: false,
    capture: true
  }), $49c51c25361d4cd2$var$addEvent(document, 'touchmove', onTouchMove, {
    passive: false,
    capture: true
  }), $49c51c25361d4cd2$var$addEvent(document, 'touchend', onTouchEnd, {
    passive: false,
    capture: true
  }), $49c51c25361d4cd2$var$addEvent(document, 'focus', onFocus, true), $49c51c25361d4cd2$var$addEvent(window, 'scroll', onWindowScroll));
  return () => {
    // Restore styles and scroll the page back to where it was.
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
} // Sets a CSS property on an element, and returns a function to revert it to the previous value.


function $49c51c25361d4cd2$var$setStyle(element, style, value) {
  let cur = element.style[style];
  element.style[style] = value;
  return () => {
    element.style[style] = cur;
  };
} // Adds an event listener to an element, and returns a function to remove it.


function $49c51c25361d4cd2$var$addEvent(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return () => {
    target.removeEventListener(event, handler, options);
  };
}

function $49c51c25361d4cd2$var$scrollIntoView(target) {
  let root = document.scrollingElement || document.documentElement;

  while (target && target !== root) {
    // Find the parent scrollable element and adjust the scroll position if the target is not already in view.
    let scrollable = getScrollParent(target);

    if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== target) {
      let scrollableTop = scrollable.getBoundingClientRect().top;
      let targetTop = target.getBoundingClientRect().top;
      if (targetTop > scrollableTop + target.clientHeight) scrollable.scrollTop += targetTop - scrollableTop;
    }

    target = scrollable.parentElement;
  }
}

function $49c51c25361d4cd2$var$willOpenKeyboard(target) {
  return target instanceof HTMLInputElement && !$49c51c25361d4cd2$var$nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}

const $f57aed4a881a3485$var$Context = /*#__PURE__*/$k7QOs$react.createContext(null);

function $f57aed4a881a3485$export$178405afcd8c5eb(props) {
  let {
    children: children
  } = props;
  let parent = useContext($f57aed4a881a3485$var$Context);
  let [modalCount, setModalCount] = useState(0);
  let context = useMemo(() => ({
    parent: parent,
    modalCount: modalCount,

    addModal() {
      setModalCount(count => count + 1);
      if (parent) parent.addModal();
    },

    removeModal() {
      setModalCount(count => count - 1);
      if (parent) parent.removeModal();
    }

  }), [parent, modalCount]);
  return /*#__PURE__*/$k7QOs$react.createElement($f57aed4a881a3485$var$Context.Provider, {
    value: context
  }, children);
}

function $f57aed4a881a3485$export$d9aaed4c3ece1bc0() {
  let context = useContext($f57aed4a881a3485$var$Context);
  return {
    modalProviderProps: {
      'aria-hidden': context && context.modalCount > 0 ? true : null
    }
  };
}
/**
 * Creates a root node that will be aria-hidden if there are other modals open.
 */


function $f57aed4a881a3485$var$OverlayContainerDOM(props) {
  let {
    modalProviderProps: modalProviderProps
  } = $f57aed4a881a3485$export$d9aaed4c3ece1bc0();
  return /*#__PURE__*/$k7QOs$react.createElement("div", Object.assign({
    "data-overlay-container": true
  }, props, {}, modalProviderProps));
}

function $f57aed4a881a3485$export$bf688221f59024e5(props) {
  return /*#__PURE__*/$k7QOs$react.createElement($f57aed4a881a3485$export$178405afcd8c5eb, null, /*#__PURE__*/$k7QOs$react.createElement($f57aed4a881a3485$var$OverlayContainerDOM, props));
}

function $f57aed4a881a3485$export$b47c3594eab58386(props) {
  let isSSR = useIsSSR();

  let {
    portalContainer = isSSR ? null : document.body
  } = props,
      rest = _objectWithoutPropertiesLoose(props, ["portalContainer"]);

  $k7QOs$react.useEffect(() => {
    if (portalContainer === null || portalContainer === void 0 ? void 0 : portalContainer.closest('[data-overlay-container]')) throw new Error('An OverlayContainer must not be inside another container. Please change the portalContainer prop.');
  }, [portalContainer]);
  if (!portalContainer) return null;
  let contents = /*#__PURE__*/$k7QOs$react.createElement($f57aed4a881a3485$export$bf688221f59024e5, rest);
  return /*#__PURE__*/$k7QOs$reactdom.createPortal(contents, portalContainer);
}

function $f57aed4a881a3485$export$33ffd74ebf07f060(options) {
  // Add aria-hidden to all parent providers on mount, and restore on unmount.
  let context = useContext($f57aed4a881a3485$var$Context);
  if (!context) throw new Error('Modal is not contained within a provider');
  useEffect(() => {
    if ((options === null || options === void 0 ? void 0 : options.isDisabled) || !context || !context.parent) return; // The immediate context is from the provider containing this modal, so we only
    // want to trigger aria-hidden on its parents not on the modal provider itself.

    context.parent.addModal();
    return () => {
      if (context && context.parent) context.parent.removeModal();
    };
  }, [context, context.parent, options === null || options === void 0 ? void 0 : options.isDisabled]);
  return {
    modalProps: {
      'data-ismodal': !(options === null || options === void 0 ? void 0 : options.isDisabled)
    }
  };
}

var $61fe14465afefc5e$exports = {};
var $773d5888b972f1cf$exports = {};
$773d5888b972f1cf$exports = {
  "dismiss": `تجاهل`
};
var $d11f19852b941573$exports = {};
$d11f19852b941573$exports = {
  "dismiss": `Отхвърляне`
};
var $b983974c2ee1efb3$exports = {};
$b983974c2ee1efb3$exports = {
  "dismiss": `Odstranit`
};
var $5809cc9d4e92de73$exports = {};
$5809cc9d4e92de73$exports = {
  "dismiss": `Luk`
};
var $c68c2e4fc74398d1$exports = {};
$c68c2e4fc74398d1$exports = {
  "dismiss": `Schließen`
};
var $0898b4c153db2b77$exports = {};
$0898b4c153db2b77$exports = {
  "dismiss": `Απόρριψη`
};
var $6d74810286a15183$exports = {};
$6d74810286a15183$exports = {
  "dismiss": `Dismiss`
};
var $309d73dc65f78055$exports = {};
$309d73dc65f78055$exports = {
  "dismiss": `Descartar`
};
var $44ad94f7205cf593$exports = {};
$44ad94f7205cf593$exports = {
  "dismiss": `Lõpeta`
};
var $7c28f5687f0779a9$exports = {};
$7c28f5687f0779a9$exports = {
  "dismiss": `Hylkää`
};
var $e6d75df4b68bd73a$exports = {};
$e6d75df4b68bd73a$exports = {
  "dismiss": `Rejeter`
};
var $87505c9dab186d0f$exports = {};
$87505c9dab186d0f$exports = {
  "dismiss": `התעלם`
};
var $553439c3ffb3e492$exports = {};
$553439c3ffb3e492$exports = {
  "dismiss": `Odbaci`
};
var $74cf411061b983a2$exports = {};
$74cf411061b983a2$exports = {
  "dismiss": `Elutasítás`
};
var $e933f298574dc435$exports = {};
$e933f298574dc435$exports = {
  "dismiss": `Ignora`
};
var $ac91fc9fe02f71f6$exports = {};
$ac91fc9fe02f71f6$exports = {
  "dismiss": `閉じる`
};
var $52b96f86422025af$exports = {};
$52b96f86422025af$exports = {
  "dismiss": `무시`
};
var $c0d724c3e51dafa6$exports = {};
$c0d724c3e51dafa6$exports = {
  "dismiss": `Atmesti`
};
var $c92899672a3fe72e$exports = {};
$c92899672a3fe72e$exports = {
  "dismiss": `Nerādīt`
};
var $9f576b39d8e7a9d6$exports = {};
$9f576b39d8e7a9d6$exports = {
  "dismiss": `Lukk`
};
var $9d025808aeec81a7$exports = {};
$9d025808aeec81a7$exports = {
  "dismiss": `Negeren`
};
var $fce709921e2c0fa6$exports = {};
$fce709921e2c0fa6$exports = {
  "dismiss": `Zignoruj`
};
var $2599cf0c4ab37f59$exports = {};
$2599cf0c4ab37f59$exports = {
  "dismiss": `Descartar`
};
var $3c220ae7ef8a35fd$exports = {};
$3c220ae7ef8a35fd$exports = {
  "dismiss": `Dispensar`
};
var $93562b5094072f54$exports = {};
$93562b5094072f54$exports = {
  "dismiss": `Revocare`
};
var $cd9e2abd0d06c7b4$exports = {};
$cd9e2abd0d06c7b4$exports = {
  "dismiss": `Пропустить`
};
var $45375701f409adf1$exports = {};
$45375701f409adf1$exports = {
  "dismiss": `Zrušiť`
};
var $27fab53a576de9dd$exports = {};
$27fab53a576de9dd$exports = {
  "dismiss": `Opusti`
};
var $4438748d9952e7c7$exports = {};
$4438748d9952e7c7$exports = {
  "dismiss": `Odbaci`
};
var $0936d7347ef4da4c$exports = {};
$0936d7347ef4da4c$exports = {
  "dismiss": `Avvisa`
};
var $29700c92185d38f8$exports = {};
$29700c92185d38f8$exports = {
  "dismiss": `Kapat`
};
var $662ccaf2be4c25b3$exports = {};
$662ccaf2be4c25b3$exports = {
  "dismiss": `Скасувати`
};
var $d80a27deda7cdb3c$exports = {};
$d80a27deda7cdb3c$exports = {
  "dismiss": `取消`
};
var $2b2734393847c884$exports = {};
$2b2734393847c884$exports = {
  "dismiss": `關閉`
};
$61fe14465afefc5e$exports = {
  "ar-AE": $773d5888b972f1cf$exports,
  "bg-BG": $d11f19852b941573$exports,
  "cs-CZ": $b983974c2ee1efb3$exports,
  "da-DK": $5809cc9d4e92de73$exports,
  "de-DE": $c68c2e4fc74398d1$exports,
  "el-GR": $0898b4c153db2b77$exports,
  "en-US": $6d74810286a15183$exports,
  "es-ES": $309d73dc65f78055$exports,
  "et-EE": $44ad94f7205cf593$exports,
  "fi-FI": $7c28f5687f0779a9$exports,
  "fr-FR": $e6d75df4b68bd73a$exports,
  "he-IL": $87505c9dab186d0f$exports,
  "hr-HR": $553439c3ffb3e492$exports,
  "hu-HU": $74cf411061b983a2$exports,
  "it-IT": $e933f298574dc435$exports,
  "ja-JP": $ac91fc9fe02f71f6$exports,
  "ko-KR": $52b96f86422025af$exports,
  "lt-LT": $c0d724c3e51dafa6$exports,
  "lv-LV": $c92899672a3fe72e$exports,
  "nb-NO": $9f576b39d8e7a9d6$exports,
  "nl-NL": $9d025808aeec81a7$exports,
  "pl-PL": $fce709921e2c0fa6$exports,
  "pt-BR": $2599cf0c4ab37f59$exports,
  "pt-PT": $3c220ae7ef8a35fd$exports,
  "ro-RO": $93562b5094072f54$exports,
  "ru-RU": $cd9e2abd0d06c7b4$exports,
  "sk-SK": $45375701f409adf1$exports,
  "sl-SI": $27fab53a576de9dd$exports,
  "sr-SP": $4438748d9952e7c7$exports,
  "sv-SE": $0936d7347ef4da4c$exports,
  "tr-TR": $29700c92185d38f8$exports,
  "uk-UA": $662ccaf2be4c25b3$exports,
  "zh-CN": $d80a27deda7cdb3c$exports,
  "zh-TW": $2b2734393847c884$exports
};

function $86ea4cb521eb2e37$export$2317d149ed6f78c4(props) {
  let {
    onDismiss: onDismiss
  } = props,
      otherProps = _objectWithoutPropertiesLoose(props, ["onDismiss"]);

  let stringFormatter = useLocalizedStringFormatter( /*@__PURE__*/$parcel$interopDefault($61fe14465afefc5e$exports));
  let labels = useLabels(otherProps, stringFormatter.format('dismiss'));

  let onClick = () => {
    if (onDismiss) onDismiss();
  };

  return /*#__PURE__*/$k7QOs$react.createElement(VisuallyHidden, null, /*#__PURE__*/$k7QOs$react.createElement("button", Object.assign({}, labels, {
    tabIndex: -1,
    onClick: onClick
  })));
}
/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
// Keeps a ref count of all hidden elements. Added to when hiding an element, and
// subtracted from when showing it again. When it reaches zero, aria-hidden is removed.


let $5e3802645cc19319$var$refCountMap = new WeakMap();

function $5e3802645cc19319$export$1c3ebcada18427bf(targets, root = document.body) {
  let visibleNodes = new Set(targets);
  let hiddenNodes = new Set();
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      // If this node is a live announcer, add it to the set of nodes to keep visible.
      if ((node instanceof HTMLElement || node instanceof SVGElement) && node.dataset.liveAnnouncer === 'true') visibleNodes.add(node); // Skip this node and its children if it is one of the target nodes, or a live announcer.
      // Also skip children of already hidden nodes, as aria-hidden is recursive.

      if (visibleNodes.has(node) || hiddenNodes.has(node.parentElement)) return NodeFilter.FILTER_REJECT; // VoiceOver on iOS has issues hiding elements with role="row". Hide the cells inside instead.
      // https://bugs.webkit.org/show_bug.cgi?id=222623

      if (node instanceof Element && node.getAttribute('role') === 'row') return NodeFilter.FILTER_SKIP; // Skip this node but continue to children if one of the targets is inside the node.

      if (targets.some(target => node.contains(target))) return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }

  });

  let hide = node => {
    var ref;
    let refCount = (ref = $5e3802645cc19319$var$refCountMap.get(node)) !== null && ref !== void 0 ? ref : 0; // If already aria-hidden, and the ref count is zero, then this element
    // was already hidden and there's nothing for us to do.

    if (node.getAttribute('aria-hidden') === 'true' && refCount === 0) return;
    if (refCount === 0) node.setAttribute('aria-hidden', 'true');
    hiddenNodes.add(node);
    $5e3802645cc19319$var$refCountMap.set(node, refCount + 1);
  };

  let node1 = walker.nextNode();

  while (node1 != null) {
    hide(node1);
    node1 = walker.nextNode();
  }

  let observer = new MutationObserver(changes => {
    for (let change of changes) {
      if (change.type !== 'childList' || change.addedNodes.length === 0) continue; // If the parent element of the added nodes is not within one of the targets,
      // and not already inside a hidden node, hide all of the new children.

      if (![...visibleNodes, ...hiddenNodes].some(node => node.contains(change.target))) for (let node2 of change.addedNodes) {
        if ((node2 instanceof HTMLElement || node2 instanceof SVGElement) && node2.dataset.liveAnnouncer === 'true') visibleNodes.add(node2);else if (node2 instanceof Element) hide(node2);
      }
    }
  });
  observer.observe(root, {
    childList: true,
    subtree: true
  });
  return () => {
    observer.disconnect();

    for (let node of hiddenNodes) {
      let count = $5e3802645cc19319$var$refCountMap.get(node);

      if (count === 1) {
        node.removeAttribute('aria-hidden');
        $5e3802645cc19319$var$refCountMap.delete(node);
      } else $5e3802645cc19319$var$refCountMap.set(node, count - 1);
    }
  };
}

export { $86ea4cb521eb2e37$export$2317d149ed6f78c4 as DismissButton, $f57aed4a881a3485$export$178405afcd8c5eb as ModalProvider, $f57aed4a881a3485$export$b47c3594eab58386 as OverlayContainer, $f57aed4a881a3485$export$bf688221f59024e5 as OverlayProvider, $5e3802645cc19319$export$1c3ebcada18427bf as ariaHideOutside, $f57aed4a881a3485$export$33ffd74ebf07f060 as useModal, $f57aed4a881a3485$export$d9aaed4c3ece1bc0 as useModalProvider, $a11501f3d1d39e6c$export$ea8f71083e90600f as useOverlay, $2a41e45df1593e64$export$d39e1813b3bdd0e1 as useOverlayPosition, $628037886ba31236$export$f9d5c8beee7d008d as useOverlayTrigger, $49c51c25361d4cd2$export$ee0f7cc6afcd1c18 as usePreventScroll };