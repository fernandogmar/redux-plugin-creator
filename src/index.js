import 'redux-plugin-creator/second.test.js';
import 'redux-plugin-creator/first.action.js';

// registers
let actions = {};
let loggers = {};
let names = {};
let plugins = {};
let reducers = {};
let reactions = {};
let selectors = {};

const clearPlugins = () => {
    actions = {};
    loggers = {};
    names = {};
    plugins = {};
    reducers = {};
    reactions = {};
    selectors = {};
    configuration = {
        default_plugin_relationship: null,
        plugin_relationships: {}
    };
};
////////////////////////////////////////////////////////////


const REFERENCE_GROUP_COMMON = '__COMMON__';
const REFERENCE_ID_DEFAULT = '__DEFAULT__';

let configuration = {
    default_plugin_relationship: null,
    plugin_relationships: {}
};
const configureDefaultPluginRelationship = (relationship) => {
    configuration.default_plugin_relationship = relationship || ONE_GROUP_TO_ONE_PLUGIN;
}
const configurePlugin = (plugin_name, relationship) => {
    configuration.plugin_relationships[plugin_name] = relationship;
}

// to avid cyclick denpendy issue
const metaReferenceGroup = (reference_group, action) => action?.reference_group
    ? action
    : {
        ...action,
        reference_group
    };

const metaReferenceId = (reference_id, action) => action?.reference_id
    ? action
    : {
        ...action,
        reference_id
    };

const MANY_GROUPS_TO_MANY_PLUGINS= "MANY_GROUPS_TO_MANY_PLUGINS";
const MANY_GROUPS_TO_ONE_PLUGIN = "MANY_GROUPS_TO_ONE_PLUGIN";
const ONE_GROUP_TO_MANY_PLUGINS = "ONE_GROUP_TO_MANY_PLUGINS";
const ONE_GROUP_TO_ONE_PLUGIN = "ONE_GROUP_TO_ONE_PLUGIN";

const RELATIONSHIP_LIMITS = {
    MANY_GROUPS_TO_MANY_PLUGINS: Object.freeze({}),
    MANY_GROUPS_TO_ONE_PLUGIN: Object.freeze(metaReferenceId(REFERENCE_ID_DEFAULT)),
    ONE_GROUP_TO_MANY_PLUGINS: Object.freeze(metaReferenceGroup(REFERENCE_GROUP_COMMON)),
    ONE_GROUP_TO_ONE_PLUGIN: Object.freeze(metaReferenceGroup(REFERENCE_GROUP_COMMON, metaReferenceId(REFERENCE_ID_DEFAULT)))
};

const applyPluginRelationshipLimits = (plugin_name, action) => ({
    ...action,
    ...RELATIONSHIP_LIMITS[getPluginRelationship(plugin_name)]
});

const getPluginRelationship = (plugin_name) => (configuration.plugin_relationships[plugin_name] || configuration.default_plugin_relationship);


/////////////////////////////////////////////////////////
const addPluginName = (plugin_name, fn) => Object.defineProperty(fn, 'plugin_name', { value: plugin_name });
const nameFunction = (name, fn) => Object.defineProperty(fn, 'name', { value: name });
const namePlugin = (plugin_name) => {
    const PLUGIN_NAME = toSnakeCase(plugin_name).toUpperCase();// MY_PLUGIN

    return {
        nameRegisterIndex: name => `${PLUGIN_NAME}_${toSnakeCase(name)}`.toUpperCase(),// MY_PLUGIN_FETCH
        nameAction: name => toCamelCase(`${PLUGIN_NAME.toLowerCase()} ${name} Action`),// myPluginFetchAction
        nameReducer: name => toCamelCase(`${PLUGIN_NAME.toLowerCase()} ${name} Reducer`),// myPluginStateReducer
        nameSelector: name => toCamelCase(`${PLUGIN_NAME.toLowerCase()} ${name} Selector`),// myPluginStateSelector
        PLUGIN_NAME
    };
};

const _registerPlugin = (plugin_name) => {

    if(!plugin_name || !plugin_name) {
         throw new Error(`Input error ${plugin_name}. Please provide plugin name.`);
    }
    const { nameAction, nameReducer, nameSelector, nameRegisterIndex, PLUGIN_NAME } = namePlugin(plugin_name);

    if(plugins[PLUGIN_NAME]) {
        throw new Error(`Name conflict: ${PLUGIN_NAME} already exists. Please name plugin with an unique name.`);
    }

    plugins[PLUGIN_NAME] = {
        actions: {},
        loggers: {},
        reducers: {},
        reactions: {},
        selectors: {}
    };

    const registerAction = (f, is_meta) => {

        if(!f || !f.name) {
          throw new Error(`Input error ${f}. Please call this method with a named function.`);
        }
        const ACTION_NAME = nameRegisterIndex(f.name);

        if(actions[ACTION_NAME]) {
           throw new Error(`Name conflict: ${ACTION_NAME} already exists. Please name actions with an unique name.`);
        }

        const f_name = f.name;
        const action = addPluginName(PLUGIN_NAME, nameFunction(nameAction(f_name), is_meta
            ? f//we don't need the type and other meta info
            : (...args) => applyPluginRelationshipLimits(PLUGIN_NAME, {
                ...(f.apply(null, args)),
                type: ACTION_NAME
            })
        ));

        actions[ACTION_NAME] = action;
        names[action.name] = ACTION_NAME;
        plugins[PLUGIN_NAME].actions[f_name] = action;

        return { ACTION_NAME, [action.name]: action};
    };

    const registerMetaAction = f => registerAction(f, true);

    const registerReducer = f => {

        if(!f || !f.name) {
          throw new Error(`Input error ${f}. Please call this method with a named function.`);
        }
        const REDUCER_NAME = nameRegisterIndex(f.name);

        if(reducers[REDUCER_NAME]) {
           throw new Error(`Name conflict: ${REDUCER_NAME} already exists. Please name reducers with an unique name.`);
        }

        const f_name = f.name;
        const reducer = addPluginName(PLUGIN_NAME, nameFunction(nameReducer(f_name), f));

        reducers[REDUCER_NAME] = reducer;
        names[reducer.name] = REDUCER_NAME;
        plugins[PLUGIN_NAME].reducers[f_name] = reducer;

        return { REDUCER_NAME, [reducer.name]: reducer};
    }

    const registerSelector = f => {

        if(!f || !f.name) {
          throw new Error(`Input error ${f}. Please call this method with a named function.`);
        }
        const SELECTOR_NAME = nameRegisterIndex(f.name);

        if(selectors[SELECTOR_NAME]) {
           throw new Error(`Name conflict: ${SELECTOR_NAME} already exists. Please name selectors with an unique name.`);
        }

        const f_name = f.name;
        const selector = addPluginName(PLUGIN_NAME, nameFunction(nameSelector(f_name), f));
        selectors[SELECTOR_NAME] = selector;
        names[selector.name] = SELECTOR_NAME;
        plugins[PLUGIN_NAME].selectors[f_name] = selector;

        return { SELECTOR_NAME, [selector.name]: selector};
    }

    const registerReducerAsLogger = f => {

        if(!f || !f.name) {
          throw new Error(`Input error ${f}. Please call this method with a named function.`);
        }
        const REDUCER_NAME = nameRegisterIndex(f.name);

        if(loggers[REDUCER_NAME]) {
           throw new Error(`Name conflict: ${REDUCER_NAME} already exists as logger. Please name loggers with an unique name.`);
        }

        const f_name = f.name;
        const reducer = addPluginName(PLUGIN_NAME, nameFunction(nameReducer(f_name), f));

        loggers[REDUCER_NAME] = reducer;
        names[reducer.name] = REDUCER_NAME;
        plugins[PLUGIN_NAME].loggers[f_name] = reducer;

        return { REDUCER_NAME, [reducer.name]: reducer};
    }

    return { PLUGIN_NAME, registerAction, registerMetaAction, registerReducer, registerSelector, registerReducerAsLogger };
};

const registerPlugin = (plugin_name) => {
    const { registerReducerAsLogger: _registerReducerAsLogger, ...other_registers } = _registerPlugin(plugin_name);

    const registerReducerAsLogger = () => {
        throw new Error(`This plugin has NOT been registered as logger, please use 'registerPlugingLogger' to register your plugin.`)
    };

    return { registerReducerAsLogger, ...other_registers };
};


const registerPluginAsLogger = (plugin_name) => {
    const { registerReducer: _registerReducer, ...other_registers } = _registerPlugin(plugin_name);

    const registerReducer = () => {
        throw new Error(`This plugin has been registered as logger, please use 'registerReducerAsLogger' instead or register your plugin with 'registerPlugin'.`);
    };

    return { registerReducer, ...other_registers };
};

export {
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,

    applyPluginRelationshipLimits,
    configureDefaultPluginRelationship,
    configurePlugin,
    clearPlugins,
    getPluginRelationship,
    metaReferenceGroup,
    metaReferenceId,
    registerPlugin,
    registerPluginAsLogger,

    actions,
    configuration,
    loggers,
    names,
    plugins,
    reducers,
    selectors
};

// hepers
const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');

const toCamelCase = str =>
    str &&
    str
        .trim()
        .replace(/[A-Z]+/g, (letter, index) => index == 0 ? letter.toLowerCase() : '_' + letter.toLowerCase())
        .replace(/(.(\_|-|\s)+.)/g, (subStr) => subStr[0]+(subStr[subStr.length-1].toUpperCase()));
