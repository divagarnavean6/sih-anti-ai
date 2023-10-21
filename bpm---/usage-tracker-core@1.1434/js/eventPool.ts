import * as helpers from './common/helpers';
import * as storageKeys from './storageKeys';
const SERIALIZED_ARRAY = JSON.stringify([]);
export const createScheduler = (isDocumentReady, debounceTime = 2000, maxDeferredAttempts = 3) => {
  let deferredInterval = 0;
  let deferredAttempts = 0; // This helps us to eagerly detect if the document is ready already by when this scheduler was created
  // And it already kicks-off the fake state if "window" is not present, as the timeout will be triggered

  let _isDocumentReady = isDocumentReady();

  const execute = callback => callback(); // This waits until the isDocumentReady() returns `true`
  // The interval will keep running until the document is ready
  // If the interval gets executed for X amount of times without the document being ready
  // It will exhaust the interval and will then execute the callback anyway
  // It is important to mention that the intervals do not stack up as it will be executed only once


  const deferredExecution = callback => {
    if (deferredInterval) {
      return;
    }

    deferredInterval = setInterval(() => {
      // The deferred execution interval attempts to check for X times if the document is ready
      // On an interval of Y seconds, meaning if the first check failed, it will attempt more X - 1 attempts
      // To give a total of X * Y seconds of waiting time. The document might not have been initialised by then
      // But usually this happens for meterred connections or very slow devices.
      const hasExhaustedAttempts = deferredAttempts >= maxDeferredAttempts; // We assing it to a variable so that we don't need to call the function again
      // Every time that `scheduleFlush` is called. We also set it to true
      // If by any chance we exhausted the maximum amount of attempts

      _isDocumentReady = isDocumentReady() || hasExhaustedAttempts;

      if (_isDocumentReady) {
        clearInterval(deferredInterval);
        execute(callback); // Cleans up the interval and attempts after the execution
        // To avoid spill over if by any chance the
        // isDocumentReady transitions from "true" to "false"

        deferredInterval = 0;
        deferredAttempts = 0;
        return;
      }

      deferredAttempts += 1;
    }, debounceTime);
  };

  const debouncedExecution = helpers.debounce(execute, debounceTime); // If the document is ready we do a debounced execution which means from every time
  // the method gets called, only one of the calls will get called after the debounceTime
  // If the document is not ready it will do a deferred execution which means the first call
  // Will get called once the document is ready or the maxDeferredAttempts is reached

  const scheduleFlush = callback => {
    if (_isDocumentReady) {
      return debouncedExecution(callback);
    }

    return deferredExecution(callback);
  };

  return {
    scheduleFlush
  };
};
export const createEventPool = ({
  getTempStorage,
  setTempStorage
}) => {
  let isInitialized = false;
  const eventQueue = helpers.createQueue();
  return {
    getIsInitialized: () => isInitialized,
    initialize: ({
      normalizeEvent
    }) => {
      try {
        const storedEvents = getTempStorage(storageKeys.storageKey) || SERIALIZED_ARRAY;
        const parsedEvents = JSON.parse(storedEvents);

        if (parsedEvents && helpers.isArray(parsedEvents)) {
          parsedEvents.forEach(event => {
            if (event && typeof event === 'object') {
              eventQueue.enqueue(normalizeEvent(event));
            }
          });
        }

        isInitialized = true;
      } catch (err) {
        /* noOp */
      }
    },
    push: event => {
      try {
        const storedEvents = getTempStorage(storageKeys.storageKey) || SERIALIZED_ARRAY;
        const parsedEvents = JSON.parse(storedEvents);
        parsedEvents.push(event);
        setTempStorage(storageKeys.storageKey, JSON.stringify(parsedEvents));
      } catch (err) {
        /* noOp */
      }

      eventQueue.enqueue(event);
    },
    flush: () => {
      const events = [];

      do {
        const event = eventQueue.dequeue();

        if (event) {
          events.unshift(event);
        }
      } while (eventQueue.peek());

      try {
        setTempStorage(storageKeys.storageKey, SERIALIZED_ARRAY);
      } catch (err) {
        /* noOp */
      }

      return events;
    },
    peek: eventQueue.peek
  };
};