import { registerSelector } from 'redux-plugin-creator/register.js';
import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';

// TODO define redux_component action, reducer, selector, reaction, or its name or the plugin_name
const relationship = (redux_component) => (redux_plugin_creator_state) => {
    const default_plugin_relationship = path(['configuration', 'default_plugin_relationship'], redux_plugin_creator_state);
    const plugin_names = pathOr({}, ['configuration', 'plugin_names'], redux_plugin_creator_state);

    const plugin_name = (typeof redux_component === 'string')
        ? plugin_names[redux_component] || redux_component
        : redux_component.plugin_name || plugin_names[redux_component.type];

    return pathOr(default_plugin_relationship, ['configuration', 'plugin_relationships', plugin_name], redux_plugin_creator_state);
}
const { SELECTOR_NAME, reduxPluginCreatorRelationshipSelector } = registerSelector(relationship);

export {
    reduxPluginCreatorRelationshipSelector,
    SELECTOR_NAME as default
};
