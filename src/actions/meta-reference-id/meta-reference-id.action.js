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
    ACTION_NAME as default
};
