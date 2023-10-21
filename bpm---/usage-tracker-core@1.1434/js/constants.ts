// These are Event Properties that are sensitive
// And should be stripped from the Event Payload all together
export const SENSITIVE_PROPERTIES = ['email', 'userId', 'hubId', 'hstc', 'utk', 'deviceId', 'device_id']; // Optional Fields on the Event Payload
// That are allowed to come from the Event Definition Properties
// And will be stamped directly on the Event Payload

export const OPTIONAL_PAYLOAD_FIELDS = ['what_event_subtype', 'what_value', 'what_value_str', 'where_subscreen2']; // These are all Properties that are allowed to be sent within `properties`
// Regardless of their respective Event Definition
// Note.: These Properties are always set by the user, they're not generated neither Internally defined

export const ALWAYS_ALLOWED_PROPERTIES = ['userId', 'hubId', 'hstc', 'utk', 'email', 'lang', 'deviceId', // This is different from the `device_id` meta
'namespace', // We also add the Optional Payload Fields as technically they're System Properties
// and not "user/event" properties and should always be allowed
...OPTIONAL_PAYLOAD_FIELDS];