import PropTypes from 'prop-types'; // @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module './Re... Remove this comment to see the full error message

import RecordPropType from './RecordPropType';
export default PropTypes.oneOfType([RecordPropType('CompanyChatHeadingConfig'), RecordPropType('OwnerChatHeadingConfig'), RecordPropType('UsersAndTeamsChatHeadingConfig')]);