import { registerMetaAction } from 'redux-plugin-creator/register.js';
import { metaReferenceGroup, REFERENCE_GROUP_COMMON } from 'redux-plugin-creator';

const { ACTION_NAME, reduxPluginCreatorMetaReferenceGroupAction } = registerMetaAction(metaReferenceGroup);

export {
    reduxPluginCreatorMetaReferenceGroupAction,
    ACTION_NAME as default,
    REFERENCE_GROUP_COMMON
};
