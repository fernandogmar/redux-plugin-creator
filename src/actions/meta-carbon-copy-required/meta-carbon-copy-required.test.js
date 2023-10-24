import test from 'tape';
import REDUX_PLUGIN_CREATOR_META_CARBON_COPY_REQUIRED, { reduxPluginCreatorMetaCarbonCopyRequiredAction, reduxPluginCreatorMetaCarbonCopyRequiredAction as metaCarbonCopyRequiredAction } from 'redux-plugin-creator/meta-carbon-copy-required.action.js';

const TEST_NAME = 'reduxPluginCreatorMetaCarbonCopyRequiredActionModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default value of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR_META_CARBON_COPY_REQUIRED;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the action creator 'reduxPluginCreatorMetaCarbonCopyRequiredAction'`, (t) => {
        t.equal(typeof reduxPluginCreatorMetaCarbonCopyRequiredAction, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorMetaCarbonCopyRequiredAction(), { carbon_copy_required: true },'should create the expected action adding the carbon_copy_required property on');
        t.deepEqual(reduxPluginCreatorMetaCarbonCopyRequiredAction({type: 'any_action_type', payload: 'any_action_payload'}), { carbon_copy_required: true, type: 'any_action_type', payload: 'any_action_payload' }, 'should create the expected action adding the carbon_copy_required property on');
        t.end();
    });
    t.test(`${TEST_NAME}: the action creator 'metaCarbonCopyRequiredAction'`, (t) => {
        t.equal(typeof metaCarbonCopyRequiredAction, 'function', 'should be a function');
        t.equal(metaCarbonCopyRequiredAction, reduxPluginCreatorMetaCarbonCopyRequiredAction, 'should be an alias for reduxPluginCreatorMetaCarbonCopyRequiredAction');
        t.end();
    });

});
