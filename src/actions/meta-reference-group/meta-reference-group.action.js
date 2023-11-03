import { registerMetaAction } from 'redux-plugin-creator/register.js';
const REFERENCE_GROUP_COMMON = '__COMMON__';

const metaReferenceGroup = (reference_group = REFERENCE_GROUP_COMMON, action) => action?.reference_group
    ? action
    : {
        ...action,
        reference_group
    };
const { ACTION_NAME, reduxPluginCreatorMetaReferenceGroupAction } = registerMetaAction(metaReferenceGroup);

export {
    reduxPluginCreatorMetaReferenceGroupAction,
    ACTION_NAME as default,
    REFERENCE_GROUP_COMMON
};
