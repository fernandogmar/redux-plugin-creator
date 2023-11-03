import test from 'tape';
import REDUX_PLUGIN_CREATOR_META_COMMON_CARBON_COPY_REQUIRED, { reduxPluginCreatorMetaCommonCarbonCopyRequiredAction, reduxPluginCreatorMetaCommonCarbonCopyRequiredAction as metaCommonCarbonCopyRequiredAction } from 'redux-plugin-creator/meta-common-carbon-copy-required.action.js';
import { REFERENCE_GROUP_COMMON } from 'redux-plugin-creator/meta-reference-group.action.js';

const TEST_NAME = 'reduxPluginCreatorMetaCommonCarbonCopyRequiredActionModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default value of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR_META_COMMON_CARBON_COPY_REQUIRED;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the action creator 'reduxPluginCreatorMetaCommonCarbonCopyRequiredAction'`, (t) => {
        t.equal(typeof reduxPluginCreatorMetaCommonCarbonCopyRequiredAction, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorMetaCommonCarbonCopyRequiredAction(), { carbon_copy_required: REFERENCE_GROUP_COMMON },'should create the expected action adding the carbon_copy_required property on');
        t.deepEqual(reduxPluginCreatorMetaCommonCarbonCopyRequiredAction({type: 'any_action_type', payload: 'any_action_payload'}), { carbon_copy_required: REFERENCE_GROUP_COMMON, type: 'any_action_type', payload: 'any_action_payload' }, 'should create the expected action adding the carbon_copy_required property on');
        t.end();
    });
    t.test(`${TEST_NAME}: the action creator 'metaCommonCarbonCopyRequiredAction'`, (t) => {
        t.equal(typeof metaCommonCarbonCopyRequiredAction, 'function', 'should be a function');
        t.equal(metaCommonCarbonCopyRequiredAction, reduxPluginCreatorMetaCommonCarbonCopyRequiredAction, 'should be an alias for reduxPluginCreatorMetaCommonCarbonCopyRequiredAction');
        t.end();
    });

});
