import test from 'tape';
import REDUX_PLUGIN_CREATOR_STATE, { reduxPluginCreatorStateReducer, initial_state } from 'redux-plugin-creator/state.reducer.js';
import { reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';
import { reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';
import {
    MANY_GROUPS_TO_MANY_PLUGINS,
    MANY_GROUPS_TO_ONE_PLUGIN,
    ONE_GROUP_TO_ONE_PLUGIN,
    ONE_GROUP_TO_MANY_PLUGINS,
    REFERENCE_GROUP_COMMON,
    REFERENCE_ID_DEFAULT,
    clearPlugins,
    getPluginNames,
    getLoggerNames,
    registerPluginAsLogger,
    plugins
} from 'redux-plugin-creator';
import reduxPluginCreatorStateConfigurator, {
    configureDefaultPluginRelationship,
    configureNameMappers,
    configurePluginRelationship
} from 'redux-plugin-creator/state.configurator.js';

const TEST_NAME = 'reduxPluginCreatorStateLoggerSlicesReducerModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default export of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR_STATE;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorLoggers' reducer`, (t) => {
        t.equal(typeof reduxPluginCreatorStateReducer, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorStateReducer(), initial_state, 'should return the initial value when called without arguments');
        t.end();
    });

    t.test(`${TEST_NAME}: a logger with relationship ONE_GROUP_TO_ONE_PLUGIN`, (t) => {
        const { PLUGIN_NAME, registerReducerAsLogger } = registerPluginAsLogger('test');
        const { REDUCER_NAME, testStateReducer } = registerReducerAsLogger(function logger(test_state = [], action = {}) {
            return action.type ? test_state.concat(action.type) : test_state;
        });
        ;// loggers will be listeni
        const actions = [
            metaReferenceGroupAction('any group', metaReferenceIdAction('any id', { type: 'action with referenced group and id' })),
            metaReferenceGroupAction('any group', { type: 'action with only referenced group' }),
            metaReferenceIdAction('any id', { type: 'action with only referenced id' }),
            { type: 'action with no references at all'}
        ];
        const state = reduxPluginCreatorStateConfigurator({ logger_slices: {} })
            .map(configurePluginRelationship(PLUGIN_NAME, ONE_GROUP_TO_ONE_PLUGIN))
            .map(configureNameMappers(getLoggerNames(), getPluginNames()))
            .get();
        const new_state = actions.reduce(reduxPluginCreatorStateReducer, state);
        const expected_state = {
            ...state,
            logger_slices: {
                [REFERENCE_GROUP_COMMON]: {
                    [REDUCER_NAME]: {
                        [REFERENCE_ID_DEFAULT]: [
                            'action with referenced group and id',
                            'action with only referenced group',
                            'action with only referenced id',
                            'action with no references at all'
                        ]
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        teardown(t);
    });

    t.test(`${TEST_NAME}: a logger with relationship ONE_GROUP_TO_MANY_PLUGINS`, (t) => {
        const { PLUGIN_NAME, registerReducerAsLogger } = registerPluginAsLogger('test');
        const { REDUCER_NAME, testStateReducer } = registerReducerAsLogger(function logger(test_state = [], action = {}) {
            return action.type ? test_state.concat(action.type) : test_state;
        });
        const actions = [
            metaReferenceGroupAction('any group', metaReferenceIdAction('any id', { type: 'action with referenced group and id' })),
            metaReferenceGroupAction('any group', { type: 'action with only referenced group' }),
            metaReferenceIdAction('any id', { type: 'action with only referenced id' }),
            { type: 'action with no references at all'}
        ];
        const state = reduxPluginCreatorStateConfigurator({ logger_slices: {} })
            .map(configurePluginRelationship(PLUGIN_NAME, ONE_GROUP_TO_MANY_PLUGINS))
            .map(configureNameMappers(getLoggerNames(), getPluginNames()))
            .get();
        const new_state = actions.reduce(reduxPluginCreatorStateReducer, state);
        const expected_state = {
            ...state,
            logger_slices: {
                [REFERENCE_GROUP_COMMON]: {
                    [REDUCER_NAME]: {
                        [REFERENCE_ID_DEFAULT]: [
                            'action with only referenced group',
                            'action with no references at all'
                        ],
                        'any id': [
                            'action with referenced group and id',
                            'action with only referenced id'
                        ]
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        teardown(t);
    });

    t.test(`${TEST_NAME}: a logger with relationship MANY_GROUPS_TO_ONE_PLUGIN`, (t) => {
        const { PLUGIN_NAME, registerReducerAsLogger } = registerPluginAsLogger('test');
        const { REDUCER_NAME, testStateReducer } = registerReducerAsLogger(function logger(test_state = [], action = {}) {
            return action.type ? test_state.concat(action.type) : test_state;
        });
        const actions = [
            metaReferenceGroupAction('any group', metaReferenceIdAction('any id', { type: 'action with referenced group and id' })),
            metaReferenceGroupAction('any group', { type: 'action with only referenced group' }),
            metaReferenceIdAction('any id', { type: 'action with only referenced id' }),
            { type: 'action with no references at all'}
        ];
        const state = reduxPluginCreatorStateConfigurator({ logger_slices: {} })
            .map(configurePluginRelationship(PLUGIN_NAME, MANY_GROUPS_TO_ONE_PLUGIN))
            .map(configureNameMappers(getLoggerNames(), getPluginNames()))
            .get();
        const new_state = actions.reduce(reduxPluginCreatorStateReducer, state);
        const expected_state = {
            ...state,
            logger_slices: {
                [REFERENCE_GROUP_COMMON]: {
                    [REDUCER_NAME]: {
                        [REFERENCE_ID_DEFAULT]: [
                            'action with only referenced id',
                            'action with no references at all'
                        ]
                    }
                },
                'any group': {
                    [REDUCER_NAME]: {
                        [REFERENCE_ID_DEFAULT]: [
                            'action with referenced group and id',
                            'action with only referenced group'
                        ]
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        teardown(t);
    });

    t.test(`${TEST_NAME}: a logger with relationship MANY_GROUPS_TO_MANY_PLUGINS`, (t) => {
        const { PLUGIN_NAME, registerReducerAsLogger } = registerPluginAsLogger('test');
        const { REDUCER_NAME, testStateReducer } = registerReducerAsLogger(function logger(test_state = [], action = {}) {
            return action.type ? test_state.concat(action.type) : test_state;
        });
        const actions = [
            metaReferenceGroupAction('any group', metaReferenceIdAction('any id', { type: 'action with referenced group and id' })),
            metaReferenceGroupAction('any group', { type: 'action with only referenced group' }),
            metaReferenceIdAction('any id', { type: 'action with only referenced id' }),
            { type: 'action with no references at all'}
        ];
        const state = reduxPluginCreatorStateConfigurator({ logger_slices: {} })
            .map(configurePluginRelationship(PLUGIN_NAME, MANY_GROUPS_TO_MANY_PLUGINS))
            .map(configureNameMappers(getLoggerNames(), getPluginNames()))
            .get();
        const new_state = actions.reduce(reduxPluginCreatorStateReducer, state);
        const expected_state = {
            ...state,
            logger_slices: {
                [REFERENCE_GROUP_COMMON]: {
                    [REDUCER_NAME]: {
                        [REFERENCE_ID_DEFAULT]: [
                            'action with no references at all'
                        ],
                        'any id': [
                            'action with only referenced id'
                        ]
                    }
                },
                'any group': {
                    [REDUCER_NAME]: {
                        [REFERENCE_ID_DEFAULT]: [
                            'action with only referenced group'
                        ],
                        'any id': [
                            'action with referenced group and id'
                        ]
                    }
                }
            }
        };

        t.notEqual(new_state, state, 'should return a different state');
        t.deepEqual(new_state, expected_state, 'should update the selected slice');
        teardown(t);
    });

    function teardown(t) {
        clearPlugins();
        t.end();
    }

});
