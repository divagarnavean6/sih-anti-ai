/* hs-eslint ignored failing-rules */
/* eslint-disable vars-on-top */
/* eslint-disable one-var */

/*eslint-env node, browser */

var globalRoot;

if (typeof window !== 'undefined' && window !== null) {
  globalRoot = window;
} else if (typeof global !== 'undefined' && global !== null) {
  globalRoot = global;
} else {
  globalRoot = this;
}

// Assigns the object passed in to the global identifier hs.namespace.namespace.object.
// If the namespace and/or object already exist, it will extend, preserving existing
// data.
//
//   ns - namespace (expects dot-separated list -- something like 'hubspot.analytics.campaigns')
//   ext - (optional, can be hash or function)-- each property will be copied into namespace
//
// Usage:
//   hns('hs.namespace.namespace.object', {
//     name: 'value'
//   });
//
// Note, this does not recursively copy the original object, so that there aren't problems
// accessing attributes that are set at runtime.
var hns = (globalRoot.hns = globalRoot.hns2 = function (namespace, obj) {
  var parts = namespace.split('.'),
    parent = globalRoot,
    name = '',
    var_name,
    last_index = parts.length - 1,
    existing,
    queue,
    front;

  obj = obj || {};
  var_name = parts[last_index];

  // Create any non-existant objects in the namespace path
  for (var x = 0; x < last_index; x++) {
    name = parts[x];
    parent[name] = parent[name] || {};
    parent = parent[name];
  }

  // Start merge if the namespace already existed
  if (parent[var_name] && obj !== parent[var_name]) {
    existing = parent[var_name];
    queue = [];

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // If we are merging an object, keep track of each level in a
        // queue and ensure we merge from the "outside in" to prevent clobbering
        if (typeof existing[prop] === 'object') {
          if (obj[prop] !== existing[prop]) {
            queue.push({ qSource: obj[prop], qTarget: existing[prop] });
          }

          while (queue.length > 0) {
            front = queue.shift();

            for (var fprop in front.qSource) {
              if (front.qSource.hasOwnProperty(fprop)) {
                // Skip HTML entity attributes as the browser doesn't like it when we try to copy them
                if (
                  typeof front.qSource[fprop] === 'object' &&
                  typeof front.qTarget[fprop] === 'object' &&
                  (!front.qSource[fprop] ||
                    front.qSource[fprop].classList === void 0 ||
                    front.qSource[fprop].nodeType === void 0)
                ) {
                  if (front.qSource[fprop] !== front.qTarget[fprop]) {
                    queue.push({
                      qSource: front.qSource[fprop],
                      qTarget: front.qTarget[fprop],
                    });
                  }
                } else {
                  front.qTarget[fprop] = front.qSource[fprop];
                }
              }
            }
          }
        } else {
          existing[prop] = obj[prop];
        }
      }
    }

    // Otherwise, simply assign to the new namespace
  } else {
    parent[var_name] = obj;
  }

  // define any other modules that depended on this module
  if (typeof hubspot !== 'undefined' && hubspot.updateDependencies) {
    hubspot.updateDependencies(namespace);
  }

  return parent[var_name];
});

// setup our top level namespace
hns('hubspot');


/* hs-eslint ignored failing-rules */
/* eslint-disable vars-on-top */
/* eslint-disable one-var */
/* eslint-disable no-unused-vars */

// Module / dependency management
(function () {
  if (typeof hubspot !== 'undefined' && hubspot !== null && hubspot.define) {
    console.warn(
      "hubspot.define included more than once, you most certainly _don't_ want this"
    );
  }

  hubspot = hubspot || {};
  hubspot.modules = hubspot.modules || {};

  // a list of moduleDefs that have been required but whose dependencies are not yet satisfied
  var deferredModules = [];

  // a namespace-moduleDef mapping for modules that are defined but not yet required
  var idleModulesDict = {};

  // a namespace-module mapping for modules that have already been executed
  var loadedModules = {};

  // a namespace-truthy mapping for modules that failed while being defined
  var erroredModules = {};

  // a namespace-moduleDef mapping for all modules defined or required
  var allModuleDefinitions = {};

  var PLACEHOLDER_NS = '<hubspot.require>',
    placholderCounter = 1;

  hubspot.modules.useGlobals = function useGlobals(ns) {
    return true;
  };

  // returns the module for the given namespace (or undefined if it or any parent namespace is not defined)
  hubspot.modules.getNamespace = function (ns) {
    if (loadedModules[ns]) {
      return loadedModules[ns];
    }

    if (!hubspot.modules.useGlobals(ns)) {
      return null;
    }
    var i,
      names = ns.split('.'),
      len = names.length,
      obj = window;

    for (i = 0; i < len; ++i) {
      obj = obj[names[i]];
      if (!obj) break;
    }

    return obj;
  };

  hubspot.getDeferredModules = function () {
    return deferredModules;
  };

  hubspot.getIdleModules = function () {
    return idleModulesDict;
  };

  hubspot.getLoadedModules = function () {
    return loadedModules;
  };

  hubspot.getErroredModules = function () {
    return erroredModules;
  };

  hubspot.getAllModuleDefinitions = function () {
    return allModuleDefinitions;
  };

  var nextPlaceholderName = function () {
    return PLACEHOLDER_NS.replace('>', ' ' + placholderCounter++ + '>');
  };

  hubspot.getBlockingModules = function () {
    // Gets a list of those modules depended on by others, but not defined anywhere.
    var modules = deferredModules,
      out = [],
      depSet = {},
      dep,
      modSet = {};

    for (var j = modules.length; j--; ) {
      var module = modules[j];
      if (!module || !module.deps) continue;

      modSet[module.ns] = true;
      for (var i = module.deps.length; i--; ) {
        depSet[module.deps[i]] = true;
      }
    }

    for (dep in depSet) {
      if (!modSet[dep]) out.push(dep);
    }

    return out;
  };

  function debug_define_enabled() {
    var rval;
    if (typeof hubspot._cached_debug_define_enabled !== 'undefined') {
      return hubspot._cached_debug_define_enabled;
    }

    if (window.HUBSPOT_DEBUG_DEFINE === true) {
      rval = true;
    } else {
      // See if localStorage works before using it
      var test = 'test';
      try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        rval = localStorage.HUBSPOT_DEBUG_DEFINE === 'true';
      } catch (e) {
        rval = false;
      }
    }

    hubspot._cached_debug_define_enabled = rval;
    return rval;
  }

  // from defineModule, execute a module's factory function and return its result
  function runModule(moduleDef) {
    var i,
      result,
      args = [],
      allDeps = moduleDef.allDeps;

    // pass a reference to each of the module's dependencies as an argument
    for (i = 0; i < allDeps.length; i++) {
      args[i] = hubspot.modules.getNamespace(allDeps[i]);
    }

    try {
      result =
        typeof moduleDef.module === 'function'
          ? moduleDef.module.apply(this, args)
          : moduleDef.module;
    } catch (e) {
      var failedNs = moduleDef.ns || PLACEHOLDER_NS;
      erroredModules[failedNs] = true;

      if (debug_define_enabled()) {
        throw e;
      } else {
        // prevent the error from interrupting whoever called defineModule
        setTimeout(function () {
          if (failedNs.length > 0) {
            console.log('Error while defining hubspot module:', failedNs);
          }
          throw e;
        }, 0);
      }
      // leave the module that threw the error undefined
      return undefined;
    }

    return result;
  }

  // creates a module whose dependencies have been satisfied
  function defineModule(moduleDef) {
    var i, result;

    result = runModule(moduleDef);

    // Don't assign the result of hubspot.require to globals
    if (moduleDef.ns) {
      loadedModules[moduleDef.ns] = result;
      if (hubspot.modules.useGlobals(moduleDef.ns)) {
        window.hns2(moduleDef.ns, result);
      } else {
        hubspot.updateDependencies(moduleDef.ns);
      }
    }
  }

  // update dependencies for any module that depended on a namespace that was just defined
  hubspot.updateDependencies = function (ns) {
    var moduleDef, deps;
    var i,
      j,
      modulesToDefine = [];
    // check if creating this module just satisfied another module's dependency
    for (i = 0; i < deferredModules.length; i++) {
      moduleDef = deferredModules[i];

      if (moduleDef.depsDict[ns]) {
        // remove just-defined module from the dependencies array & dict
        delete moduleDef.depsDict[ns];
        deps = moduleDef.deps;
        for (j = 0; j < deps.length; j++) {
          if (deps[j] === ns) {
            deps.splice(j, 1);
            break;
          }
        }
        // if another deferred module's last dependency was satisfied, fulfill it
        if (deps.length === 0) {
          deferredModules.splice(i, 1);
          modulesToDefine.push(moduleDef);
          i--;
        }
      }
    }

    for (i = 0; i < modulesToDefine.length; i++) {
      defineModule(modulesToDefine[i]);
    }
  };

  // determine whether the given module is a requirement of a deferred module
  function isModuleRequired(ns) {
    var i, moduleDef;
    for (i = 0; i < deferredModules.length; i++) {
      moduleDef = deferredModules[i];

      if (moduleDef.depsDict[ns]) {
        return true;
      }
    }
    return false;
  }

  // add a module to deferredModules, remove any already-met deps from its list
  function addDeferredModule(ns, moduleDef) {
    var deps = moduleDef.deps,
      depsDict = moduleDef.depsDict,
      i = deps.length,
      j,
      idleDepsToPromote = [],
      idleModule,
      dep;

    while (i--) {
      dep = deps[i];
      // dependency already satisfied, remove it
      if (hubspot.modules.getNamespace(dep)) {
        deps.splice(i, 1);
        delete depsDict[dep];
      }

      // dependency was considered idle, promote it
      if (idleModulesDict[dep]) {
        idleDepsToPromote.push(dep);
      }
    }

    if (deps.length > 0) {
      deferredModules.push(moduleDef);
    } else {
      defineModule(moduleDef);
    }

    // to avoid timing issues, promote idle modules after this module's deps are updated
    for (i = 0; i < idleDepsToPromote.length; i++) {
      dep = idleDepsToPromote[i];
      idleModule = idleModulesDict[dep];
      if (!idleModule) {
        continue;
      }
      delete idleModulesDict[dep];
      addDeferredModule(dep, idleModule);
    }
  }

  function extractCallSite(callSite) {
    return {
      fileName: callSite.getFileName(),
      lineNumber: callSite.getLineNumber(),
      columnNumber: callSite.getColumnNumber(),
      functionName: callSite.getFunctionName(),
    };
  }

  function getStackTrace() {
    // Get the standard stack if the Error.captureStackTrace API isn't around (non-Chrome)
    if (!Error.captureStackTrace) {
      return new Error().stack;
    }

    // Otherwise, get better stack info, more info in:
    // https://code.google.com/p/v8-wiki/wiki/JavaScriptStackTraceApi
    // http://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js
    var orig = Error.prepareStackTrace;
    // probably not set
    try {
      Error.prepareStackTrace = function (_, stack) {
        return stack;
      };
      var err = new Error();
      Error.captureStackTrace(err);
      var stack = err.stack;
      var fileName = stack[0].getFileName();
      var result = stack
        .slice(2)
        .map(extractCallSite)
        .filter(function (c) {
          return (
            !c.functionName ||
            (c.functionName.indexOf('hubspot.define') !== 0 &&
              c.functionName.indexOf('hubspot.require') !== 0)
          );
        });

      return result.length > 0 ? result : null;
    } catch (e) {
      return null;
    } finally {
      Error.prepareStackTrace = orig;
    }
  }

  // defines an AMD module in the given namespace
  //  ns - string namespace to define module in
  //  deps - array of namespaces this module depends on
  //  module - module or function to create a module
  //  isEagerDefinition - whether the module factory should automatically be called
  //                      or only be called when someone depends in it
  hubspot.defineHelper = function (ns, deps, module, isEagerDefinition) {
    var depsDict = {},
      moduleDef,
      dep,
      stack;

    // Keep track of stack traces in debug mode so tooling can map module names
    // to where it is defined in a file
    if (debug_define_enabled()) {
      stack = getStackTrace();
    }

    if (typeof deps === 'string') {
      throw new Error(
        'hubspot.define/require must be provided an array of dependencies, not a string'
      );
    }

    if (typeof isEagerDefinition !== 'boolean') {
      throw new Error(
        'hubspot.defineHelper must be called with the isEagerDefinition flag'
      );
    }

    if (loadedModules[ns] !== undefined) {
      if (typeof module === 'function') {
        console.warn(
          "You should not redefine a module with hubspot.define, '" +
            ns +
            "' has already been defined once."
        );
      } else {
        throw new Error(
          "You cannot redefine a module with hubspot.define, '" +
            ns +
            "' has already been defined once."
        );
      }
    }

    for (var i = 0; i < deps.length; i++) {
      dep = deps[i];
      depsDict[dep] = dep;
    }

    moduleDef = {
      ns: ns, // module namespace
      allDeps: deps.slice(), // all module dependencies
      deps: deps, // currently unsatisfied dependencies (to be mutated during definition)
      depsDict: depsDict, // dictionary of dependencies (to be mutated during definition)
      module: module, // module or module creation callback
      stack: stack,
    };

    // Keep track of all module definitions for debugging
    allModuleDefinitions[ns || nextPlaceholderName()] = moduleDef;

    if (ns == null || isEagerDefinition || isModuleRequired(ns)) {
      addDeferredModule(ns, moduleDef);
    } else {
      idleModulesDict[ns] = moduleDef;
    }
  };

  hubspot.defineEager = function (ns, deps, module) {
    hubspot.defineHelper(ns, deps, module, true);
  };

  hubspot.defineLazy = function (ns, deps, module) {
    hubspot.defineHelper(ns, deps, module, false);
  };

  // By default, make hubspot.define backwards compatible and define code "eagerly"
  hubspot.define = hubspot.defineEager;

  // executes a callback when all dependencies have been loaded
  //  deps - dependencies
  //  onLoaded - callback that will be passed its dependencies as arguments
  hubspot.require = function (deps, onLoaded) {
    hubspot.defineEager(null, deps, onLoaded);
  };

  hubspot.requireSync = function (moduleId) {
    var mod;

    hubspot.require([moduleId], function (result) {
      mod = result;
    });

    if (!mod) {
      throw new Error(
        moduleId + ' has not been defined with hubspot.define or is blocked'
      );
    }

    return mod;
  };
})();

(function () {
  var unhandledReasons = [];
  var unhandledRejections = [];

  // See: https://html.spec.whatwg.org/multipage/webappapis.html#the-hostpromiserejectiontracker-implementation
  window.addEventListener('unhandledrejection', function (e) {
    unhandledRejections.push(e.promise);
    unhandledReasons.push(e.reason);
  });

  window.addEventListener('rejectionhandled', function (e) {
    var promise = e.promise;
    var at = unhandledRejections.indexOf(promise);
    if (at !== -1) {
      unhandledRejections.splice(at, 1);
      unhandledReasons.splice(at, 1);
    }
  });

  hubspot.getUnhandledReasons = function () {
    return unhandledReasons.slice();
  };
})();


// Change the default hubspot.define bahavior to be lazy by default
hubspot.define = hubspot.defineLazy;










