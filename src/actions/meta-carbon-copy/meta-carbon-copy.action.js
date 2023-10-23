import { registerMetaAction } from 'redux-plugin-creator/register.js';

// in case of using it as enhancer this should remove the property carbon_copy_required to avoid to be triggered in an infinity loop??
const metaCarbonCopy = (action = {}) => ({ ...action, carbon_copy: true });
const { ACTION_NAME, reduxPluginCreatorMetaCarbonCopyAction } = registerMetaAction(metaCarbonCopy);

export {
    reduxPluginCreatorMetaCarbonCopyAction,
    ACTION_NAME as default
};
