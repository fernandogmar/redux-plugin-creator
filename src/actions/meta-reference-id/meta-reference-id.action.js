import { registerMetaAction } from 'redux-plugin-creator/register.js';

const metaReferenceId = (reference_id, action) => action?.reference_id
    ? action
    : {
        ...action,
        reference_id
    };
const { ACTION_NAME, reduxPluginCreatorMetaReferenceIdAction } = registerMetaAction(metaReferenceId);

export {
    reduxPluginCreatorMetaReferenceIdAction,
    reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction,// How bout the registerMetaAction should not add the prefix since it is not used as type?
    ACTION_NAME as default
};
