import { reduxPluginCreatorSliceSelector, toPath } from 'redux-plugin-creator/slice.selector.js';
// helpers
import { names } from 'redux-plugin-creator';
import { applyPluginRelationshipLimitsForState } from './_helpers.js';
import assocPath from 'ramda/src/assocPath';
import dissocPath from 'ramda/src/dissocPath';

const slicesReducer = (reducersSelector) => (redux_plugin_creator_state, action) =>
    reducersSelector(action)
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
const getSliceChange = ({ reducer_name, reducer, redux_plugin_creator_state, action }) => {
    const reference = applyPluginRelationshipLimitsForState(redux_plugin_creator_state)(reducer, action);
    const previous_slice_state = reduxPluginCreatorSliceSelector(reducer_name, reference)(redux_plugin_creator_state);

    return {
        slice_path: toPath(reducer_name, reference),
        initial_state: reducer(undefined, {}),// it would be ideal to be able to call it without parameters at all reducer()
        previous_slice_state,
        new_slice_state: reducer(previous_slice_state, action)
    };
};

export {
    slicesReducer
};
