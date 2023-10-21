import get from 'transmute/get';
export const getAvailabilityStrategy = get('availabilityStrategy');
export const getAvailabilityStrategyConfig = get('availabilityStrategyConfig');
export const getInboxIsMissingAvailabilityConfig = inbox => !getAvailabilityStrategyConfig(inbox);
export const getOfficeHoursStartTime = get('officeHoursStartTime');
export const getTypicalResponseTime = get('typicalResponseTime');