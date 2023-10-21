'use es6';

import setIn from 'transmute/setIn';
import { HAS_FILE_ATTACHMENT, PREVIEW_TEXT, FAILED, RESPONDER, VISITOR, PREVIEW_MESSAGE_ID } from '../constants/threadPreviewKeyPaths';
export const setHasFileAttachment = setIn(HAS_FILE_ATTACHMENT);
export const setPreviewText = setIn(PREVIEW_TEXT);
export const setPreviewMessageId = setIn(PREVIEW_MESSAGE_ID);
export const setFailed = setIn(FAILED);
export const setResponder = setIn(RESPONDER);
export const setVisitor = setIn(VISITOR);