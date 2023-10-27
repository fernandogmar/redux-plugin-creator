// actions
import { reduxPluginCreatorMetaCarbonCopyAction as metaCarbonCopyAction } from 'redux-plugin-creator/meta-carbon-copy.action.js';
import { reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
// selectors
import { reduxPluginCreatorReferenceGroupsSelector } from 'redux-plugin-creator/reference-groups.selector.js';
import { reduxPluginCreatorReferenceIdsSelector } from 'redux-plugin-creator/reference-ids.selector.js';
import { reduxPluginCreatorSliceSelector, toPath } from 'redux-plugin-creator/slice.selector.js';
// utilities
import { registerReducer } from 'redux-plugin-creator/register.js';// this would create a cyclic layout if plugin relationship not configured properly, infinite loop
import {
    actions as action_register,
    configuration,
    names,
    plugins,
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,

    getPluginRelationship
} from 'redux-plugin-creator';
import assocPath from 'ramda/src/assocPath';
import dissocPath from 'ramda/src/dissocPath';
import keys from 'ramda/src/keys';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import uniq from 'ramda/src/uniq';
import values from 'ramda/src/values';

const INITIAL_STATE = Object.freeze({
    /*configuration: {
        relationships: {},
        default_relationship: ONE_GROUP_TO_ONE_PLUGIN
    },*/
    slices: {}
});

const state = (redux_plugin_creator_state = INITIAL_STATE, action) => {

    // setting the default reference_group and reference_id, if they were not previously setted (remember references can not overwritten)
    action = metaReferenceGroupAction(REFERENCE_GROUP_COMMON, metaReferenceIdAction(REFERENCE_ID_DEFAULT, action))
    let one_group_reducers = [];
    let many_groups_reducers = [];

    if(action.reference_id === REFERENCE_ID_DEFAULT) {
        many_groups_reducers = getPluginReducers([
            ...getPluginsByRelationship(MANY_GROUPS_TO_ONE_PLUGIN),
            ...getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
        ]);
        if(action.reference_group === REFERENCE_GROUP_COMMON) {
            one_group_reducers = getPluginReducers([
                ...getPluginsByRelationship(ONE_GROUP_TO_ONE_PLUGIN),
                ...getPluginsByRelationship(ONE_GROUP_TO_MANY_PLUGINS)
            ]);
        }
    } else {
        many_groups_reducers = getPluginReducers(
            getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
        );
        if(action.reference_group === REFERENCE_GROUP_COMMON) {
            one_group_reducers = getPluginReducers(
                getPluginsByRelationship(ONE_GROUP_TO_MANY_PLUGINS)
            );
        }
    }

    const actions_carbon_original = (![action.reference_group, action.carbon_copy_required].includes(REFERENCE_GROUP_COMMON))
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

    const actions_carbon_copy = actions_carbon_original.filter(prop('carbon_copy_required'))
            .map( action => uniq(
                    getPluginReducers([actionPluginName(action)])
                        .map(reducer => reduxPluginCreatorReferenceIdsSelector(names[reducer.name], action)(redux_plugin_creator_state))
                        .flat(1)
                        .filter(reference_id => ![REFERENCE_ID_DEFAULT, action.reference_id].includes(reference_id) )
                )
                .map(reference_id => ({
                    ...metaCarbonCopyAction(action),
                    ...metaReferenceIdAction(reference_id)
                }))
            ).flat(1);

    const actions = actions_carbon_original.concat(actions_carbon_copy);

    return actions.reduce(
        slicesState(one_group_reducers, many_groups_reducers),
        redux_plugin_creator_state
    );
}

const slicesState = (one_group_reducers, many_groups_reducers) => (redux_plugin_creator_state, action) =>
    ((action.reference_group === REFERENCE_GROUP_COMMON) ? one_group_reducers : many_groups_reducers)
    .map(
        (reducer) => getSliceChange({ reducer_name: names[reducer.name], reducer, redux_plugin_creator_state, action })
    )
    .filter(
        ({ new_slice_state, previous_slice_state }) => (new_slice_state !== previous_slice_state)
    )
    .reduce(
        (slices, slice_change) => (slice_change.new_slice_state === slice_change.initial_state)
            ? dissocPath(slice_change.slice_path, slices)// we are not saving on store the initial state
            : assocPath(slice_change.slice_path, slice_change.new_slice_state, slices),
        redux_plugin_creator_state
    );

// helpers
const actionPluginName = action => path([action.type, 'plugin_name'], action_register);

const getPluginsByRelationship = (relationship) => keys(plugins)
    .filter((plugin_name) => (getPluginRelationship(plugin_name) === relationship));

const getPluginReducers = (plugin_names) => plugin_names
    .map(
        (plugin_name) => plugins[plugin_name].reducers
    )
    .map(values)
    .flat(1);

const getSliceChange = ({ reducer_name, reducer, redux_plugin_creator_state, action }) => {
    const previous_slice_state = reduxPluginCreatorSliceSelector(reducer_name, action)(redux_plugin_creator_state);

    return {
        slice_path: toPath(reducer_name, action),
        initial_state: reducer(undefined, {}),// it would be ideal to be able to call it without parameters at all reducer()
        previous_slice_state,
        new_slice_state: reducer(previous_slice_state, action)
    };
};

const { REDUCER_NAME, reduxPluginCreatorStateReducer } = registerReducer(state);

export {
    reduxPluginCreatorStateReducer,
    INITIAL_STATE as initial_state,
    REDUCER_NAME as default
};
