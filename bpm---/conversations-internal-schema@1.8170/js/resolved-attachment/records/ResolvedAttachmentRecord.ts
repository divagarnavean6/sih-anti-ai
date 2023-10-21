import { Record } from 'immutable';
import FileMetadataRecord from '../../file-metadata/records/FileMetadataRecord';

class ResolvedAttachmentRecord extends Record({
  fileId: 0,
  fileMetadata: null,
  fileUsageType: null,
  thumbnailMetadata: null
}, 'ResolvedAttachmentRecord') {
  constructor(properties = {}) {
    super(Object.assign({}, properties, {
      fileMetadata: properties.fileMetadata ? new FileMetadataRecord(properties.fileMetadata) : null,
      thumbnailMetadata: properties.thumbnailMetadata ? new FileMetadataRecord(properties.thumbnailMetadata) : null
    }));
  }

}

export default ResolvedAttachmentRecord;