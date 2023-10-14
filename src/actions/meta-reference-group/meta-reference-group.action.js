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
    reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction,// How bout the registerMetaAction should not add the prefix since it is not used as type?
    ACTION_NAME as default
};
