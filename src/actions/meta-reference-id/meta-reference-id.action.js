import { registerMetaAction } from 'redux-plugin-creator/register.js';
import { metaReferenceId, REFERENCE_ID_DEFAULT } from 'redux-plugin-creator';


const { ACTION_NAME, reduxPluginCreatorMetaReferenceIdAction } = registerMetaAction(metaReferenceId);

export {
    reduxPluginCreatorMetaReferenceIdAction,
    ACTION_NAME as default,
    REFERENCE_ID_DEFAULT
};
