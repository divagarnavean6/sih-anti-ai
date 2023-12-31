'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import $6nfFC$react, { useRef, useContext, useEffect, useState, useCallback } from 'react';
import { runAfterTransition, focusWithoutScrolling, useLayoutEffect, mergeProps, useSyncRef } from '@react-aria/utils';
import { getInteractionModality, isFocusVisible, useFocusVisibleListener, useFocus, useFocusWithin, useKeyboard } from '@react-aria/interactions';

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

function $6a99195332edec8b$export$80f3e147d781571c(element) {
  // If the user is interacting with a virtual cursor, e.g. screen reader, then
  // wait until after any animated transitions that are currently occurring on
  // the page before shifting focus. This avoids issues with VoiceOver on iOS
  // causing the page to scroll when moving focus if the element is transitioning
  // from off the screen.
  if (getInteractionModality() === 'virtual') {
    let lastFocusedElement = document.activeElement;
    runAfterTransition(() => {
      // If focus did not move and the element is still in the document, focus it.
      if (document.activeElement === lastFocusedElement && document.contains(element)) focusWithoutScrolling(element);
    });
  } else focusWithoutScrolling(element);
}
/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */


function $645f2e67b85a24c9$var$isStyleVisible(element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return false;
  let {
    display: display,
    visibility: visibility
  } = element.style;
  let isVisible = display !== 'none' && visibility !== 'hidden' && visibility !== 'collapse';

  if (isVisible) {
    const {
      getComputedStyle: getComputedStyle
    } = element.ownerDocument.defaultView;
    let {
      display: computedDisplay,
      visibility: computedVisibility
    } = getComputedStyle(element);
    isVisible = computedDisplay !== 'none' && computedVisibility !== 'hidden' && computedVisibility !== 'collapse';
  }

  return isVisible;
}

function $645f2e67b85a24c9$var$isAttributeVisible(element, childElement) {
  return !element.hasAttribute('hidden') && (element.nodeName === 'DETAILS' && childElement && childElement.nodeName !== 'SUMMARY' ? element.hasAttribute('open') : true);
}

function $645f2e67b85a24c9$export$e989c0fffaa6b27a(element, childElement) {
  return element.nodeName !== '#comment' && $645f2e67b85a24c9$var$isStyleVisible(element) && $645f2e67b85a24c9$var$isAttributeVisible(element, childElement) && (!element.parentElement || $645f2e67b85a24c9$export$e989c0fffaa6b27a(element.parentElement, element));
}

const $9bf71ea28793e738$var$FocusContext = /*#__PURE__*/$6nfFC$react.createContext(null);
let $9bf71ea28793e738$var$activeScope = null;

function $9bf71ea28793e738$export$20e40289641fbbb6(props) {
  let {
    children: children,
    contain: contain,
    restoreFocus: restoreFocus,
    autoFocus: autoFocus
  } = props;
  let startRef = useRef();
  let endRef = useRef();
  let scopeRef = useRef([]);
  let ctx = useContext($9bf71ea28793e738$var$FocusContext);
  var ref; // if there is no scopeRef on the context, then the parent is the focusScopeTree's root, represented by null

  let parentScope = (ref = ctx === null || ctx === void 0 ? void 0 : ctx.scopeRef) !== null && ref !== void 0 ? ref : null;
  useLayoutEffect(() => {
    // Find all rendered nodes between the sentinels and add them to the scope.
    let node = startRef.current.nextSibling;
    let nodes = [];

    while (node && node !== endRef.current) {
      nodes.push(node);
      node = node.nextSibling;
    }

    scopeRef.current = nodes;
  }, [children, parentScope]); // add to the focus scope tree in render order because useEffects/useLayoutEffects run children first whereas render runs parent first
  // which matters when constructing a tree

  if ($9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(parentScope) && !$9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef)) $9bf71ea28793e738$export$d06fae2ee68b101e.addTreeNode(scopeRef, parentScope);
  let node1 = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef);
  node1.contain = contain;
  $9bf71ea28793e738$var$useFocusContainment(scopeRef, contain);
  $9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain);
  $9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus); // this layout effect needs to run last so that focusScopeTree cleanup happens at the last moment possible

  useLayoutEffect(() => {
    if (scopeRef && (parentScope || parentScope == null)) return () => {
      // Restore the active scope on unmount if this scope or a descendant scope is active.
      // Parent effect cleanups run before children, so we need to check if the
      // parent scope actually still exists before restoring the active scope to it.
      if ((scopeRef === $9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope(scopeRef, $9bf71ea28793e738$var$activeScope)) && (!parentScope || $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(parentScope))) $9bf71ea28793e738$var$activeScope = parentScope;
      $9bf71ea28793e738$export$d06fae2ee68b101e.removeTreeNode(scopeRef);
    };
  }, [scopeRef, parentScope]);
  let focusManager = $9bf71ea28793e738$var$createFocusManagerForScope(scopeRef);
  return /*#__PURE__*/$6nfFC$react.createElement($9bf71ea28793e738$var$FocusContext.Provider, {
    value: {
      scopeRef: scopeRef,
      focusManager: focusManager
    }
  }, /*#__PURE__*/$6nfFC$react.createElement("span", {
    "data-focus-scope-start": true,
    hidden: true,
    ref: startRef
  }), children, /*#__PURE__*/$6nfFC$react.createElement("span", {
    "data-focus-scope-end": true,
    hidden: true,
    ref: endRef
  }));
}

function $9bf71ea28793e738$export$10c5169755ce7bd7() {
  var ref;
  return (ref = useContext($9bf71ea28793e738$var$FocusContext)) === null || ref === void 0 ? void 0 : ref.focusManager;
}

function $9bf71ea28793e738$var$createFocusManagerForScope(scopeRef) {
  return {
    focusNext(opts = {}) {
      let scope = scopeRef.current;
      let {
        from: from,
        tabbable: tabbable,
        wrap: wrap,
        accept: accept
      } = opts;
      let node = from || document.activeElement;
      let sentinel = scope[0].previousElementSibling;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: tabbable,
        accept: accept
      }, scope);
      walker.currentNode = $9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
      let nextNode = walker.nextNode();

      if (!nextNode && wrap) {
        walker.currentNode = sentinel;
        nextNode = walker.nextNode();
      }

      if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
      return nextNode;
    },

    focusPrevious(opts = {}) {
      let scope = scopeRef.current;
      let {
        from: from,
        tabbable: tabbable,
        wrap: wrap,
        accept: accept
      } = opts;
      let node = from || document.activeElement;
      let sentinel = scope[scope.length - 1].nextElementSibling;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: tabbable,
        accept: accept
      }, scope);
      walker.currentNode = $9bf71ea28793e738$var$isElementInScope(node, scope) ? node : sentinel;
      let previousNode = walker.previousNode();

      if (!previousNode && wrap) {
        walker.currentNode = sentinel;
        previousNode = walker.previousNode();
      }

      if (previousNode) $9bf71ea28793e738$var$focusElement(previousNode, true);
      return previousNode;
    },

    focusFirst(opts = {}) {
      let scope = scopeRef.current;
      let {
        tabbable: tabbable,
        accept: accept
      } = opts;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: tabbable,
        accept: accept
      }, scope);
      walker.currentNode = scope[0].previousElementSibling;
      let nextNode = walker.nextNode();
      if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
      return nextNode;
    },

    focusLast(opts = {}) {
      let scope = scopeRef.current;
      let {
        tabbable: tabbable,
        accept: accept
      } = opts;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: tabbable,
        accept: accept
      }, scope);
      walker.currentNode = scope[scope.length - 1].nextElementSibling;
      let previousNode = walker.previousNode();
      if (previousNode) $9bf71ea28793e738$var$focusElement(previousNode, true);
      return previousNode;
    }

  };
}

const $9bf71ea28793e738$var$focusableElements = ['input:not([disabled]):not([type=hidden])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'a[href]', 'area[href]', 'summary', 'iframe', 'object', 'embed', 'audio[controls]', 'video[controls]', '[contenteditable]'];
const $9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR = $9bf71ea28793e738$var$focusableElements.join(':not([hidden]),') + ',[tabindex]:not([disabled]):not([hidden])';
$9bf71ea28793e738$var$focusableElements.push('[tabindex]:not([tabindex="-1"]):not([disabled])');
const $9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR = $9bf71ea28793e738$var$focusableElements.join(':not([hidden]):not([tabindex="-1"]),');

function $9bf71ea28793e738$var$getScopeRoot(scope) {
  return scope[0].parentElement;
}

function $9bf71ea28793e738$var$shouldContainFocus(scopeRef) {
  let scope = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode($9bf71ea28793e738$var$activeScope);

  while (scope && scope.scopeRef !== scopeRef) {
    if (scope.contain) return false;
    scope = scope.parent;
  }

  return true;
}

function $9bf71ea28793e738$var$useFocusContainment(scopeRef, contain) {
  let focusedNode = useRef();
  let raf = useRef(null);
  useLayoutEffect(() => {
    let scope1 = scopeRef.current;

    if (!contain) {
      // if contain was changed, then we should cancel any ongoing waits to pull focus back into containment
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }

      return;
    } // Handle the Tab key to contain focus within the scope


    let onKeyDown = e => {
      if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey || !$9bf71ea28793e738$var$shouldContainFocus(scopeRef)) return;
      let focusedElement = document.activeElement;
      let scope = scopeRef.current;
      if (!$9bf71ea28793e738$var$isElementInScope(focusedElement, scope)) return;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
        tabbable: true
      }, scope);
      walker.currentNode = focusedElement;
      let nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();

      if (!nextElement) {
        walker.currentNode = e.shiftKey ? scope[scope.length - 1].nextElementSibling : scope[0].previousElementSibling;
        nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();
      }

      e.preventDefault();
      if (nextElement) $9bf71ea28793e738$var$focusElement(nextElement, true);
    };

    let onFocus = e => {
      // If focusing an element in a child scope of the currently active scope, the child becomes active.
      // Moving out of the active scope to an ancestor is not allowed.
      if (!$9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope($9bf71ea28793e738$var$activeScope, scopeRef)) {
        $9bf71ea28793e738$var$activeScope = scopeRef;
        focusedNode.current = e.target;
      } else if ($9bf71ea28793e738$var$shouldContainFocus(scopeRef) && !$9bf71ea28793e738$var$isElementInChildScope(e.target, scopeRef)) {
        // If a focus event occurs outside the active scope (e.g. user tabs from browser location bar),
        // restore focus to the previously focused node or the first tabbable element in the active scope.
        if (focusedNode.current) focusedNode.current.focus();else if ($9bf71ea28793e738$var$activeScope) $9bf71ea28793e738$var$focusFirstInScope($9bf71ea28793e738$var$activeScope.current);
      } else if ($9bf71ea28793e738$var$shouldContainFocus(scopeRef)) focusedNode.current = e.target;
    };

    let onBlur = e => {
      // Firefox doesn't shift focus back to the Dialog properly without this
      raf.current = requestAnimationFrame(() => {
        // Use document.activeElement instead of e.relatedTarget so we can tell if user clicked into iframe
        if ($9bf71ea28793e738$var$shouldContainFocus(scopeRef) && !$9bf71ea28793e738$var$isElementInChildScope(document.activeElement, scopeRef)) {
          $9bf71ea28793e738$var$activeScope = scopeRef;

          if (document.body.contains(e.target)) {
            focusedNode.current = e.target;
            focusedNode.current.focus();
          } else if ($9bf71ea28793e738$var$activeScope) $9bf71ea28793e738$var$focusFirstInScope($9bf71ea28793e738$var$activeScope.current);
        }
      });
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('focusin', onFocus, false);
    scope1.forEach(element => element.addEventListener('focusin', onFocus, false));
    scope1.forEach(element => element.addEventListener('focusout', onBlur, false));
    return () => {
      document.removeEventListener('keydown', onKeyDown, false);
      document.removeEventListener('focusin', onFocus, false);
      scope1.forEach(element => element.removeEventListener('focusin', onFocus, false));
      scope1.forEach(element => element.removeEventListener('focusout', onBlur, false));
    };
  }, [scopeRef, contain]); // eslint-disable-next-line arrow-body-style

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [raf]);
}

function $9bf71ea28793e738$var$isElementInAnyScope(element) {
  return $9bf71ea28793e738$var$isElementInChildScope(element);
}

function $9bf71ea28793e738$var$isElementInScope(element, scope) {
  return scope.some(node => node.contains(element));
}

function $9bf71ea28793e738$var$isElementInChildScope(element, scope = null) {
  // node.contains in isElementInScope covers child scopes that are also DOM children,
  // but does not cover child scopes in portals.
  for (let {
    scopeRef: s
  } of $9bf71ea28793e738$export$d06fae2ee68b101e.traverse($9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scope))) {
    if ($9bf71ea28793e738$var$isElementInScope(element, s.current)) return true;
  }

  return false;
}

function $9bf71ea28793e738$var$isAncestorScope(ancestor, scope) {
  var ref;
  let parent = (ref = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scope)) === null || ref === void 0 ? void 0 : ref.parent;

  while (parent) {
    if (parent.scopeRef === ancestor) return true;
    parent = parent.parent;
  }

  return false;
}

function $9bf71ea28793e738$var$focusElement(element, scroll = false) {
  if (element != null && !scroll) try {
    $6a99195332edec8b$export$80f3e147d781571c(element);
  } catch (err) {// ignore
  } else if (element != null) try {
    element.focus();
  } catch (err1) {// ignore
  }
}

function $9bf71ea28793e738$var$focusFirstInScope(scope, tabbable = true) {
  let sentinel = scope[0].previousElementSibling;
  let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
    tabbable: tabbable
  }, scope);
  walker.currentNode = sentinel;
  let nextNode = walker.nextNode(); // If the scope does not contain a tabbable element, use the first focusable element.

  if (tabbable && !nextNode) {
    walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa($9bf71ea28793e738$var$getScopeRoot(scope), {
      tabbable: false
    }, scope);
    walker.currentNode = sentinel;
    nextNode = walker.nextNode();
  }

  $9bf71ea28793e738$var$focusElement(nextNode);
}

function $9bf71ea28793e738$var$useAutoFocus(scopeRef, autoFocus) {
  const autoFocusRef = $6nfFC$react.useRef(autoFocus);
  useEffect(() => {
    if (autoFocusRef.current) {
      $9bf71ea28793e738$var$activeScope = scopeRef;
      if (!$9bf71ea28793e738$var$isElementInScope(document.activeElement, $9bf71ea28793e738$var$activeScope.current)) $9bf71ea28793e738$var$focusFirstInScope(scopeRef.current);
    }

    autoFocusRef.current = false;
  }, [scopeRef]);
}

function $9bf71ea28793e738$var$useRestoreFocus(scopeRef, restoreFocus, contain) {
  // create a ref during render instead of useLayoutEffect so the active element is saved before a child with autoFocus=true mounts.
  const nodeToRestoreRef = useRef(typeof document !== 'undefined' ? document.activeElement : null); // restoring scopes should all track if they are active regardless of contain, but contain already tracks it plus logic to contain the focus
  // restoring-non-containing scopes should only care if they become active so they can perform the restore

  useLayoutEffect(() => {
    let scope = scopeRef.current;
    if (!restoreFocus || contain) return;

    let onFocus = () => {
      // If focusing an element in a child scope of the currently active scope, the child becomes active.
      // Moving out of the active scope to an ancestor is not allowed.
      if (!$9bf71ea28793e738$var$activeScope || $9bf71ea28793e738$var$isAncestorScope($9bf71ea28793e738$var$activeScope, scopeRef)) $9bf71ea28793e738$var$activeScope = scopeRef;
    };

    document.addEventListener('focusin', onFocus, false);
    scope.forEach(element => element.addEventListener('focusin', onFocus, false));
    return () => {
      document.removeEventListener('focusin', onFocus, false);
      scope.forEach(element => element.removeEventListener('focusin', onFocus, false));
    };
  }, [scopeRef, contain]); // useLayoutEffect instead of useEffect so the active element is saved synchronously instead of asynchronously.

  useLayoutEffect(() => {
    $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore = nodeToRestoreRef.current;
    if (!restoreFocus) return; // Handle the Tab key so that tabbing out of the scope goes to the next element
    // after the node that had focus when the scope mounted. This is important when
    // using portals for overlays, so that focus goes to the expected element when
    // tabbing out of the overlay.

    let onKeyDown = e => {
      if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
      let focusedElement = document.activeElement;
      if (!$9bf71ea28793e738$var$isElementInScope(focusedElement, scopeRef.current)) return;
      let nodeToRestore = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore; // Create a DOM tree walker that matches all tabbable elements

      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(document.body, {
        tabbable: true
      }); // Find the next tabbable element after the currently focused element

      walker.currentNode = focusedElement;
      let nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode();

      if (!document.body.contains(nodeToRestore) || nodeToRestore === document.body) {
        nodeToRestore = null;
        $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore = null;
      } // If there is no next element, or it is outside the current scope, move focus to the
      // next element after the node to restore to instead.


      if ((!nextElement || !$9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current)) && nodeToRestore) {
        walker.currentNode = nodeToRestore; // Skip over elements within the scope, in case the scope immediately follows the node to restore.

        do nextElement = e.shiftKey ? walker.previousNode() : walker.nextNode(); while ($9bf71ea28793e738$var$isElementInScope(nextElement, scopeRef.current));

        e.preventDefault();
        e.stopPropagation();
        if (nextElement) $9bf71ea28793e738$var$focusElement(nextElement, true);else // If there is no next element and the nodeToRestore isn't within a FocusScope (i.e. we are leaving the top level focus scope)
          // then move focus to the body.
          // Otherwise restore focus to the nodeToRestore (e.g menu within a popover -> tabbing to close the menu should move focus to menu trigger)
          if (!$9bf71ea28793e738$var$isElementInAnyScope(nodeToRestore)) focusedElement.blur();else $9bf71ea28793e738$var$focusElement(nodeToRestore, true);
      }
    };

    if (!contain) document.addEventListener('keydown', onKeyDown, true);
    return () => {
      if (!contain) document.removeEventListener('keydown', onKeyDown, true);
      let nodeToRestore = $9bf71ea28793e738$export$d06fae2ee68b101e.getTreeNode(scopeRef).nodeToRestore; // if we already lost focus to the body and this was the active scope, then we should attempt to restore

      if (restoreFocus && nodeToRestore && ($9bf71ea28793e738$var$isElementInScope(document.activeElement, scopeRef.current) || document.activeElement === document.body && $9bf71ea28793e738$var$activeScope === scopeRef)) {
        // freeze the focusScopeTree so it persists after the raf, otherwise during unmount nodes are removed from it
        let clonedTree = $9bf71ea28793e738$export$d06fae2ee68b101e.clone();
        requestAnimationFrame(() => {
          // Only restore focus if we've lost focus to the body, the alternative is that focus has been purposefully moved elsewhere
          if (document.activeElement === document.body) {
            // look up the tree starting with our scope to find a nodeToRestore still in the DOM
            let treeNode = clonedTree.getTreeNode(scopeRef);

            while (treeNode) {
              if (treeNode.nodeToRestore && document.body.contains(treeNode.nodeToRestore)) {
                $9bf71ea28793e738$var$focusElement(treeNode.nodeToRestore);
                return;
              }

              treeNode = treeNode.parent;
            }
          }
        });
      }
    };
  }, [scopeRef, restoreFocus, contain]);
}

function $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, opts, scope) {
  let selector = (opts === null || opts === void 0 ? void 0 : opts.tabbable) ? $9bf71ea28793e738$var$TABBABLE_ELEMENT_SELECTOR : $9bf71ea28793e738$var$FOCUSABLE_ELEMENT_SELECTOR;
  let walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      var ref; // Skip nodes inside the starting node.

      if (opts === null || opts === void 0 ? void 0 : (ref = opts.from) === null || ref === void 0 ? void 0 : ref.contains(node)) return NodeFilter.FILTER_REJECT;
      if (node.matches(selector) && $645f2e67b85a24c9$export$e989c0fffaa6b27a(node) && (!scope || $9bf71ea28793e738$var$isElementInScope(node, scope)) && (!(opts === null || opts === void 0 ? void 0 : opts.accept) || opts.accept(node))) return NodeFilter.FILTER_ACCEPT;
      return NodeFilter.FILTER_SKIP;
    }

  });
  if (opts === null || opts === void 0 ? void 0 : opts.from) walker.currentNode = opts.from;
  return walker;
}

function $9bf71ea28793e738$export$c5251b9e124bf29(ref, defaultOptions = {}) {
  return {
    focusNext(opts = {}) {
      let root = ref.current;
      if (!root) return;
      let {
        from: from,
        tabbable = defaultOptions.tabbable,
        wrap = defaultOptions.wrap,
        accept = defaultOptions.accept
      } = opts;
      let node = from || document.activeElement;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable: tabbable,
        accept: accept
      });
      if (root.contains(node)) walker.currentNode = node;
      let nextNode = walker.nextNode();

      if (!nextNode && wrap) {
        walker.currentNode = root;
        nextNode = walker.nextNode();
      }

      if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
      return nextNode;
    },

    focusPrevious(opts = defaultOptions) {
      let root = ref.current;
      if (!root) return;
      let {
        from: from,
        tabbable = defaultOptions.tabbable,
        wrap = defaultOptions.wrap,
        accept = defaultOptions.accept
      } = opts;
      let node = from || document.activeElement;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable: tabbable,
        accept: accept
      });
      if (root.contains(node)) walker.currentNode = node;else {
        let next = $9bf71ea28793e738$var$last(walker);
        if (next) $9bf71ea28793e738$var$focusElement(next, true);
        return next;
      }
      let previousNode = walker.previousNode();

      if (!previousNode && wrap) {
        walker.currentNode = root;
        previousNode = $9bf71ea28793e738$var$last(walker);
      }

      if (previousNode) $9bf71ea28793e738$var$focusElement(previousNode, true);
      return previousNode;
    },

    focusFirst(opts = defaultOptions) {
      let root = ref.current;
      if (!root) return;
      let {
        tabbable = defaultOptions.tabbable,
        accept = defaultOptions.accept
      } = opts;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable: tabbable,
        accept: accept
      });
      let nextNode = walker.nextNode();
      if (nextNode) $9bf71ea28793e738$var$focusElement(nextNode, true);
      return nextNode;
    },

    focusLast(opts = defaultOptions) {
      let root = ref.current;
      if (!root) return;
      let {
        tabbable = defaultOptions.tabbable,
        accept = defaultOptions.accept
      } = opts;
      let walker = $9bf71ea28793e738$export$2d6ec8fc375ceafa(root, {
        tabbable: tabbable,
        accept: accept
      });
      let next = $9bf71ea28793e738$var$last(walker);
      if (next) $9bf71ea28793e738$var$focusElement(next, true);
      return next;
    }

  };
}

function $9bf71ea28793e738$var$last(walker) {
  let next;
  let last;

  do {
    last = walker.lastChild();
    if (last) next = last;
  } while (last);

  return next;
}

class $9bf71ea28793e738$var$Tree {
  get size() {
    return this.fastMap.size;
  }

  getTreeNode(data) {
    return this.fastMap.get(data);
  }

  addTreeNode(scopeRef, parent, nodeToRestore) {
    let parentNode = this.fastMap.get(parent !== null && parent !== void 0 ? parent : null);
    let node = new $9bf71ea28793e738$var$TreeNode({
      scopeRef: scopeRef
    });
    parentNode.addChild(node);
    node.parent = parentNode;
    this.fastMap.set(scopeRef, node);
    if (nodeToRestore) node.nodeToRestore = nodeToRestore;
  }

  removeTreeNode(scopeRef) {
    // never remove the root
    if (scopeRef === null) return;
    let node = this.fastMap.get(scopeRef);
    let parentNode = node.parent; // when we remove a scope, check if any sibling scopes are trying to restore focus to something inside the scope we're removing
    // if we are, then replace the siblings restore with the restore from the scope we're removing

    for (let current of this.traverse()) if (current !== node && node.nodeToRestore && current.nodeToRestore && node.scopeRef.current && $9bf71ea28793e738$var$isElementInScope(current.nodeToRestore, node.scopeRef.current)) current.nodeToRestore = node.nodeToRestore;

    let children = node.children;
    parentNode.removeChild(node);
    if (children.length > 0) children.forEach(child => parentNode.addChild(child));
    this.fastMap.delete(node.scopeRef);
  } // Pre Order Depth First


  *traverse(node = this.root) {
    if (node.scopeRef != null) yield node;
    if (node.children.length > 0) for (let child of node.children) yield* this.traverse(child);
  }

  clone() {
    let newTree = new $9bf71ea28793e738$var$Tree();

    for (let node of this.traverse()) newTree.addTreeNode(node.scopeRef, node.parent.scopeRef, node.nodeToRestore);

    return newTree;
  }

  constructor() {
    this.fastMap = new Map();
    this.root = new $9bf71ea28793e738$var$TreeNode({
      scopeRef: null
    });
    this.fastMap.set(null, this.root);
  }

}

class $9bf71ea28793e738$var$TreeNode {
  addChild(node) {
    this.children.push(node);
    node.parent = this;
  }

  removeChild(node) {
    this.children.splice(this.children.indexOf(node), 1);
    node.parent = undefined;
  }

  constructor(props) {
    this.children = [];
    this.contain = false;
    this.scopeRef = props.scopeRef;
  }

}

let $9bf71ea28793e738$export$d06fae2ee68b101e = new $9bf71ea28793e738$var$Tree();

function $f7dceffc5ad7768b$export$4e328f61c538687f(props = {}) {
  let {
    autoFocus = false,
    isTextInput: isTextInput,
    within: within
  } = props;
  let state = useRef({
    isFocused: false,
    isFocusVisible: autoFocus || isFocusVisible()
  });
  let [isFocused1, setFocused] = useState(false);
  let [isFocusVisibleState, setFocusVisible] = useState(() => state.current.isFocused && state.current.isFocusVisible);
  let updateState = useCallback(() => setFocusVisible(state.current.isFocused && state.current.isFocusVisible), []);
  let onFocusChange = useCallback(isFocused => {
    state.current.isFocused = isFocused;
    setFocused(isFocused);
    updateState();
  }, [updateState]);
  useFocusVisibleListener(isFocusVisible => {
    state.current.isFocusVisible = isFocusVisible;
    updateState();
  }, [], {
    isTextInput: isTextInput
  });
  let {
    focusProps: focusProps
  } = useFocus({
    isDisabled: within,
    onFocusChange: onFocusChange
  });
  let {
    focusWithinProps: focusWithinProps
  } = useFocusWithin({
    isDisabled: !within,
    onFocusWithinChange: onFocusChange
  });
  return {
    isFocused: isFocused1,
    isFocusVisible: state.current.isFocused && isFocusVisibleState,
    focusProps: within ? focusWithinProps : focusProps
  };
}

function $907718708eab68af$export$1a38b4ad7f578e1d(props) {
  let {
    children: children,
    focusClass: focusClass,
    focusRingClass: focusRingClass
  } = props;
  let {
    isFocused: isFocused,
    isFocusVisible: isFocusVisible,
    focusProps: focusProps
  } = $f7dceffc5ad7768b$export$4e328f61c538687f(props);
  let child = $6nfFC$react.Children.only(children);
  return /*#__PURE__*/$6nfFC$react.cloneElement(child, mergeProps(child.props, Object.assign({}, focusProps, {
    className: clsx({
      [focusClass || '']: isFocused,
      [focusRingClass || '']: isFocusVisible
    })
  })));
}

let $e6afbd83fe6ebbd2$var$FocusableContext = /*#__PURE__*/$6nfFC$react.createContext(null);

function $e6afbd83fe6ebbd2$var$useFocusableContext(ref) {
  let context = useContext($e6afbd83fe6ebbd2$var$FocusableContext) || {};
  useSyncRef(context, ref); // eslint-disable-next-line

  let otherProps = _objectWithoutPropertiesLoose(context, ["ref"]);

  return otherProps;
}
/**
 * Provides DOM props to the nearest focusable child.
 */


function $e6afbd83fe6ebbd2$var$FocusableProvider(props, ref) {
  let {
    children: children
  } = props,
      otherProps = _objectWithoutPropertiesLoose(props, ["children"]);

  let context = Object.assign({}, otherProps, {
    ref: ref
  });
  return /*#__PURE__*/$6nfFC$react.createElement($e6afbd83fe6ebbd2$var$FocusableContext.Provider, {
    value: context
  }, children);
}

let $e6afbd83fe6ebbd2$export$13f3202a3e5ddd5 = /*#__PURE__*/$6nfFC$react.forwardRef($e6afbd83fe6ebbd2$var$FocusableProvider);

function $e6afbd83fe6ebbd2$export$4c014de7c8940b4c(props, domRef) {
  let {
    focusProps: focusProps
  } = useFocus(props);
  let {
    keyboardProps: keyboardProps
  } = useKeyboard(props);
  let interactions = mergeProps(focusProps, keyboardProps);
  let domProps = $e6afbd83fe6ebbd2$var$useFocusableContext(domRef);
  let interactionProps = props.isDisabled ? {} : domProps;
  let autoFocusRef = useRef(props.autoFocus);
  useEffect(() => {
    if (autoFocusRef.current && domRef.current) $6a99195332edec8b$export$80f3e147d781571c(domRef.current);
    autoFocusRef.current = false;
  }, [domRef]);
  return {
    focusableProps: mergeProps(Object.assign({}, interactions, {
      tabIndex: props.excludeFromTabOrder && !props.isDisabled ? -1 : undefined
    }), interactionProps)
  };
}

export { $907718708eab68af$export$1a38b4ad7f578e1d as FocusRing, $9bf71ea28793e738$export$20e40289641fbbb6 as FocusScope, $e6afbd83fe6ebbd2$export$13f3202a3e5ddd5 as FocusableProvider, $9bf71ea28793e738$export$c5251b9e124bf29 as createFocusManager, $6a99195332edec8b$export$80f3e147d781571c as focusSafely, $9bf71ea28793e738$export$2d6ec8fc375ceafa as getFocusableTreeWalker, $9bf71ea28793e738$export$10c5169755ce7bd7 as useFocusManager, $f7dceffc5ad7768b$export$4e328f61c538687f as useFocusRing, $e6afbd83fe6ebbd2$export$4c014de7c8940b4c as useFocusable };