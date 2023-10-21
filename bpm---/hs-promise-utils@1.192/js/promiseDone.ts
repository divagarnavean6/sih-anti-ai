/* hs-eslint ignored failing-rules */

/* eslint-disable promise/catch-or-return */
function promiseDone(promise, onFulfilled, onRejected) {
  promise = arguments.length > 1 ? promise.then(onFulfilled, onRejected) : promise;
  promise.then(null, error => {
    setTimeout(() => {
      throw error;
    }, 0);
  });
}

export default promiseDone;