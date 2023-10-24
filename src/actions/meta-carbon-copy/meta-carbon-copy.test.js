import test from 'tape';
import REDUX_PLUGIN_CREATOR_META_CARBON_COPY, { reduxPluginCreatorMetaCarbonCopyAction, reduxPluginCreatorMetaCarbonCopyAction as metaCarbonCopyAction } from 'redux-plugin-creator/meta-carbon-copy.action.js';

const TEST_NAME = 'reduxPluginCreatorMetaCarbonCopyActionModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default value of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR_META_CARBON_COPY;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the action creator 'reduxPluginCreatorMetaCarbonCopyAction'`, (t) => {
        t.equal(typeof reduxPluginCreatorMetaCarbonCopyAction, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorMetaCarbonCopyAction(), { carbon_copy: true },'should create the expected action adding the carbon_copy property on');
        t.deepEqual(reduxPluginCreatorMetaCarbonCopyAction({type: 'any_action_type', payload: 'any_action_payload'}), { carbon_copy: true, type: 'any_action_type', payload: 'any_action_payload' }, 'should create the expected action adding the carbon_copy property on');
        t.end();
    });
    t.test(`${TEST_NAME}: the action creator 'metaCarbonCopyAction'`, (t) => {
        t.equal(typeof metaCarbonCopyAction, 'function', 'should be a function');
        t.equal(metaCarbonCopyAction, reduxPluginCreatorMetaCarbonCopyAction, 'should be an alias for reduxPluginCreatorMetaCarbonCopyAction');
        t.end();
    });

});
