'use es6';

let exported; // NO_I18N_GLOBAL will be provided by webpack
// eslint-disable-next-line no-undef

if (typeof NO_I18N_GLOBAL !== 'undefined' && NO_I18N_GLOBAL === true) {
  exported = {};
} else {
  exported = window.I18n = window.I18n || {};
}

export default exported;