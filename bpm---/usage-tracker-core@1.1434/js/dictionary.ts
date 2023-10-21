import * as helpers from './common/helpers';
import * as schemas from './schemas';
import * as schema from './common/schema';
import * as errors from './common/errors';

/*
 *  v1.5 of the bender-event-definition-loader package introduced
 *  the concept of "detailed properties" vs "shorthand properties".
 *
 *  For backwards compatibility, this code will adapt any shorthand properties
 *  supported by pre v1.5 loader versions to the detailed property format.
 *  The detailed property format includes additional info such as "isOptional".
 */
const hydrateProperties = definitions => {
  return helpers.mapObject(definitions, eventKey => {
    const definition = definitions[eventKey];
    definition.properties = helpers.mapObject(definition.properties, (_key, value) => {
      const isShorthandProperty = typeof value === 'string' || helpers.isArray(value);

      if (isShorthandProperty) {
        return {
          type: value,
          isOptional: false
        };
      }

      return value;
    });
    definition.properties = schemas.eventPropertySchema.normalizeEach(definition.properties);
    return definition;
  });
};

export const createDictionaryStorage = dictionary => {
  const lockedDictionary = Object.freeze(dictionary);

  const getDefinition = eventKey => {
    const definition = lockedDictionary[eventKey];

    if (!definition || typeof definition !== 'object') {
      throw errors.eventError(`Invalid event key. The event definition for "${eventKey}" is undefined. Check your events.yaml dictionary.`);
    }

    return definition;
  };
  /*
   *  Schemas provide free validation since
   *  an object can be validated against them.
   *
   *  This function takes an event definition,
   *  and generates a schema for it's properties.
   *
   *  EX:
   *
   *    definition = {
   *      name: 'page view',
   *      class: 'view',
   *      properties: {
   *        screen: { type: 'oneOf(["foo", "bar"])', isOptional: false },
   *        subscreen: { type: 'string', isOptional: false }
   *      }
   *    }
   *
   *    schema = {
   *      screen: {
   *        types: ['string'],
   *        oneOf: ['foo', 'bar']
   *      },
   *      subscreen: {
   *        types: ['string']
   *      }
   *    }
   */


  const createPropertySchema = (eventKey, properties = {}) => {
    const _defProps = getDefinition(eventKey).properties || {};

    const _extraProps = properties || {};

    const weakPropertyTypes = [...schemas.eventPropertyTypes, 'null'];
    const definitionProperties = helpers.mapObject(_defProps, key => {
      const {
        type,
        isOptional
      } = _defProps[key];

      if (isOptional) {
        return {
          types: weakPropertyTypes,
          isOptional: true
        };
      }

      if (typeof type === 'string') {
        if (schemas.eventPropertyTypes.includes(type)) {
          return {
            types: [type],
            isOptional: false
          };
        }

        if (type.includes('oneOf')) {
          const oneOfArray = helpers.between(type, '[', ']').split(',').map(option => helpers.trim(helpers.trim(option, '"'), "'"));
          return {
            oneOf: oneOfArray,
            isOptional: false
          };
        }
      }

      return {
        oneOf: type,
        isOptional
      };
    }); // Maps all the Extra (aka Unknown) Properties into the a Schema

    const extraProperties = helpers.mapObject(_extraProps, () => ({
      // Optional (aka Unknwon) Properties are allowed to be `nullable`
      // As they will automatically get discarded within `event.transformEventPayload`
      // If the value is `undefined` the `isOptional` marker will ignore the validation
      // and the value will also automatically be removed on `transformEventPayload`
      types: weakPropertyTypes,
      isOptional: true
    })); // Merges both schemas, by adding the schema from definition first
    // And the missing properties from the definition schema from the extra schema
    // resulting in a schema that validates all properties

    const mergedProperties = helpers.defaults(definitionProperties, extraProperties);
    return schema.create('event property', errors.eventError, mergedProperties, false);
  };

  return {
    getDefinition,
    createPropertySchema,
    getAll: () => lockedDictionary
  };
};
export const createDictionary = (dictionary, caller) => {
  const parsedDefinitions = schemas.eventDefinitionSchema.normalizeEach(dictionary);
  schemas.eventDefinitionSchema.validateEach(parsedDefinitions, caller);
  return hydrateProperties(parsedDefinitions);
};