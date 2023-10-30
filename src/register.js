import { registerPlugin } from 'redux-plugin-creator';

const { PLUGIN_NAME, registerAction, registerMetaAction, registerReducer, registerSelector } = registerPlugin('redux-plugin-creator');

export {
    registerAction,
    registerMetaAction,
    registerReducer,
    registerSelector,
    PLUGIN_NAME as default
};
