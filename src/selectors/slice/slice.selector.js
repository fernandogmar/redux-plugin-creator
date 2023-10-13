import { registerSelector } from 'redux-plugin-creator/register.js';
import path from 'ramda/src/path';

const slice = (reducer_name, { reference_group, reference_id } = {}) => path([reference_group, reducer_name, reference_id]);
const { SELECTOR_NAME, reduxPluginCreatorSliceSelector } = registerSelector(slice);

export {
    reduxPluginCreatorSliceSelector,
    SELECTOR_NAME as default
};
