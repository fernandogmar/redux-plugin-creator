import 'redux-plugin-creator/second.test.js';
import 'redux-plugin-creator/first.action.js';

// registers
const actions = {};
const plugins = {};
const reducers = {};
const reactions = {};
const selectors = {};

const namePlugin = (plugin_name) => {
    const PLUGIN_NAME = toSnakeCase(plugin_name).toUpperCase();// MY_PLUGIN

    return {
        nameRegisterIndex: name => `${PLUGIN_NAME}_${toSnakeCase(name)}`.toUpperCase(),// MY_PLUGIN_FETCH
        nameAction: name => toCamelCase(`${PLUGIN_NAME.toLowerCase()} ${name} Action`),// myPluginFetchAction
        PLUGIN_NAME
    };
};

const registerPlugin = (plugin_name) => {

    if(!plugin_name || !plugin_name) {
         throw new Error(`Input error ${plugin_name}. Please provide plugin name.`);
    }
    const { nameAction, nameRegisterIndex, PLUGIN_NAME } = namePlugin(plugin_name);

    if(plugins[PLUGIN_NAME]) {
        throw new Error(`Name conflict: ${PLUGIN_NAME} already exists. Please name plugin with an unique name.`);
    }

    plugins[PLUGIN_NAME] = {
        actions: {},
        reducers: {},
        reactions: {},
        selectors: {}
    };

    const registerAction = f => {

        if(!f || !f.name) {
          throw new Error(`Input error ${f}. Please call this method with a named function.`);
        }
        const ACTION_NAME = nameRegisterIndex(f.name);

        if(actions[ACTION_NAME]) {
           throw new Error(`Name conflict: ${ACTION_NAME} already exists. Please name actions with an unique name.`);
        }

        actions[ACTION_NAME] = (...args) => ({
            ...(f.apply(null, args)),
            type: ACTION_NAME
        });

        plugins[PLUGIN_NAME].actions[f.name] = actions[ACTION_NAME];

        return { ACTION_NAME, [nameAction(f.name)]: actions[ACTION_NAME]};
    }

    return { PLUGIN_NAME, registerAction };
};

export {
    registerPlugin,
    actions,
    plugins
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
