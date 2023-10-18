import { registerSelector } from 'redux-plugin-creator/register.js';
import path from 'ramda/src/path';

// TODO slice should return the INITIAL_STATE??
const slice = (reducer_name, action = {}) => path(toPath(reducer_name, action));
const { SELECTOR_NAME, reduxPluginCreatorSliceSelector } = registerSelector(slice);

// helper
const toPath = (reducer_name, { reference_group, reference_id }) => ['slices', reference_group, reducer_name, reference_id];

export {
    reduxPluginCreatorSliceSelector,
    toPath,
    SELECTOR_NAME as default
};
