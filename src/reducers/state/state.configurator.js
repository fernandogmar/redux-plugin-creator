import REDUX_PLUGIN_CREATOR from 'redux-plugin-creator/register.js';
import assocPath from 'ramda/src/assocPath';
import compose from 'ramda/src/compose';

const Configurator = (state) => ({
    map: (f) => Configurator(f(state)),
    get: () => state
});

// This should work with initial_state from state.reducer.js
const configureDefaultPluginRelationship = (relationship) => assocPath(['configuration', 'default_plugin_relationship'], relationship);
const configurePluginRelationship = (plugin_name, relationship) => assocPath(['configuration', 'plugin_relationships',  plugin_name], relationship);
const configureNameMappers = (logger_names, plugin_names) => compose(
     assocPath(['configuration', 'logger_names'], logger_names),
     assocPath(['configuration', 'plugin_names'], plugin_names)
);

export {
    configureDefaultPluginRelationship,
    configureNameMappers,
    configurePluginRelationship,
    Configurator as default
};
