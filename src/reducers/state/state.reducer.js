import { REFERENCE_GROUP_COMMON, reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { REFERENCE_ID_DEFAULT, reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
import { _stateLoggerSlicesReducer } from './_state-logger-slices.reducer.js';
import { _stateSlicesReducer } from './_state-slices.reducer.js';
import {
    ONE_GROUP_TO_ONE_PLUGIN
} from 'redux-plugin-creator/state.configurator.js';
import { registerReducer } from 'redux-plugin-creator/register.js';
import { applyPluginRelationshipLimitsForState } from './_helpers.js';

const INITIAL_STATE = Object.freeze({
    configuration: {
        logger_names: [],
        plugin_names: {},
        plugin_relationships: {},
        default_plugin_relationship: ONE_GROUP_TO_ONE_PLUGIN
    },
    // slices for reducer states, some could be working as loggers
    logger_slices: {},
    slices: {}
});

const state = (redux_plugin_creator_state = INITIAL_STATE, action) => {
    const applyPluginRelationshipLimits = applyPluginRelationshipLimitsForState(redux_plugin_creator_state);

    // setting the default reference_group and reference_id, if they were not previously setted (remember references can not overwritten)
    action = metaReferenceGroupAction(REFERENCE_GROUP_COMMON,
        metaReferenceIdAction(REFERENCE_ID_DEFAULT,
            applyPluginRelationshipLimits(action, action)// what to do with not registered actions? for now will have ONE_GROUP_TO_ONE_PLUGIN as default relationship
        )
    );

    // we don't use combineReducers since each reducer require to get access to the full redux_plugin_creator_state (they need to get access to configuration)
    return [  _stateSlicesReducer, _stateLoggerSlicesReducer ].reduce(
        (state, reducer) => [action].reduce(reducer, state),
        redux_plugin_creator_state
    );
}

const { REDUCER_NAME, reduxPluginCreatorStateReducer } = registerReducer(state);

export {
    reduxPluginCreatorStateReducer,
    INITIAL_STATE as initial_state,
    REDUCER_NAME as default
};
