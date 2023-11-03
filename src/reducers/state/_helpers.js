import { reduxPluginCreatorRelationshipSelector } from 'redux-plugin-creator/relationship.selector.js';
import { reducers } from 'redux-plugin-creator';
import { RELATIONSHIP_LIMITS } from 'redux-plugin-creator/state.configurator.js';
import PLUGIN_NAME from 'redux-plugin-creator/register.js';
import values from 'ramda/src/values';

const applyPluginRelationshipLimitsForState = (redux_plugin_creator_state) => (reference, action = {}) => ({
    ...action,
    ...RELATIONSHIP_LIMITS[reduxPluginCreatorRelationshipSelector(reference)(redux_plugin_creator_state)]
});

const getReducersByRelationshipForState = (redux_plugin_creator_state) => (relationship) => values(reducers)
    .filter((reducer) => (reducer.plugin_name !== PLUGIN_NAME))// this is a workaround to avoid for now that the reduxPluginCreatorStateReducer will be called on infinity nested loop when calling the registered reducers
    .filter((reducer) => (reduxPluginCreatorRelationshipSelector(reducer)(redux_plugin_creator_state) === relationship));

export {
    applyPluginRelationshipLimitsForState,
    getReducersByRelationshipForState
}
