import { registerSelector } from 'redux-plugin-creator/register.js';
import path from 'ramda/src/path';

// TODO slice should return the INITIAL_STATE??
const slice = (reducer_name, { reference_group, reference_id } = {}) => path(['slices', reference_group, reducer_name, reference_id]);
const { SELECTOR_NAME, reduxPluginCreatorSliceSelector } = registerSelector(slice);

export {
    reduxPluginCreatorSliceSelector,
    SELECTOR_NAME as default
};
