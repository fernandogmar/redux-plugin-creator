import { registerSelector } from 'redux-plugin-creator/register.js';
import pathOr from 'ramda/src/pathOr';

// TODO define redux_component action, reducer, selector, reaction, or its name or the plugin_name
const pluginName = (redux_component) => (redux_plugin_creator_state) => {
    const plugin_names = pathOr({}, ['configuration', 'plugin_names'], redux_plugin_creator_state);

    const plugin_name = (typeof redux_component === 'string')
        ? plugin_names[redux_component] || redux_component
        : redux_component && (redux_component.plugin_name || plugin_names[redux_component.type]);

    return plugin_name;
}
const { SELECTOR_NAME, reduxPluginCreatorPluginNameSelector } = registerSelector(pluginName);

export {
    reduxPluginCreatorPluginNameSelector,
    SELECTOR_NAME as default
};
