import test from 'tape';
import REDUX_PLUGIN_CREATOR, { reduxPluginCreatorStateReducer, initial_state } from 'redux-plugin-creator/state.reducer.js';
import { reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
import {
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,
    configureDefaultPluginRelationship,
    configurePlugin,
    clearPlugins,
    registerPlugin
} from 'redux-plugin-creator';

const TEST_NAME = 'reduxPluginCreatorStateReducerModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default export of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorState' reducer`, (t) => {
        t.equal(typeof reduxPluginCreatorStateReducer, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorStateReducer(), initial_state, 'should return the initial value when called without arguments');
        t.end();
    });

    t.test(`${TEST_NAME}: for action 'reduxPluginCreatorDeselectAction' the reducer, when the card is selected`, (t) => {
        clearPlugins();
        const { PLUGIN_NAME, registerReducer } = registerPlugin('test');
        const { REDUCER_NAME, testStateReducer } = registerReducer(function state(test_state, action) {
            return action.type;
        });
        configurePlugin(PLUGIN_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceGroupAction('any group', metaReferenceIdAction('any id', { type: 'test' }));
        const state = { slices: {} };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = { slices: { 'any group': { [REDUCER_NAME]: { 'any id': 'test' } } } };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected cards');
        t.end();
    });

    t.test(`${TEST_NAME}: for a common action, when the references groups were not initiated yet`, (t) => {
        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_SINGLE_NAME, registerReducer: registerSingleReducer } = registerPlugin('test-single');
        const { REDUCER_NAME: REDUCER_SINGLE_NAME, testSingleStateReducer } = registerSingleReducer(function state(test_state, action) {
            return `single ${action.type}`;
        });
        configurePlugin(PLUGIN_SINGLE_NAME, ONE_GROUP_TO_ONE_PLUGIN);

        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action) {
            return `multiple ${action.type}`;
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = { type: 'test' };
        const state = { slices: {} };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    [REDUCER_SINGLE_NAME]: {
                        [REFERENCE_ID_DEFAULT]: 'single test'
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected cards');
        t.end();
    });

    t.test(`${TEST_NAME}: for a common action, when other reference groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_SINGLE_NAME, registerReducer: registerSingleReducer } = registerPlugin('test-single');
        const { REDUCER_NAME: REDUCER_SINGLE_NAME, testSingleStateReducer } = registerSingleReducer(function state(test_state, action) {
            return `single ${action.type}`;
        });
        configurePlugin(PLUGIN_SINGLE_NAME, ONE_GROUP_TO_ONE_PLUGIN);

        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action) {
            return `multiple ${action.type}`;
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = { type: 'test' };
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {},
                [OTHER_REFERENCE_GROUP_1]: {},
                [OTHER_REFERENCE_GROUP_2]: {}
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    [REDUCER_SINGLE_NAME]: {
                        [REFERENCE_ID_DEFAULT]: 'single test'
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        [REFERENCE_ID_DEFAULT]: 'multiple test'
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        [REFERENCE_ID_DEFAULT]: 'multiple test'
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected cards');
        t.end();
    });

    t.test(`${TEST_NAME}: for a no common action, when other references groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_SINGLE_NAME, registerReducer: registerSingleReducer } = registerPlugin('test-single');
        const { REDUCER_NAME: REDUCER_SINGLE_NAME, testSingleStateReducer } = registerSingleReducer(function state(test_state, action) {
            return `single ${action.type}`;
        });
        configurePlugin(PLUGIN_SINGLE_NAME, ONE_GROUP_TO_ONE_PLUGIN);

        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action) {
            return `multiple ${action.type}`;
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceGroupAction(OTHER_REFERENCE_GROUP_2, { type: 'test 2' });
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {},
                [OTHER_REFERENCE_GROUP_1]: {},
                [OTHER_REFERENCE_GROUP_2]: {}
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {},
                [OTHER_REFERENCE_GROUP_1]: {},
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        [REFERENCE_ID_DEFAULT]: 'multiple test 2'
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected cards');
        t.end();
    });


    t.test(`${TEST_NAME}: for a no common action to a concrete id, when other references groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action) {
            switch(action.type) {
                case 'ADD_ONE': return test_state + 1;
                default: return test_state;
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceGroupAction(OTHER_REFERENCE_GROUP_2, metaReferenceIdAction('THIS_REFERENCE_ID', { type: 'ADD_ONE' }));
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {},
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'ANY REFERENCE_ID': 0,
                        'THIS_REFERENCE_ID': 0
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'ANY REFERENCE_ID': 0,
                        'THIS_REFERENCE_ID': 0
                    }
                }
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {},
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'ANY REFERENCE_ID': 0,
                        'THIS_REFERENCE_ID': 0
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'ANY REFERENCE_ID': 0,
                        'THIS_REFERENCE_ID': 1
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected cards');
        t.end();
    });

    function _state(values) {
        return {
            ...reduxPluginCreatorStateReducer(),
            ...values
        }; // Extend initial state
    }

});
