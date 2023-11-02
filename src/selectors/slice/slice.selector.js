import { registerSelector } from 'redux-plugin-creator/register.js';
import path from 'ramda/src/path';

// TODO slice should return the INITIAL_STATE??
const slice = (reducer_name, action = {}, is_logger) => path(toSlicePath(reducer_name, action, is_logger));
const { SELECTOR_NAME, reduxPluginCreatorSliceSelector } = registerSelector(slice);

// helper
const toSlicePath = (reducer_name, { reference_group, reference_id }, is_logger) => [
    (is_logger ? 'logger_slices' : 'slices'),
    reference_group,
    reducer_name,
    reference_id
];

export {
    reduxPluginCreatorSliceSelector,
    toSlicePath,
    SELECTOR_NAME as default
};
