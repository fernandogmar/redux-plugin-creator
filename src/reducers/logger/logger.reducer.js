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
    loggers,
    names,
    plugins,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,

    applyPluginRelationshipLimits
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

const logger = (redux_plugin_creator_logger = INITIAL_STATE, action) => {

    // setting the default reference_group and reference_id, if they were not previously setted (remember references can not overwritten)
    action = metaReferenceGroupAction(REFERENCE_GROUP_COMMON, metaReferenceIdAction(REFERENCE_ID_DEFAULT, action));

    return [action].reduce(
        slicesState(values(loggers)),
        redux_plugin_creator_logger
    );
}

const slicesState = (loggers) => (redux_plugin_creator_logger, action) =>
    loggers
    .map(
        (reducer) => getSliceChange({ reducer_name: names[reducer.name], reducer, redux_plugin_creator_logger, action })
    )
    .filter(
        ({ new_slice_state, previous_slice_state }) => (new_slice_state !== previous_slice_state)
    )
    .reduce(
        (slices, slice_change) => (slice_change.new_slice_state === slice_change.initial_state)
            ? dissocPath(slice_change.slice_path, slices)// we are not saving on store the initial state
            : assocPath(slice_change.slice_path, slice_change.new_slice_state, slices),
        redux_plugin_creator_logger
    );

// helpers
const getSliceChange = ({ reducer_name, reducer, redux_plugin_creator_logger, action }) => {
    const reference = applyPluginRelationshipLimits(reducer.plugin_name, action);
    const previous_slice_state = reduxPluginCreatorSliceSelector(reducer_name, reference)(redux_plugin_creator_logger);

    return {
        slice_path: toPath(reducer_name, reference),
        initial_state: reducer(undefined, {}),// it would be ideal to be able to call it without parameters at all reducer()
        previous_slice_state,
        new_slice_state: reducer(previous_slice_state, action)
    };
};

const { REDUCER_NAME, reduxPluginCreatorLoggerReducer } = registerReducer(logger);

export {
    reduxPluginCreatorLoggerReducer,
    INITIAL_STATE as initial_state,
    REDUCER_NAME as default
};
