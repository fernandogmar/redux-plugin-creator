import { registerMetaAction } from 'redux-plugin-creator/register.js';

const metaCarbonCopy = (action = {}) => ({ ...action, carbon_copy: true });
const { ACTION_NAME, reduxPluginCreatorMetaCarbonCopyAction } = registerMetaAction(metaCarbonCopy);

export {
    reduxPluginCreatorMetaCarbonCopyAction,
    ACTION_NAME as default
};
