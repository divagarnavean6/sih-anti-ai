'use es6';

import { useSlotId, filterDOMProps } from '@react-aria/utils';
import { focusSafely } from '@react-aria/focus';
import { useEffect } from 'react';

function $40df3f8667284809$export$d55e7ee900f34e93(props, ref) {
  let {
    role = 'dialog'
  } = props;
  let titleId = useSlotId();
  titleId = props['aria-label'] ? undefined : titleId; // Focus the dialog itself on mount, unless a child element is already focused.

  useEffect(() => {
    if (ref.current && !ref.current.contains(document.activeElement)) {
      focusSafely(ref.current); // Safari on iOS does not move the VoiceOver cursor to the dialog
      // or announce that it has opened until it has rendered. A workaround
      // is to wait for half a second, then blur and re-focus the dialog.

      let timeout = setTimeout(() => {
        if (document.activeElement === ref.current) {
          ref.current.blur();
          focusSafely(ref.current);
        }
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [ref]); // We do not use aria-modal due to a Safari bug which forces the first focusable element to be focused
  // on mount when inside an iframe, no matter which element we programmatically focus.
  // See https://bugs.webkit.org/show_bug.cgi?id=211934.
  // useModal sets aria-hidden on all elements outside the dialog, so the dialog will behave as a modal
  // even without aria-modal on the dialog itself.

  return {
    dialogProps: Object.assign({}, filterDOMProps(props, {
      labelable: true
    }), {
      role: role,
      tabIndex: -1,
      'aria-labelledby': props['aria-labelledby'] || titleId
    }),
    titleProps: {
      id: titleId
    }
  };
}

export { $40df3f8667284809$export$d55e7ee900f34e93 as useDialog };