import { useEffect, useContext } from 'react';
import RhumbContext from './internal/RhumbContext';
import { runWithLowPriority } from './internal/Scheduler';
import performanceNow from './vendor/performanceNow';

const useNavMarker = (name, active = true) => {
  const context = useContext(RhumbContext);
  const id = context && context.id;
  const dispatch = context && context.dispatch;
  const enabled = active && typeof context !== 'undefined';

  if (process.env.NODE_ENV !== 'production') {
    if (!/^\S+$/.test(name)) {
      throw new Error(`[react-rhumb] marker names that include spaces are deprecated, please rename marker "${name}" to e.g. "${name.toUpperCase().replace(/\s/g, '_')}"`);
    }
  }

  useEffect( // eslint-disable-next-line consistent-return
  () => {
    if (enabled) {
      const marker = {
        name,
        id
      };
      const timestamp = performanceNow();
      runWithLowPriority(() => {
        dispatch({
          type: 'MARKER_MOUNTED',
          payload: {
            marker,
            timestamp
          }
        });
      });
      return () => {
        runWithLowPriority(() => {
          dispatch({
            type: 'MARKER_UNMOUNTED',
            payload: {
              marker
            }
          });
        });
      };
    }
  }, [name, id, dispatch, enabled]); // dispatch is guaranteed to be static
};

export default useNavMarker;