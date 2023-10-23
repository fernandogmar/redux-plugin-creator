import { registerMetaAction } from 'redux-plugin-creator/register.js';

const metaCarbonCopyRequired = (action = {}) => ({ ...action, carbon_copy_required: true });
const { ACTION_NAME, reduxPluginCreatorMetaCarbonCopyRequiredAction } = registerMetaAction(metaCarbonCopyRequired);

export {
    reduxPluginCreatorMetaCarbonCopyRequiredAction,
    ACTION_NAME as default
};
