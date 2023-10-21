"use strict";
'use es6'; // If you update this file, remember to make the same changes to hubspot-dlb/hubspot-profiling-dlb/static/js/index.js

require("classnames");

require("hoist-non-react-statics");

require("hub-http");

require("hub-http/userInfo");

require("hubspot-url-utils");

require("immutable");

require("metrics-js");

require("prop-types");

require("react-addons-shallow-compare");

require("react-dom");

require("react-is");

require("react-redux");

require("react");

require("scheduler");

require("redux");

require("styled-components");

if (process.env.NODE_ENV === 'production') {
  require('react/jsx-runtime');
} else {
  require('react/jsx-dev-runtime');
}

function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('hub-http/js/clients', true, /\.js$/));