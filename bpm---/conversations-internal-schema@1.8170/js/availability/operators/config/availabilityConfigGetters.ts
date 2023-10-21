import getIn from 'transmute/getIn';
import { AWAY_IN_OFFCE_HOURS_STRATEGY, AWAY_MESSAGE, OFFICE_HOURS, OUTSIDE_OFFICE_HOURS_MESSAGE, OUTSIDE_OFFICE_HOURS_STRATEGY, TEAM_MEMBERS_AVAILABILITY_STRATEGY, TYPICAL_RESPONSE_TIME } from '../../constants/keyPaths'; // FIXME make getIn type match immutable's

export const getAwayInOfficeHoursStrategy = getIn(AWAY_IN_OFFCE_HOURS_STRATEGY);
export const getAwayMessage = config => getIn(AWAY_MESSAGE, config) || '';
export const getOfficeHours = getIn(OFFICE_HOURS);
export const getOutsideOfficeHoursMessage = config => getIn(OUTSIDE_OFFICE_HOURS_MESSAGE, config) || '';
export const getOutsideOfficeHoursStrategy = getIn(OUTSIDE_OFFICE_HOURS_STRATEGY);
export const getTeamMembersAvailabilityStrategy = getIn(TEAM_MEMBERS_AVAILABILITY_STRATEGY);
export const getTypicalResponseTime = getIn(TYPICAL_RESPONSE_TIME);