import { registerMetaAction } from 'redux-plugin-creator/register.js';
import { REFERENCE_GROUP_COMMON } from 'redux-plugin-creator/meta-reference-group.action.js';

const metaCommonCarbonCopyRequired = (action = {}) => ({ ...action, carbon_copy_required: REFERENCE_GROUP_COMMON });
const { ACTION_NAME, reduxPluginCreatorMetaCommonCarbonCopyRequiredAction } = registerMetaAction(metaCommonCarbonCopyRequired);

export {
    reduxPluginCreatorMetaCommonCarbonCopyRequiredAction,
    ACTION_NAME as default
};
