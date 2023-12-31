'use es6';

export { clamp, snapValueToStep } from '@react-stately/utils';
import $12uGp$react, { useState, useRef, useCallback, useEffect } from 'react';
import { useSSRSafeId } from '@react-aria/ssr';

function r(e) {
  var t,
      f,
      n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;else if ("object" == typeof e) if (Array.isArray(e)) for (t = 0; t < e.length; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);else for (t in e) e[t] && (n && (n += " "), n += t);
  return n;
}

function clsx() {
  for (var e, t, f = 0, n = ""; f < arguments.length;) (e = arguments[f++]) && (t = r(e)) && (n && (n += " "), n += t);

  return n;
}

const $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c = typeof window !== 'undefined' ? $12uGp$react.useLayoutEffect : () => {};
let $bdb11010cef70236$var$idsUpdaterMap = new Map();

function $bdb11010cef70236$export$f680877a34711e37(defaultId) {
  let [value, setValue] = useState(defaultId);
  let nextId = useRef(null);
  let res = useSSRSafeId(value);
  let updateValue = useCallback(val => {
    nextId.current = val;
  }, []);
  $bdb11010cef70236$var$idsUpdaterMap.set(res, updateValue);
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    let r = res;
    return () => {
      $bdb11010cef70236$var$idsUpdaterMap.delete(r);
    };
  }, [res]); // This cannot cause an infinite loop because the ref is updated first.
  // eslint-disable-next-line

  useEffect(() => {
    let newId = nextId.current;

    if (newId) {
      nextId.current = null;
      setValue(newId);
    }
  });
  return res;
}

function $bdb11010cef70236$export$cd8c9cb68f842629(idA, idB) {
  if (idA === idB) return idA;
  let setIdA = $bdb11010cef70236$var$idsUpdaterMap.get(idA);

  if (setIdA) {
    setIdA(idB);
    return idB;
  }

  let setIdB = $bdb11010cef70236$var$idsUpdaterMap.get(idB);

  if (setIdB) {
    setIdB(idA);
    return idA;
  }

  return idB;
}

function $bdb11010cef70236$export$b4cc09c592e8fdb8(depArray = []) {
  let id = $bdb11010cef70236$export$f680877a34711e37();
  let [resolvedId, setResolvedId] = $1dbecbe27a04f9af$export$14d238f342723f25(id);
  let updateId = useCallback(() => {
    setResolvedId(function* () {
      yield id;
      yield document.getElementById(id) ? id : null;
    });
  }, [id, setResolvedId]);
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(updateId, [id, updateId, ...depArray]);
  return resolvedId;
}

function $ff5963eb1fccf552$export$e08e3b67e392101e(...callbacks) {
  return (...args) => {
    for (let callback of callbacks) if (typeof callback === 'function') callback(...args);
  };
}

function $3ef42575df84b30b$export$9d1611c77c2fe928(...args) {
  // Start with a base clone of the first argument. This is a lot faster than starting
  // with an empty object and adding properties as we go.
  let result = Object.assign({}, args[0]);

  for (let i = 1; i < args.length; i++) {
    let props = args[i];

    for (let key in props) {
      let a = result[key];
      let b = props[key]; // Chain events

      if (typeof a === 'function' && typeof b === 'function' && // This is a lot faster than a regex.
      key[0] === 'o' && key[1] === 'n' && key.charCodeAt(2) >=
      /* 'A' */
      65 && key.charCodeAt(2) <=
      /* 'Z' */
      90) result[key] = $ff5963eb1fccf552$export$e08e3b67e392101e(a, b);else if ((key === 'className' || key === 'UNSAFE_className') && typeof a === 'string' && typeof b === 'string') result[key] = clsx(a, b);else if (key === 'id' && a && b) result.id = $bdb11010cef70236$export$cd8c9cb68f842629(a, b);else result[key] = b !== undefined ? b : a;
    }
  }

  return result;
}

function $5dc95899b306f630$export$c9058316764c140e(...refs) {
  return value => {
    for (let ref of refs) {
      if (typeof ref === 'function') ref(value);else if (ref != null) ref.current = value;
    }
  };
}

const $65484d02dcb7eb3e$var$DOMPropNames = new Set(['id']);
const $65484d02dcb7eb3e$var$labelablePropNames = new Set(['aria-label', 'aria-labelledby', 'aria-describedby', 'aria-details']);
const $65484d02dcb7eb3e$var$propRe = /^(data-.*)$/;

function $65484d02dcb7eb3e$export$457c3d6518dd4c6f(props, opts = {}) {
  let {
    labelable: labelable,
    propNames: propNames
  } = opts;
  let filteredProps = {};

  for (const prop in props) if (Object.prototype.hasOwnProperty.call(props, prop) && ($65484d02dcb7eb3e$var$DOMPropNames.has(prop) || labelable && $65484d02dcb7eb3e$var$labelablePropNames.has(prop) || (propNames === null || propNames === void 0 ? void 0 : propNames.has(prop)) || $65484d02dcb7eb3e$var$propRe.test(prop))) filteredProps[prop] = props[prop];

  return filteredProps;
}

function $7215afc6de606d6b$export$de79e2c695e052f3(element) {
  if ($7215afc6de606d6b$var$supportsPreventScroll()) element.focus({
    preventScroll: true
  });else {
    let scrollableElements = $7215afc6de606d6b$var$getScrollableElements(element);
    element.focus();
    $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements);
  }
}

let $7215afc6de606d6b$var$supportsPreventScrollCached = null;

function $7215afc6de606d6b$var$supportsPreventScroll() {
  if ($7215afc6de606d6b$var$supportsPreventScrollCached == null) {
    $7215afc6de606d6b$var$supportsPreventScrollCached = false;

    try {
      var focusElem = document.createElement('div');
      focusElem.focus({
        get preventScroll() {
          $7215afc6de606d6b$var$supportsPreventScrollCached = true;
          return true;
        }

      });
    } catch (e) {// Ignore
    }
  }

  return $7215afc6de606d6b$var$supportsPreventScrollCached;
}

function $7215afc6de606d6b$var$getScrollableElements(element) {
  var parent = element.parentNode;
  var scrollableElements = [];
  var rootScrollingElement = document.scrollingElement || document.documentElement;

  while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
    if (parent.offsetHeight < parent.scrollHeight || parent.offsetWidth < parent.scrollWidth) scrollableElements.push({
      element: parent,
      scrollTop: parent.scrollTop,
      scrollLeft: parent.scrollLeft
    });
    parent = parent.parentNode;
  }

  if (rootScrollingElement instanceof HTMLElement) scrollableElements.push({
    element: rootScrollingElement,
    scrollTop: rootScrollingElement.scrollTop,
    scrollLeft: rootScrollingElement.scrollLeft
  });
  return scrollableElements;
}

function $7215afc6de606d6b$var$restoreScrollPosition(scrollableElements) {
  for (let {
    element: element,
    scrollTop: scrollTop,
    scrollLeft: scrollLeft
  } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}

function $ab71dadb03a6fb2e$export$622cea445a1c5b7d(element, reverse, orientation = 'horizontal') {
  let rect = element.getBoundingClientRect();
  if (reverse) return orientation === 'horizontal' ? rect.right : rect.bottom;
  return orientation === 'horizontal' ? rect.left : rect.top;
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
// We store a global list of elements that are currently transitioning,
// mapped to a set of CSS properties that are transitioning for that element.
// This is necessary rather than a simple count of transitions because of browser
// bugs, e.g. Chrome sometimes fires both transitionend and transitioncancel rather
// than one or the other. So we need to track what's actually transitioning so that
// we can ignore these duplicate events.


let $bbed8b41f857bcc0$var$transitionsByElement = new Map(); // A list of callbacks to call once there are no transitioning elements.

let $bbed8b41f857bcc0$var$transitionCallbacks = new Set();

function $bbed8b41f857bcc0$var$setupGlobalEvents() {
  if (typeof window === 'undefined') return;

  let onTransitionStart = e => {
    // Add the transitioning property to the list for this element.
    let transitions = $bbed8b41f857bcc0$var$transitionsByElement.get(e.target);

    if (!transitions) {
      transitions = new Set();
      $bbed8b41f857bcc0$var$transitionsByElement.set(e.target, transitions); // The transitioncancel event must be registered on the element itself, rather than as a global
      // event. This enables us to handle when the node is deleted from the document while it is transitioning.
      // In that case, the cancel event would have nowhere to bubble to so we need to handle it directly.

      e.target.addEventListener('transitioncancel', onTransitionEnd);
    }

    transitions.add(e.propertyName);
  };

  let onTransitionEnd = e => {
    // Remove property from list of transitioning properties.
    let properties = $bbed8b41f857bcc0$var$transitionsByElement.get(e.target);
    if (!properties) return;
    properties.delete(e.propertyName); // If empty, remove transitioncancel event, and remove the element from the list of transitioning elements.

    if (properties.size === 0) {
      e.target.removeEventListener('transitioncancel', onTransitionEnd);
      $bbed8b41f857bcc0$var$transitionsByElement.delete(e.target);
    } // If no transitioning elements, call all of the queued callbacks.


    if ($bbed8b41f857bcc0$var$transitionsByElement.size === 0) {
      for (let cb of $bbed8b41f857bcc0$var$transitionCallbacks) cb();

      $bbed8b41f857bcc0$var$transitionCallbacks.clear();
    }
  };

  document.body.addEventListener('transitionrun', onTransitionStart);
  document.body.addEventListener('transitionend', onTransitionEnd);
}

if (typeof document !== 'undefined') {
  if (document.readyState !== 'loading') $bbed8b41f857bcc0$var$setupGlobalEvents();else document.addEventListener('DOMContentLoaded', $bbed8b41f857bcc0$var$setupGlobalEvents);
}

function $bbed8b41f857bcc0$export$24490316f764c430(fn) {
  // Wait one frame to see if an animation starts, e.g. a transition on mount.
  requestAnimationFrame(() => {
    // If no transitions are running, call the function immediately.
    // Otherwise, add it to a list of callbacks to run at the end of the animation.
    if ($bbed8b41f857bcc0$var$transitionsByElement.size === 0) fn();else $bbed8b41f857bcc0$var$transitionCallbacks.add(fn);
  });
} // Keep track of elements that we are currently handling dragging for via useDrag1D.
// If there's an ancestor and a descendant both using useDrag1D(), and the user starts
// dragging the descendant, we don't want useDrag1D events to fire for the ancestor.


const $9cc09df9fd7676be$var$draggingElements = [];

function $9cc09df9fd7676be$export$7bbed75feba39706(props) {
  console.warn('useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html');
  let {
    containerRef: containerRef,
    reverse: reverse,
    orientation: orientation,
    onHover: onHover,
    onDrag: onDrag,
    onPositionChange: onPositionChange,
    onIncrement: onIncrement,
    onDecrement: onDecrement,
    onIncrementToMax: onIncrementToMax,
    onDecrementToMin: onDecrementToMin,
    onCollapseToggle: onCollapseToggle
  } = props;

  let getPosition = e => orientation === 'horizontal' ? e.clientX : e.clientY;

  let getNextOffset = e => {
    let containerOffset = $ab71dadb03a6fb2e$export$622cea445a1c5b7d(containerRef.current, reverse, orientation);
    let mouseOffset = getPosition(e);
    let nextOffset = reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
    return nextOffset;
  };

  let dragging = useRef(false);
  let prevPosition = useRef(0); // Keep track of the current handlers in a ref so that the events can access them.

  let handlers = useRef({
    onPositionChange: onPositionChange,
    onDrag: onDrag
  });
  handlers.current.onDrag = onDrag;
  handlers.current.onPositionChange = onPositionChange;

  let onMouseDragged = e => {
    e.preventDefault();
    let nextOffset = getNextOffset(e);

    if (!dragging.current) {
      dragging.current = true;
      if (handlers.current.onDrag) handlers.current.onDrag(true);
      if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
    }

    if (prevPosition.current === nextOffset) return;
    prevPosition.current = nextOffset;
    if (onPositionChange) onPositionChange(nextOffset);
  };

  let onMouseUp = e => {
    const target = e.target;
    dragging.current = false;
    let nextOffset = getNextOffset(e);
    if (handlers.current.onDrag) handlers.current.onDrag(false);
    if (handlers.current.onPositionChange) handlers.current.onPositionChange(nextOffset);
    $9cc09df9fd7676be$var$draggingElements.splice($9cc09df9fd7676be$var$draggingElements.indexOf(target), 1);
    window.removeEventListener('mouseup', onMouseUp, false);
    window.removeEventListener('mousemove', onMouseDragged, false);
  };

  let onMouseDown = e => {
    const target = e.currentTarget; // If we're already handling dragging on a descendant with useDrag1D, then
    // we don't want to handle the drag motion on this target as well.

    if ($9cc09df9fd7676be$var$draggingElements.some(elt => target.contains(elt))) return;
    $9cc09df9fd7676be$var$draggingElements.push(target);
    window.addEventListener('mousemove', onMouseDragged, false);
    window.addEventListener('mouseup', onMouseUp, false);
  };

  let onMouseEnter = () => {
    if (onHover) onHover(true);
  };

  let onMouseOut = () => {
    if (onHover) onHover(false);
  };

  let onKeyDown = e => {
    switch (e.key) {
      case 'Left':
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          e.preventDefault();
          if (onDecrement && !reverse) onDecrement();else if (onIncrement && reverse) onIncrement();
        }

        break;

      case 'Up':
      case 'ArrowUp':
        if (orientation === 'vertical') {
          e.preventDefault();
          if (onDecrement && !reverse) onDecrement();else if (onIncrement && reverse) onIncrement();
        }

        break;

      case 'Right':
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          e.preventDefault();
          if (onIncrement && !reverse) onIncrement();else if (onDecrement && reverse) onDecrement();
        }

        break;

      case 'Down':
      case 'ArrowDown':
        if (orientation === 'vertical') {
          e.preventDefault();
          if (onIncrement && !reverse) onIncrement();else if (onDecrement && reverse) onDecrement();
        }

        break;

      case 'Home':
        e.preventDefault();
        if (onDecrementToMin) onDecrementToMin();
        break;

      case 'End':
        e.preventDefault();
        if (onIncrementToMax) onIncrementToMax();
        break;

      case 'Enter':
        e.preventDefault();
        if (onCollapseToggle) onCollapseToggle();
        break;
    }
  };

  return {
    onMouseDown: onMouseDown,
    onMouseEnter: onMouseEnter,
    onMouseOut: onMouseOut,
    onKeyDown: onKeyDown
  };
}

function $03deb23ff14920c4$export$4eaf04e54aa8eed6() {
  let globalListeners = useRef(new Map());
  let addGlobalListener = useCallback((eventTarget, type, listener, options) => {
    // Make sure we remove the listener after it is called with the `once` option.
    let fn = (options === null || options === void 0 ? void 0 : options.once) ? (...args) => {
      globalListeners.current.delete(listener);
      listener(...args);
    } : listener;
    globalListeners.current.set(listener, {
      type: type,
      eventTarget: eventTarget,
      fn: fn,
      options: options
    });
    eventTarget.addEventListener(type, listener, options);
  }, []);
  let removeGlobalListener = useCallback((eventTarget, type, listener, options) => {
    var ref;
    let fn = ((ref = globalListeners.current.get(listener)) === null || ref === void 0 ? void 0 : ref.fn) || listener;
    eventTarget.removeEventListener(type, fn, options);
    globalListeners.current.delete(listener);
  }, []);
  let removeAllGlobalListeners = useCallback(() => {
    globalListeners.current.forEach((value, key) => {
      removeGlobalListener(value.eventTarget, value.type, key, value.options);
    });
  }, [removeGlobalListener]); // eslint-disable-next-line arrow-body-style

  useEffect(() => {
    return removeAllGlobalListeners;
  }, [removeAllGlobalListeners]);
  return {
    addGlobalListener: addGlobalListener,
    removeGlobalListener: removeGlobalListener,
    removeAllGlobalListeners: removeAllGlobalListeners
  };
}

function $313b98861ee5dd6c$export$d6875122194c7b44(props, defaultLabel) {
  let {
    id: id,
    'aria-label': label,
    'aria-labelledby': labelledBy
  } = props; // If there is both an aria-label and aria-labelledby,
  // combine them by pointing to the element itself.

  id = $bdb11010cef70236$export$f680877a34711e37(id);

  if (labelledBy && label) {
    let ids = new Set([...labelledBy.trim().split(/\s+/), id]);
    labelledBy = [...ids].join(' ');
  } else if (labelledBy) labelledBy = labelledBy.trim().split(/\s+/).join(' '); // If no labels are provided, use the default


  if (!label && !labelledBy && defaultLabel) label = defaultLabel;
  return {
    id: id,
    'aria-label': label,
    'aria-labelledby': labelledBy
  };
}

function $df56164dff5785e2$export$4338b53315abf666(forwardedRef) {
  const objRef = useRef();
  /**
  * We're using `useLayoutEffect` here instead of `useEffect` because we want
  * to make sure that the `ref` value is up to date before other places in the
  * the execution cycle try to read it.
  */

  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    if (!forwardedRef) return;
    if (typeof forwardedRef === 'function') forwardedRef(objRef.current);else forwardedRef.current = objRef.current;
  }, [forwardedRef]);
  return objRef;
}

function $4f58c5f72bcf79f7$export$496315a1608d9602(effect, dependencies) {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;else effect(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

function $9daab02d461809db$var$hasResizeObserver() {
  return typeof window.ResizeObserver !== 'undefined';
}

function $9daab02d461809db$export$683480f191c0e3ea(options) {
  const {
    ref: ref,
    onResize: onResize
  } = options;
  useEffect(() => {
    let element = ref === null || ref === void 0 ? void 0 : ref.current;
    if (!element) return;

    if (!$9daab02d461809db$var$hasResizeObserver()) {
      window.addEventListener('resize', onResize, false);
      return () => {
        window.removeEventListener('resize', onResize, false);
      };
    } else {
      const resizeObserverInstance = new window.ResizeObserver(entries => {
        if (!entries.length) return;
        onResize();
      });
      resizeObserverInstance.observe(element);
      return () => {
        if (element) resizeObserverInstance.unobserve(element);
      };
    }
  }, [onResize, ref]);
}

function $e7801be82b4b2a53$export$4debdb1a3f0fa79e(context, ref) {
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    if (context && context.ref && ref) {
      context.ref.current = ref.current;
      return () => {
        context.ref.current = null;
      };
    }
  }, [context, ref]);
}

function $62d8ded9296f3872$export$cfa2225e87938781(node) {
  while (node && !$62d8ded9296f3872$var$isScrollable(node)) node = node.parentElement;

  return node || document.scrollingElement || document.documentElement;
}

function $62d8ded9296f3872$var$isScrollable(node) {
  let style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
} // @ts-ignore


let $5df64b3807dc15ee$var$visualViewport = typeof window !== 'undefined' && window.visualViewport;

function $5df64b3807dc15ee$export$d699905dd57c73ca() {
  let [size1, setSize] = useState(() => $5df64b3807dc15ee$var$getViewportSize());
  useEffect(() => {
    // Use visualViewport api to track available height even on iOS virtual keyboard opening
    let onResize = () => {
      setSize(size => {
        let newSize = $5df64b3807dc15ee$var$getViewportSize();
        if (newSize.width === size.width && newSize.height === size.height) return size;
        return newSize;
      });
    };

    if (!$5df64b3807dc15ee$var$visualViewport) window.addEventListener('resize', onResize);else $5df64b3807dc15ee$var$visualViewport.addEventListener('resize', onResize);
    return () => {
      if (!$5df64b3807dc15ee$var$visualViewport) window.removeEventListener('resize', onResize);else $5df64b3807dc15ee$var$visualViewport.removeEventListener('resize', onResize);
    };
  }, []);
  return size1;
}

function $5df64b3807dc15ee$var$getViewportSize() {
  return {
    width: ($5df64b3807dc15ee$var$visualViewport === null || $5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : $5df64b3807dc15ee$var$visualViewport.width) || window.innerWidth,
    height: ($5df64b3807dc15ee$var$visualViewport === null || $5df64b3807dc15ee$var$visualViewport === void 0 ? void 0 : $5df64b3807dc15ee$var$visualViewport.height) || window.innerHeight
  };
}

let $ef06256079686ba0$var$descriptionId = 0;
const $ef06256079686ba0$var$descriptionNodes = new Map();

function $ef06256079686ba0$export$f8aeda7b10753fa1(description) {
  let [id1, setId] = useState(null);
  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    if (!description) return;
    let desc = $ef06256079686ba0$var$descriptionNodes.get(description);

    if (!desc) {
      let id = `react-aria-description-${$ef06256079686ba0$var$descriptionId++}`;
      setId(id);
      let node = document.createElement('div');
      node.id = id;
      node.style.display = 'none';
      node.textContent = description;
      document.body.appendChild(node);
      desc = {
        refCount: 0,
        element: node
      };
      $ef06256079686ba0$var$descriptionNodes.set(description, desc);
    } else setId(desc.element.id);

    desc.refCount++;
    return () => {
      if (--desc.refCount === 0) {
        desc.element.remove();
        $ef06256079686ba0$var$descriptionNodes.delete(description);
      }
    };
  }, [description]);
  return {
    'aria-describedby': description ? id1 : undefined
  };
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


function $c87311424ea30a05$var$testUserAgent(re) {
  var ref;
  if (typeof window === 'undefined' || window.navigator == null) return false;
  return ((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.brands.some(brand => re.test(brand.brand))) || re.test(window.navigator.userAgent);
}

function $c87311424ea30a05$var$testPlatform(re) {
  var ref;
  return typeof window !== 'undefined' && window.navigator != null ? re.test(((ref = window.navigator['userAgentData']) === null || ref === void 0 ? void 0 : ref.platform) || window.navigator.platform) : false;
}

function $c87311424ea30a05$export$9ac100e40613ea10() {
  return $c87311424ea30a05$var$testPlatform(/^Mac/i);
}

function $c87311424ea30a05$export$186c6964ca17d99() {
  return $c87311424ea30a05$var$testPlatform(/^iPhone/i);
}

function $c87311424ea30a05$export$7bef049ce92e4224() {
  return $c87311424ea30a05$var$testPlatform(/^iPad/i) || $c87311424ea30a05$export$9ac100e40613ea10() && navigator.maxTouchPoints > 1;
}

function $c87311424ea30a05$export$fedb369cb70207f1() {
  return $c87311424ea30a05$export$186c6964ca17d99() || $c87311424ea30a05$export$7bef049ce92e4224();
}

function $c87311424ea30a05$export$e1865c3bedcd822b() {
  return $c87311424ea30a05$export$9ac100e40613ea10() || $c87311424ea30a05$export$fedb369cb70207f1();
}

function $c87311424ea30a05$export$78551043582a6a98() {
  return $c87311424ea30a05$var$testUserAgent(/AppleWebKit/i) && !$c87311424ea30a05$export$6446a186d09e379e();
}

function $c87311424ea30a05$export$6446a186d09e379e() {
  return $c87311424ea30a05$var$testUserAgent(/Chrome/i);
}

function $c87311424ea30a05$export$a11b0059900ceec8() {
  return $c87311424ea30a05$var$testUserAgent(/Android/i);
}

function $e9faafb641e167db$export$90fc3a17d93f704c(ref, event, handler1, options) {
  let handlerRef = useRef(handler1);
  handlerRef.current = handler1;
  let isDisabled = handler1 == null;
  useEffect(() => {
    if (isDisabled) return;
    let element = ref.current;

    let handler = e => handlerRef.current.call(this, e);

    element.addEventListener(event, handler, options);
    return () => {
      element.removeEventListener(event, handler, options);
    };
  }, [ref, event, options, isDisabled]);
}

function $1dbecbe27a04f9af$export$14d238f342723f25(defaultValue) {
  let [value, setValue] = useState(defaultValue);
  let valueRef = useRef(value);
  let effect = useRef(null);
  valueRef.current = value; // Store the function in a ref so we can always access the current version
  // which has the proper `value` in scope.

  let nextRef = useRef(null);

  nextRef.current = () => {
    // Run the generator to the next yield.
    let newValue = effect.current.next(); // If the generator is done, reset the effect.

    if (newValue.done) {
      effect.current = null;
      return;
    } // If the value is the same as the current value,
    // then continue to the next yield. Otherwise,
    // set the value in state and wait for the next layout effect.


    if (value === newValue.value) nextRef.current();else setValue(newValue.value);
  };

  $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c(() => {
    // If there is an effect currently running, continue to the next yield.
    if (effect.current) nextRef.current();
  });
  let queue = useCallback(fn => {
    effect.current = fn(valueRef.current);
    nextRef.current();
  }, [effect, nextRef]);
  return [value, queue];
}

function $2f04cbc44ee30ce0$export$53a0910f038337bd(scrollView, element) {
  let offsetX = $2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'left');
  let offsetY = $2f04cbc44ee30ce0$var$relativeOffset(scrollView, element, 'top');
  let width = element.offsetWidth;
  let height = element.offsetHeight;
  let x = scrollView.scrollLeft;
  let y = scrollView.scrollTop;
  let maxX = x + scrollView.offsetWidth;
  let maxY = y + scrollView.offsetHeight;
  if (offsetX <= x) x = offsetX;else if (offsetX + width > maxX) x += offsetX + width - maxX;
  if (offsetY <= y) y = offsetY;else if (offsetY + height > maxY) y += offsetY + height - maxY;
  scrollView.scrollLeft = x;
  scrollView.scrollTop = y;
}
/**
 * Computes the offset left or top from child to ancestor by accumulating
 * offsetLeft or offsetTop through intervening offsetParents.
 */


function $2f04cbc44ee30ce0$var$relativeOffset(ancestor, child, axis) {
  const prop = axis === 'left' ? 'offsetLeft' : 'offsetTop';
  let sum = 0;

  while (child.offsetParent) {
    sum += child[prop];
    if (child.offsetParent === ancestor) break;else if (child.offsetParent.contains(ancestor)) {
      // If the ancestor is not `position:relative`, then we stop at
      // _its_ offset parent, and we subtract off _its_ offset, so that
      // we end up with the proper offset from child to ancestor.
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent;
  }

  return sum;
}

export { $ff5963eb1fccf552$export$e08e3b67e392101e as chain, $65484d02dcb7eb3e$export$457c3d6518dd4c6f as filterDOMProps, $7215afc6de606d6b$export$de79e2c695e052f3 as focusWithoutScrolling, $ab71dadb03a6fb2e$export$622cea445a1c5b7d as getOffset, $62d8ded9296f3872$export$cfa2225e87938781 as getScrollParent, $c87311424ea30a05$export$a11b0059900ceec8 as isAndroid, $c87311424ea30a05$export$e1865c3bedcd822b as isAppleDevice, $c87311424ea30a05$export$6446a186d09e379e as isChrome, $c87311424ea30a05$export$fedb369cb70207f1 as isIOS, $c87311424ea30a05$export$7bef049ce92e4224 as isIPad, $c87311424ea30a05$export$186c6964ca17d99 as isIPhone, $c87311424ea30a05$export$9ac100e40613ea10 as isMac, $c87311424ea30a05$export$78551043582a6a98 as isWebKit, $bdb11010cef70236$export$cd8c9cb68f842629 as mergeIds, $3ef42575df84b30b$export$9d1611c77c2fe928 as mergeProps, $5dc95899b306f630$export$c9058316764c140e as mergeRefs, $bbed8b41f857bcc0$export$24490316f764c430 as runAfterTransition, $2f04cbc44ee30ce0$export$53a0910f038337bd as scrollIntoView, $ef06256079686ba0$export$f8aeda7b10753fa1 as useDescription, $9cc09df9fd7676be$export$7bbed75feba39706 as useDrag1D, $e9faafb641e167db$export$90fc3a17d93f704c as useEvent, $03deb23ff14920c4$export$4eaf04e54aa8eed6 as useGlobalListeners, $bdb11010cef70236$export$f680877a34711e37 as useId, $313b98861ee5dd6c$export$d6875122194c7b44 as useLabels, $f0a04ccd8dbdd83b$export$e5c5a5f917a5871c as useLayoutEffect, $df56164dff5785e2$export$4338b53315abf666 as useObjectRef, $9daab02d461809db$export$683480f191c0e3ea as useResizeObserver, $bdb11010cef70236$export$b4cc09c592e8fdb8 as useSlotId, $e7801be82b4b2a53$export$4debdb1a3f0fa79e as useSyncRef, $4f58c5f72bcf79f7$export$496315a1608d9602 as useUpdateEffect, $1dbecbe27a04f9af$export$14d238f342723f25 as useValueEffect, $5df64b3807dc15ee$export$d699905dd57c73ca as useViewportSize };