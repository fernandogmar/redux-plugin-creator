import { registerSelector } from 'redux-plugin-creator/register.js';
import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';

const relationship = (plugin_name) => (redux_plugin_creator_state) => {
    const default_relationship = path(['configuration', 'default_relationship'], redux_plugin_creator_state);
    return pathOr(default_relationship, ['configuration', 'relationships', plugin_name], redux_plugin_creator_state);
}
const { SELECTOR_NAME, reduxPluginCreatorRelationshipSelector } = registerSelector(relationship);

export {
    reduxPluginCreatorRelationshipSelector,
    SELECTOR_NAME as default
};
