// actions
import { reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
// selectors
import { reduxPluginCreatorRelationshipSelector } from 'redux-plugin-creator/relationship.selector.js';
import { reduxPluginCreatorSliceSelector, toPath } from 'redux-plugin-creator/slice.selector.js';
// utilities
import { registerReducer } from 'redux-plugin-creator/register.js';// this will create a cyclic layout, infinite loop
import {
    configuration,
    names,
    plugins,
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT
} from 'redux-plugin-creator';
import assocPath from 'ramda/src/assocPath';
import keys from 'ramda/src/keys';
import toPairs from 'ramda/src/toPairs';
import values from 'ramda/src/values';

const INITIAL_STATE = Object.freeze({
    /*configuration: {
        relationships: {},
        default_relationship: ONE_GROUP_TO_ONE_PLUGIN
    },*/
    slices: {}
});


/*
const state = (redux_plugin_creator_state = INITIAL_STATE, action) => {

    // setting the default reference_group and reference_id, if they were not previously setted (remember references can not overwritten)
    action = metaReferenceGroupAction(REFERENCE_GROUP_COMMON, metaReferenceIdAction(REFERENCE_ID_DEFAULT, action))
    let one_group_reducers = [];
    let many_groups_reducers = [];

    if(action.reference_group === REFERENCE_GROUP_COMMON) {
        // the action will be passed to all the plugin reducers with ONE_GROUP relationship getting the REFERENCE_GROUP_COMMON slice
        // and the rest of reducers with MANY_GROUPS already started on the slices

        if(action.reference_id === REFERENCE_ID_DEFAULT) {
            one_group_reducers = getPluginReducers([
                ...getPluginsByRelationship(ONE_GROUP_TO_ONE_PLUGIN),
                ...getPluginsByRelationship(ONE_GROUP_TO_MANY_PLUGINS)
            ]);
            many_groups_reducers = getPluginReducers([
                ...getPluginsByRelationship(MANY_GROUPS_TO_ONE_PLUGIN),
                ...getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
            ]);
        } else {
            // it can be only passed the reducers that the relationship has MANY_PLUGINS
            one_group_reducers = getPluginReducers(
                getPluginsByRelationship(ONE_GROUP_TO_MANY_PLUGINS)
            );
            many_groups_reducers = getPluginReducers(
                getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
            );
        }

    } else {
        // only to reducers with MANY_GROUPS relationship
        if(action.reference_id === REFERENCE_ID_DEFAULT) {
            const many_groups_reducers = getPluginReducers([
                ...getPluginsByRelationship(MANY_GROUPS_TO_ONE_PLUGIN),
                ...getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
            ]);
        } else {
            // it can be only passed the reducers that the relationship has MANY_PLUGINS
            const many_groups_reducers = getPluginReducers(
                getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
            );
        }
    }

    const one_group_slice_changes = one_group_reducers.map(([ reducer_name, reducer]) => getSliceChange({
        reference: action,// same reference as the action
        reducer_name,
        reducer,
        action
    }))

    const many_groups_slice_changes = keys(redux_plugin_creator_state.slices)
        .filter((reference_group) => (reference_group !== REFERENCE_GROUP_COMMON) )
        .map(
            (reference_group) => [
                reference_group,
                many_groups_reducers.map(([ reducer_name, reducer]) => getSliceChange({
                    reference: {
                        // we need to overwritten the reference group to get the right slice per reducer, since a common action is passed to all groups
                        ...action,
                        ...metaReferenceGroupAction(reference_group)
                    },
                    reducer_name,
                    reducer,
                    action
                }))
            ]
        ).flat();

    const new_slices = [
        ...one_group_slice_changes,
        ...many_groups_slice_changes
    ].filter(
        ({ new_slice_state, previous_slice_state }) => (new_slice_state !== previous_slice_state)
    ).reduce(
        (slices, slice_change) => assocPath(toPath(slice_change.slice_path), slice_change.new_slice_state, slices),
        redux_plugin_creator_state.slices
    );

    return (new_slices === redux_plugin_creator_state.slices) ? redux_,plugin_creator_state : {
        ...redux_plugin_creator_state,
        slices: new_slices
    };
}

const state = (redux_plugin_creator_state = INITIAL_STATE, action) => {

    // setting the default reference_group and reference_id, if they were not previously setted (remember references can not overwritten)
    action = metaReferenceGroupAction(REFERENCE_GROUP_COMMON, metaReferenceIdAction(REFERENCE_ID_DEFAULT, action))

    if(action.reference_group === REFERENCE_GROUP_COMMON) {
        // the action will be passed to all the plugin reducers with ONE_GROUP relationship getting the REFERENCE_GROUP_COMMON slice
        // and the rest of reducers with MANY_GROUPS already started on the slices

        if(action.reference_id === REFERENCE_ID_DEFAULT) {
            reducers = getPluginReducers([
                ...getPluginsByRelationship(ONE_GROUP_TO_ONE_PLUGIN),
                ...getPluginsByRelationship(ONE_GROUP_TO_MANY_PLUGINS)
            ]);
        } else {
            // it can be only passed the reducers that the relationship has MANY_PLUGINS
            reducers = getPluginReducers(
                getPluginsByRelationship(ONE_GROUP_TO_MANY_PLUGINS)
            );
        }

    } else {
        // only to reducers with MANY_GROUPS relationship
        if(action.reference_id === REFERENCE_ID_DEFAULT) {
            reducers = getPluginReducers([
                ...getPluginsByRelationship(MANY_GROUPS_TO_ONE_PLUGIN),
                ...getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
            ]);
        } else {
            // it can be only passed the reducers that the relationship has MANY_PLUGINS
            reducers = getPluginReducers(
                getPluginsByRelationship(MANY_GROUPS_TO_MANY_PLUGINS)
            );
        }
    }

    const slice_changes = reducers.map(([ reducer_name, reducer]) => getSliceChange({
        reducer_name,
        reducer,
        action
    }));

    const new_slices = slice_changes.filter(
        ({ new_slice_state, previous_slice_state }) => (new_slice_state !== previous_slice_state)
    ).reduce(
        (slices, slice_change) => assocPath(toPath(slice_change.slice_path), slice_change.new_slice_state, slices),
        redux_plugin_creator_state.slices
    );

    return (new_slices === redux_plugin_creator_state.slices) ? redux_plugin_creator_state : {
        ...redux_plugin_creator_state,
        slices: new_slices
    };
}
*/
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

    const actions = (action.reference_group !== REFERENCE_GROUP_COMMON)
        ? [ action ]
        : [
            action,
            ...keys(redux_plugin_creator_state.slices)
                .filter((reference_group) => (reference_group !== REFERENCE_GROUP_COMMON))
                .map(reference_group => ({
                    // we need to overwritten the reference group to get the right slice per reducer, since a common action is passed to all groups
                    ...action,
                    ...metaReferenceGroupAction(reference_group)
                }))
        ];

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
    ).reduce(
        (slices, slice_change) => assocPath(slice_change.slice_path, slice_change.new_slice_state, redux_plugin_creator_state),
        redux_plugin_creator_state
    );


// helpers
const getPluginsByRelationship = (relationship) => keys(plugins)
    .filter((plugin_name) => (getPluginRelationship(plugin_name) === relationship));

const getPluginReducers = (plugin_names) => plugin_names
    .map(
        (plugin_name) => plugins[plugin_name].reducers
    )
    .map(values)
    .flat(1);

const getPluginRelationship = (plugin_name) => (configuration.plugin_relationships[plugin_name] || configuration.default_plugin_relationship);

const getSliceChange = ({ reducer_name, reducer, redux_plugin_creator_state, action }) => {
    const previous_slice_state = reduxPluginCreatorSliceSelector(reducer_name, action)(redux_plugin_creator_state);

    return {
        slice_path: toPath(reducer_name, action),
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
