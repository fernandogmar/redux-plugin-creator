import 'redux-plugin-creator/second.test.js';
import 'redux-plugin-creator/first.action.js';

// registers
let actions = {};
let names = {};
let plugins = {};
let reducers = {};
let reactions = {};
let selectors = {};

const clearPlugins = () => {
    actions = {};
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

const MANY_GROUPS_TO_MANY_PLUGINS= "MANY_GROUPS_TO_MANY_PLUGINS";
const MANY_GROUPS_TO_ONE_PLUGIN = "MANY_GROUPS_TO_ONE_PLUGIN";
const ONE_GROUP_TO_MANY_PLUGINS = "ONE_GROUP_TO_MANY_PLUGINS";
const ONE_GROUP_TO_ONE_PLUGIN = "ONE_GROUP_TO_ONE_PLUGIN";
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

const applyPluginRelationshipLimits = (plugin_name, action) => {
    const { default_plugin_relationship, plugin_relationships } = configuration;
    const plugin_relationship = plugin_relationships[plugin_name] || default_plugin_relationship;

    if ([ONE_GROUP_TO_MANY_PLUGINS, ONE_GROUP_TO_ONE_PLUGIN].includes(plugin_relationship))
        action = metaReferenceGroup(REFERENCE_GROUP_COMMON, action);

    if ([MANY_GROUPS_TO_ONE_PLUGIN, ONE_GROUP_TO_ONE_PLUGIN].includes(plugin_relationship))
        action = metaReferenceId(REFERENCE_ID_DEFAULT, action);

    return action;
}


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

const registerPlugin = (plugin_name) => {

    if(!plugin_name || !plugin_name) {
         throw new Error(`Input error ${plugin_name}. Please provide plugin name.`);
    }
    const { nameAction, nameReducer, nameSelector, nameRegisterIndex, PLUGIN_NAME } = namePlugin(plugin_name);

    if(plugins[PLUGIN_NAME]) {
        throw new Error(`Name conflict: ${PLUGIN_NAME} already exists. Please name plugin with an unique name.`);
    }

    plugins[PLUGIN_NAME] = {
        actions: {},
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

        if(selectors[REDUCER_NAME]) {
           throw new Error(`Name conflict: ${REDUCER_NAME} already exists. Please name selectors with an unique name.`);
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

    return { PLUGIN_NAME, registerAction, registerMetaAction, registerReducer, registerSelector };
};

export {
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,

    configureDefaultPluginRelationship,
    configurePlugin,
    clearPlugins,
    metaReferenceGroup,
    metaReferenceId,
    registerPlugin,

    actions,
    configuration,
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
