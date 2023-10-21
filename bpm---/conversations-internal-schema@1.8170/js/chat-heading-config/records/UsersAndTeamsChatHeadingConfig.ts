import { Record, List, fromJS } from 'immutable';
import { USERS_AND_TEAMS } from '../constants/ChatHeadingConfigTypes';

class UsersAndTeamsChatHeadingConfig extends Record({
  '@type': USERS_AND_TEAMS,
  userIds: List(),
  teamIds: List()
}, 'UsersAndTeamsChatHeadingConfig') {
  constructor(options = {}) {
    super(fromJS(options));
  }

}

export default UsersAndTeamsChatHeadingConfig;