import { registerSelector } from 'redux-plugin-creator/register.js';
import keys from 'ramda/src/keys';
import prop from 'ramda/src/prop';

const referenceGroups = (redux_plugin_creator_state) => keys(
    prop('slices', redux_plugin_creator_state)
);
const { SELECTOR_NAME, reduxPluginCreatorReferenceGroupsSelector } = registerSelector(referenceGroups);

export {
    reduxPluginCreatorReferenceGroupsSelector,
    SELECTOR_NAME as default
};
