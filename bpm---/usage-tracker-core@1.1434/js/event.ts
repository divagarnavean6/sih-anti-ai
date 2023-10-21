import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import * as helpers from './common/helpers';
import * as errors from './common/errors';
import * as storageKeys from './storageKeys';
import { SENSITIVE_PROPERTIES, OPTIONAL_PAYLOAD_FIELDS } from './constants';
const AUTHED_IDENTIFIER_LABELS = ['USER_ID', 'EMAIL'];
const ANON_IDENTIFIER_LABELS = ['TEMP_ID', 'VISITOR'];

const identifierLabelInList = (userIdentifier = '', list = []) => typeof userIdentifier === 'string' && list.includes(userIdentifier.split(':')[0]);

const resolveNamespace = (eventKey, namespaceFromDefinition, namespaceFromProperties) => {
  const namespace = namespaceFromDefinition || namespaceFromProperties;

  if (!namespace || namespace === '*') {
    throw errors.eventError(`Namespace not found for "${eventKey}".`);
  }

  return namespace;
};

export const applyIdentifiers = (event, identifiers) => {
  if (!event.who_email && identifiers.raw.email) {
    event.who_email = identifiers.raw.email;
  }

  if (!event.who_identifier && identifiers.raw.userId) {
    event.who_identifier = identifiers.raw.userId;
  }

  if (!event.who_identifier_v2) {
    event.who_identifier_v2 = identifiers.user;
  }

  if (!event.who_team_identifier) {
    event.who_team_identifier = identifiers.team;
  }

  if (!event.utk) {
    event.utk = identifiers.utk;
  }

  return event;
};
export const normalizeIdentifiers = (identifiers, event) => {
  const currentlyAuthed = identifierLabelInList(identifiers.user, [...AUTHED_IDENTIFIER_LABELS]);
  const previouslyUnauthed = identifierLabelInList(event.who_identifier_v2, [...ANON_IDENTIFIER_LABELS]);
  const previouslyNotSet = event.who_identifier_v2 === '[NOT YET SET, SHOULD GET SET PRIOR TO FLUSH]';

  if (currentlyAuthed && previouslyUnauthed || previouslyNotSet) {
    event.who_identifier_v2 = identifiers.user;
  }

  return applyIdentifiers(event, identifiers);
};
export const transformEventPayload = (definition, properties) => {
  const {
    namespace,
    lang,
    screen,
    subscreen,
    timestamp,
    device_id,
    session_id,
    last_sequence_number,
    last_event_id
  } = properties,
        rest = _objectWithoutPropertiesLoose(properties, ["namespace", "lang", "screen", "subscreen", "timestamp", "device_id", "session_id", "last_sequence_number", "last_event_id"]); // Those are the ExtraProperties coming from events.yaml


  const remainingProperties = rest; // Removes sensitive data from the Event Properties and System Properties
  // that should not be part of the `what_extra_json` Event Payload

  const omitedProperties = helpers.omit(remainingProperties, [...SENSITIVE_PROPERTIES, ...OPTIONAL_PAYLOAD_FIELDS]);
  const notAllowedPropertyTypes = ['function', 'object', 'null', 'undefined']; // This provides the final Event Properties Payload that is part of the Event Payload

  const whatExtraJson = helpers.reduceObject(omitedProperties)((accumulator, key) => {
    let value = remainingProperties[key];
    const valueType = helpers.getRealTypeOf(value); // This is a last level firewall to prevent non-intended values
    // to be added to our payload. It removes null, undefined, object and functions
    // from our payload. In general JSON.stringify already removes functions
    // But we want to ensure that things work as expected here

    if (notAllowedPropertyTypes.includes(valueType)) {
      return accumulator;
    } // Ensures that empty strings are not added to our payload
    // Included empty-padded strings or strings only with white spaces


    if (valueType === 'string' && value.trim() === '') {
      return accumulator;
    }

    if (helpers.isArray(value)) {
      // If the value is an Array we remove all the empty items from the Array
      // This time we don't remove empty strings as it could be an intended value
      value = value.filter(item => item !== null && item !== undefined);
    } // This will ensure that only non-empty values such as `non-empty strings`
    // Booleans, Numbers and Arrays actually get sent to the server


    accumulator[key] = value;
    return accumulator;
  });
  whatExtraJson.locale = lang;
  const payload = {
    hublytics_account_id: storageKeys.accountId,
    where_app: resolveNamespace(rest.eventKey, definition.namespace, namespace),
    where_screen: screen || 'unknown',
    where_subscreen: subscreen || '',
    when_timestamp: timestamp,
    device_id,
    session_id,
    event_id: last_event_id,
    sequence_number: last_sequence_number,
    language: lang,
    what_event: definition.name,
    what_event_class: definition.class.toUpperCase(),
    what_version: definition.version,
    what_extra_json: JSON.stringify(whatExtraJson),
    library_name: 'usage-tracker-js',
    library_version: 1
  }; // Note.: This manual conversion should not be done
  // to begin with as the property should be only `where_subscreen2`
  // Yet, this cover a historical edge scenario. Note that subscreen2 is not
  // a System Property, hence it should be defined in the Event Definition if used

  if (typeof properties.subscreen2 === 'string') {
    payload.where_subscreen2 = properties.subscreen2;
  } // These are optional fields that are allowed to be sent on the Event Payload
  // or set as global properties; These when sent should be treated as System Properties
  // These are also naturally removed from the `what_extra_json` Event Payload


  OPTIONAL_PAYLOAD_FIELDS.forEach(conditionalProperty => {
    const value = properties[conditionalProperty]; // These Optional fields should always be Strings, as their values
    // are necessarily meant to be strings, hence they should only be defined
    // if they are strings. If they are not strings, they should not be defined
    // Since this is mostly used for internal usage or very specific purposes,
    // we don't need to cover this scenario with a logger warning

    if (typeof value === 'string') {
      payload[conditionalProperty] = value;
    }
  });
  return payload;
};
export const createEventPayload = (definition, eventProperties, identifiers) => {
  const eventPayload = transformEventPayload(definition, eventProperties);

  if (identifiers) {
    // If identifiers are still not available we still create the payload for debugging purposes
    // But the application should not send this event in any circumstances as it is not identifiable
    return applyIdentifiers(eventPayload, identifiers);
  }

  return eventPayload;
};