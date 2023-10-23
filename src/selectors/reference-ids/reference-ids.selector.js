import { registerSelector } from 'redux-plugin-creator/register.js';
import compose from 'ramda/src/compose';
import keys from 'ramda/src/keys';
import path from 'ramda/src/path';

// TODO slice should return the INITIAL_STATE??
const referenceIds = (reducer_name, action = {}) => compose(keys, path(toReducerPath(reducer_name, action)));
const { SELECTOR_NAME, reduxPluginCreatorReferenceIdsSelector } = registerSelector(referenceIds);

// helper
const toReducerPath = (reducer_name, { reference_group, reference_id }) => ['slices', reference_group, reducer_name];

export {
    reduxPluginCreatorReferenceIdsSelector,
    toReducerPath,
    SELECTOR_NAME as default
};
