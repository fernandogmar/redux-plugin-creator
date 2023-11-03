import { registerMetaAction } from 'redux-plugin-creator/register.js';
const REFERENCE_ID_DEFAULT = '__DEFAULT__';

const metaReferenceId = (reference_id = REFERENCE_ID_DEFAULT, action) => action?.reference_id
    ? action
    : {
        ...action,
        reference_id
    };
const { ACTION_NAME, reduxPluginCreatorMetaReferenceIdAction } = registerMetaAction(metaReferenceId);

export {
    reduxPluginCreatorMetaReferenceIdAction,
    ACTION_NAME as default,
    REFERENCE_ID_DEFAULT
};
