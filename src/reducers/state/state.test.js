import test from 'tape';
import REDUX_PLUGIN_CREATOR, { reduxPluginCreatorStateReducer, initial_state } from 'redux-plugin-creator/state.reducer.js';
import { reduxPluginCreatorMetaCarbonCopyAction as metaCarbonCopyAction } from 'redux-plugin-creator/meta-carbon-copy.action.js';
import { reduxPluginCreatorMetaCarbonCopyRequiredAction as metaCarbonCopyRequiredAction } from 'redux-plugin-creator/meta-carbon-copy-required.action.js';
import { reduxPluginCreatorMetaCommonCarbonCopyRequiredAction as metaCommonCarbonCopyRequiredAction } from 'redux-plugin-creator/meta-common-carbon-copy-required.action.js';
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
    registerPlugin,
    plugins
} from 'redux-plugin-creator';

console.log(plugins);

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
        const { REDUCER_NAME, testStateReducer } = registerReducer(function state(test_state, action = {}) {
            return action.type;
        });
        configurePlugin(PLUGIN_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceGroupAction('any group', metaReferenceIdAction('any id', { type: 'test' }));
        const state = { slices: {} };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = { slices: { 'any group': { [REDUCER_NAME]: { 'any id': 'test' } } } };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for a common action, when the references groups were not initiated yet`, (t) => {
        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_SINGLE_NAME, registerReducer: registerSingleReducer } = registerPlugin('test-single');
        const { REDUCER_NAME: REDUCER_SINGLE_NAME, testSingleStateReducer } = registerSingleReducer(function state(test_state, action = {}) {
            return `single ${action.type}`;
        });
        configurePlugin(PLUGIN_SINGLE_NAME, ONE_GROUP_TO_ONE_PLUGIN);

        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action = {}) {
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
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for a common action, when other reference groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_SINGLE_NAME, registerReducer: registerSingleReducer } = registerPlugin('test-single');
        const { REDUCER_NAME: REDUCER_SINGLE_NAME, testSingleStateReducer } = registerSingleReducer(function state(test_state, action = {}) {
            return `single ${action.type}`;
        });
        configurePlugin(PLUGIN_SINGLE_NAME, ONE_GROUP_TO_ONE_PLUGIN);

        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action = {}) {
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
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for a no common action, when other references groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_SINGLE_NAME, registerReducer: registerSingleReducer } = registerPlugin('test-single');
        const { REDUCER_NAME: REDUCER_SINGLE_NAME, testSingleStateReducer } = registerSingleReducer(function state(test_state, action = {}) {
            return `single ${action.type}`;
        });
        configurePlugin(PLUGIN_SINGLE_NAME, ONE_GROUP_TO_ONE_PLUGIN);

        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action = {}) {
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
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for a no common action to a concrete id, when other references groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state, action = {}) {
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
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for a no common action to a concrete id and common group/no group, when other references groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = 0, action = {}) {
            switch(action.type) {
                case 'ADD_ONE': return test_state + 1;
                default: return test_state;
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceIdAction('THIS_REFERENCE_ID', { type: 'ADD_ONE' });
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
                        'THIS_REFERENCE_ID': 1
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
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for a no common action without concrete id, when other references groups were initiated`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = 0, action = {}) {
            switch(action.type) {
                case 'ADD_ONE': return test_state + 1;
                default: return test_state;
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceGroupAction(OTHER_REFERENCE_GROUP_2, { type: 'ADD_ONE' });
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
                        [REFERENCE_ID_DEFAULT]: 1,
                        'ANY REFERENCE_ID': 0,
                        'THIS_REFERENCE_ID': 0
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    // carbon copy cases //
    t.test(`${TEST_NAME}: for an action that should be applied to all the references id of the plugin in the same group`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';
        const close = () => {};

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerAction: registerMultipleAction, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { ACTION_NAME: ACTION_MULTIPLE_CLOSE_NAME, testMultipleCloseAction } = registerMultipleAction(close);
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = false, action = {}) {
            switch(action.type) {
                case ACTION_MULTIPLE_CLOSE_NAME: return false;
                default: return test_state
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaCarbonCopyRequiredAction(
            metaReferenceGroupAction( OTHER_REFERENCE_GROUP_1,
                metaReferenceIdAction( 'test_1',
                    testMultipleCloseAction()
                )
            )
        );
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                }
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        //'test_1': false,
                        //'test_2': false
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for an action that should be applied to all the references id of all groups`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';
        const close = () => {};

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerAction: registerMultipleAction, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { ACTION_NAME: ACTION_MULTIPLE_CLOSE_NAME, testMultipleCloseAction } = registerMultipleAction(close);
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = false, action = {}) {
            switch(action.type) {
                case ACTION_MULTIPLE_CLOSE_NAME: return false;
                default: return test_state
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaCarbonCopyRequiredAction(
            metaReferenceIdAction( 'test_1',
                testMultipleCloseAction()
            )
        );
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                }
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        //'test_1': false,
                        //'test_2': false
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        //'test_1': false,
                        //'test_2': false,
                        //'test_3': false
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for an action that should be applied to all the references id of all groups, more than one reducer in the plugin`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';
        const close = () => {};

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerAction: registerMultipleAction, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { ACTION_NAME: ACTION_MULTIPLE_CLOSE_NAME, testMultipleCloseAction } = registerMultipleAction(close);
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = false, action = {}) {
            switch(action.type) {
                case ACTION_MULTIPLE_CLOSE_NAME: return false;
                default: return test_state
            }
        });
        const { REDUCER_NAME: REDUCER_MULTIPLE_COUNT_NAME, testMultipleCountReducer } = registerMultipleReducer(function count(test_count = 0, action = {}) {
            switch(action.type) {
                case ACTION_MULTIPLE_CLOSE_NAME: return test_count + 1;
                default: return test_count
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaCarbonCopyRequiredAction(
            metaReferenceIdAction( 'test_1',
                testMultipleCloseAction()
            )
        );
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true
                    },
                    [REDUCER_MULTIPLE_COUNT_NAME]: {
                        'test_1': 1,
                        'test_2': 2,
                        'test_3': 0
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true
                    },
                    [REDUCER_MULTIPLE_COUNT_NAME]: {
                        'test_1': 0,
                        'test_2': 0
                    }
                }
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        //'test_1': false,
                        //'test_2': false,
                        //'test_3': false
                    },
                    [REDUCER_MULTIPLE_COUNT_NAME]: {
                        'test_1': 2,
                        'test_2': 3,
                        'test_3': 1
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        //'test_1': false,
                        //'test_2': false
                    },
                    [REDUCER_MULTIPLE_COUNT_NAME]: {
                        'test_1': 1,
                        'test_2': 1
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for an action that should be applied to all the references id of the plugin in the same group, when carbon copies recieved should do something different`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';
        const openOne = () => metaCarbonCopyRequiredAction({});

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerAction: registerMultipleAction, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { ACTION_NAME: ACTION_MULTIPLE_OPEN_ONE_NAME, testMultipleOpenOneAction } = registerMultipleAction(openOne);
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = false, action = {}) {
            switch(action.type) {
                case ACTION_MULTIPLE_OPEN_ONE_NAME: return action.carbon_copy ? false : true;
                default: return test_state
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaReferenceGroupAction( OTHER_REFERENCE_GROUP_1,
            metaReferenceIdAction( 'test_1',
                testMultipleOpenOneAction()
            )
        );
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': false,
                        'test_2': true
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                }
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        //'test_2': false
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });

    t.test(`${TEST_NAME}: for an action that should be applied to all the references id of all groups, when carbon copies recieved should do something different`, (t) => {
        const OTHER_REFERENCE_GROUP_1 = 'OTHER_REFERENCE_GROUP_1';
        const OTHER_REFERENCE_GROUP_2 = 'OTHER_REFERENCE_GROUP_2';
        const openOne = () => metaCarbonCopyRequiredAction({});

        clearPlugins();
        const { PLUGIN_NAME: PLUGIN_MULTIPLE_NAME, registerAction: registerMultipleAction, registerReducer: registerMultipleReducer } = registerPlugin('test-multiple');
        const { ACTION_NAME: ACTION_MULTIPLE_OPEN_ONE_NAME, testMultipleOpenOneAction } = registerMultipleAction(openOne);
        const { REDUCER_NAME: REDUCER_MULTIPLE_NAME, testMultipleStateReducer } = registerMultipleReducer(function state(test_state = false, action = {}) {
            switch(action.type) {
                case ACTION_MULTIPLE_OPEN_ONE_NAME: return action.carbon_copy ? false : true;
                default: return test_state
            }
        });
        configurePlugin(PLUGIN_MULTIPLE_NAME, MANY_GROUPS_TO_MANY_PLUGINS);

        const action = metaCommonCarbonCopyRequiredAction(
            metaReferenceGroupAction( OTHER_REFERENCE_GROUP_1,
                metaReferenceIdAction( 'test_1',
                    testMultipleOpenOneAction()
                )
            )
        );
        const state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': false,
                        'test_2': true
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                }
            }
        };
        const new_state = reduxPluginCreatorStateReducer(state, action);
        const expected_state = {
            slices: {
                [REFERENCE_GROUP_COMMON]: {
                    // althought this is not a result of executing actions, but it could be an initialization use case
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        'test_2': true,
                        'test_3': true
                    }
                },
                [OTHER_REFERENCE_GROUP_1]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        'test_1': true,
                        //'test_2': false
                    }
                },
                [OTHER_REFERENCE_GROUP_2]: {
                    [REDUCER_MULTIPLE_NAME]: {
                        //'test_1': false,
                        //'test_2': false,
                        //'test_3': false
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        t.end();
    });


    function _state(values) {
        return {
            ...reduxPluginCreatorStateReducer(),
            ...values
        }; // Extend initial state
    }

});
