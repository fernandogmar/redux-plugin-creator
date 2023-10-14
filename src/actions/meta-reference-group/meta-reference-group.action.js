import { registerMetaAction } from 'redux-plugin-creator/register.js';

const metaReferenceGroup = (reference_group, action) => action?.reference_group
    ? action
    : {
        ...action,
        reference_group
    };
const { ACTION_NAME, reduxPluginCreatorMetaReferenceGroupAction } = registerMetaAction(metaReferenceGroup);

export {
    reduxPluginCreatorMetaReferenceGroupAction,
    ACTION_NAME as default
};
