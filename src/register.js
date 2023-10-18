import { configurePlugin, registerPlugin } from 'redux-plugin-creator';

const { PLUGIN_NAME, registerAction, registerMetaAction, registerReducer, registerSelector } = registerPlugin('redux-plugin-creator');

// this is a workaround to avoid for now that the reduxPluginCreatorStateReducer will be called on infinity nested loop when calling the registered reducers
// TODO maybe a registerMetaReducer?
configurePlugin(PLUGIN_NAME, PLUGIN_NAME);

export {
    registerAction,
    registerMetaAction,
    registerReducer,
    registerSelector,
    PLUGIN_NAME as default
};
