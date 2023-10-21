'use es6';

import { Record } from 'immutable';
const ThreadPreviewRecord = Record({
  hasFileAttachment: false,
  previewText: null,
  failed: false,
  responder: null,
  visitor: null
}, 'ThreadPreviewRecord');
export default ThreadPreviewRecord;