// actions
import { reduxPluginCreatorMetaCarbonCopyAction as metaCarbonCopyAction } from 'redux-plugin-creator/meta-carbon-copy.action.js';
import { reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
// reducers
import { slicesReducer } from './_slices.reducer.js';
// selectors
import { reduxPluginCreatorPluginNameSelector } from 'redux-plugin-creator/plugin-name.selector.js';
import { reduxPluginCreatorReferenceGroupsSelector } from 'redux-plugin-creator/reference-groups.selector.js';
import { reduxPluginCreatorReferenceIdsSelector } from 'redux-plugin-creator/reference-ids.selector.js';
// utilities
import {
    names,
    plugins,
    reducers,
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,
} from 'redux-plugin-creator';
import { getReducersByRelationshipForState } from './_helpers.js';
import fromPairs from 'ramda/src/fromPairs';
import prop from 'ramda/src/prop';
import uniq from 'ramda/src/uniq';
import values from 'ramda/src/values';

const _stateSlicesReducer = (redux_plugin_creator_state, action) => expandAction(action, redux_plugin_creator_state)
    .reduce(
        slicesReducer(reducersSelector(reducers, redux_plugin_creator_state)),
        redux_plugin_creator_state
    );

// helpers
const expandAction = (action, redux_plugin_creator_state) => {
    const actions_expanded_per_group = (![action.reference_group, action.carbon_copy_required].includes(REFERENCE_GROUP_COMMON))
        ? [ action ]
        : [
            action,
            ...reduxPluginCreatorReferenceGroupsSelector(redux_plugin_creator_state)
                .filter((reference_group) => (reference_group !== action.reference_group))
                .map(reference_group => ({
                    // we need to overwrite the reference group to get the right slice per reducer, since a common action is passed to all groups
                    ...metaCarbonCopyAction(action),
                    ...metaReferenceGroupAction(reference_group)
                }))
        ];

    const actions_expanded_per_id = actions_expanded_per_group.filter(prop('carbon_copy_required'))
            .map( action => uniq(
                    getPluginReducers([reduxPluginCreatorPluginNameSelector(action)((redux_plugin_creator_state))])
                        .map(reducer => reduxPluginCreatorReferenceIdsSelector(names[reducer.name], action)(redux_plugin_creator_state))
                        .flat(1)
                        .filter(reference_id => ![REFERENCE_ID_DEFAULT, action.reference_id].includes(reference_id) )
                )
                .map(reference_id => ({
                    ...metaCarbonCopyAction(action),
                    ...metaReferenceIdAction(reference_id)
                }))
            ).flat(1);

    return actions_expanded_per_group.concat(actions_expanded_per_id);
}

const getPluginReducers = (plugin_names) => plugin_names
    .filter(plugin_name => plugin_name)// don't use undefined or null names
    .map(
        (plugin_name) => plugins[plugin_name].reducers
    )
    .map(values)
    .flat(1);

const reducersSelector = (reducers, redux_plugin_creator_state) => {
    const getReducersByRelationship = getReducersByRelationshipForState(redux_plugin_creator_state);

    const relationships = [
        MANY_GROUPS_TO_MANY_PLUGINS,
        MANY_GROUPS_TO_ONE_PLUGIN,
        ONE_GROUP_TO_ONE_PLUGIN,
        ONE_GROUP_TO_MANY_PLUGINS
    ];
    const reducers_by_relationship = fromPairs(relationships.map(relationship => [relationship, getReducersByRelationship(relationship)]));

    return (action) => {
        if(action.reference_id === REFERENCE_ID_DEFAULT) {
            if(action.reference_group === REFERENCE_GROUP_COMMON) {
                return [
                    ...reducers_by_relationship[ONE_GROUP_TO_ONE_PLUGIN],
                    ...reducers_by_relationship[ONE_GROUP_TO_MANY_PLUGINS]
                ];
            } else {
                return [
                    ...reducers_by_relationship[MANY_GROUPS_TO_ONE_PLUGIN],
                    ...reducers_by_relationship[MANY_GROUPS_TO_MANY_PLUGINS]
                ];
            }
        } else {
            if(action.reference_group === REFERENCE_GROUP_COMMON) {
                return reducers_by_relationship[ONE_GROUP_TO_MANY_PLUGINS];
            } else {
                return reducers_by_relationship[MANY_GROUPS_TO_MANY_PLUGINS];
            }
        }
    };
};

export {
    _stateSlicesReducer
};
