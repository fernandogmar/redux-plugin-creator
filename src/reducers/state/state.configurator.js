import { REFERENCE_GROUP_COMMON, reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { REFERENCE_ID_DEFAULT, reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
import assocPath from 'ramda/src/assocPath';
import compose from 'ramda/src/compose';

// should it be moved to relationship.selector.js??
const MANY_GROUPS_TO_MANY_PLUGINS= "MANY_GROUPS_TO_MANY_PLUGINS";
const MANY_GROUPS_TO_ONE_PLUGIN = "MANY_GROUPS_TO_ONE_PLUGIN";
const ONE_GROUP_TO_MANY_PLUGINS = "ONE_GROUP_TO_MANY_PLUGINS";
const ONE_GROUP_TO_ONE_PLUGIN = "ONE_GROUP_TO_ONE_PLUGIN";

// should it be moved to state.reducer.js??
const RELATIONSHIP_LIMITS = {
    MANY_GROUPS_TO_MANY_PLUGINS: Object.freeze({}),
    MANY_GROUPS_TO_ONE_PLUGIN: Object.freeze(metaReferenceIdAction(REFERENCE_ID_DEFAULT)),
    ONE_GROUP_TO_MANY_PLUGINS: Object.freeze(metaReferenceGroupAction(REFERENCE_GROUP_COMMON)),
    ONE_GROUP_TO_ONE_PLUGIN: Object.freeze(metaReferenceGroupAction(REFERENCE_GROUP_COMMON, metaReferenceIdAction(REFERENCE_ID_DEFAULT)))
};

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
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    ONE_GROUP_TO_ONE_PLUGIN,
    RELATIONSHIP_LIMITS,
    configureDefaultPluginRelationship,
    configureNameMappers,
    configurePluginRelationship,
    Configurator as default
};
