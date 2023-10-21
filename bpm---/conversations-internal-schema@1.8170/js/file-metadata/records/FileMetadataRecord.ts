import { Record } from 'immutable';
import { OTHER } from '../constants/fileAttachmentTypes';

class FileMetadataRecord extends Record({
  expiresAt: 0,
  url: '',
  name: '',
  extension: '',
  type: OTHER,
  fileSize: 0,
  width: null,
  height: null
}, 'FileMetadataRecord') {
  constructor(properties = {}) {
    super(Object.assign({}, properties, {
      fileSize: properties.fileSize || properties.size || 0
    }));
  }

}

export default FileMetadataRecord;