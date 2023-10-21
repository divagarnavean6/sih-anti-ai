/* eslint-disable @typescript-eslint/no-use-before-define */
import performanceNow from '../vendor/performanceNow';
/*
  This code is taken from
  https://github.com/GoogleChrome/web-vitals/blob/3f3338d994f182172d5b97b22a0fcce0c2846908/src/lib/polyfills/firstInputPolyfill.ts
*/

let firstInputEvent;
let firstInputDelay;
let firstInputTimeStamp;
let callbacks;
const listenerOpts = {
  passive: true,
  capture: true
};
const startTimeStamp = new Date();
export const firstInputPolyfill = onFirstInput => {
  callbacks.push(onFirstInput);
  reportFirstInputDelayIfRecordedAndValid();
};
export const resetFirstInputPolyfill = () => {
  callbacks = [];
  firstInputDelay = -1;
  firstInputEvent = null;
  eachEventType(window.addEventListener);
};

const recordFirstInputDelay = (delay, event) => {
  if (!firstInputEvent) {
    firstInputEvent = event;
    firstInputDelay = delay;
    firstInputTimeStamp = new Date();
    eachEventType(window.removeEventListener);
    reportFirstInputDelayIfRecordedAndValid();
  }
};

const reportFirstInputDelayIfRecordedAndValid = () => {
  if (firstInputDelay >= 0 && // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (subtracting two dates always returns a number)
  firstInputDelay < firstInputTimeStamp - startTimeStamp) {
    const entry = {
      entryType: 'first-input',
      name: firstInputEvent.type,
      target: firstInputEvent.target,
      cancelable: firstInputEvent.cancelable,
      startTime: firstInputEvent.timeStamp,
      processingStart: firstInputEvent.timeStamp + firstInputDelay
    };
    callbacks.forEach(callback => {
      callback(entry);
    });
    callbacks = [];
  }
};

const onInput = event => {
  if (event.cancelable) {
    const isEpochTime = event.timeStamp > 1e12;
    const now = isEpochTime ? new Date() : performanceNow();
    const delay = now - event.timeStamp;

    if (event.type === 'pointerdown') {
      onPointerDown(delay, event);
    } else {
      recordFirstInputDelay(delay, event);
    }
  }
}; // Handles pointer down events, which are a special case, since we need to exclude scrolling and zooming.


const onPointerDown = (delay, event) => {
  const onPointerUp = () => {
    recordFirstInputDelay(delay, event);
    removePointerEventListeners();
  };

  const onPointerCancel = () => {
    removePointerEventListeners();
  };

  const removePointerEventListeners = () => {
    window.removeEventListener('pointerup', onPointerUp, listenerOpts);
    window.removeEventListener('pointercancel', onPointerCancel, listenerOpts);
  };

  window.addEventListener('pointerup', onPointerUp, listenerOpts);
  window.addEventListener('pointercancel', onPointerCancel, listenerOpts);
};

const eachEventType = callback => {
  const eventTypes = ['mousedown', 'keydown', 'touchstart', 'pointerdown'];
  eventTypes.forEach(type => callback(type, onInput, listenerOpts));
};