import test from 'tape';
import REDUX_PLUGIN_CREATOR_META_REFERENCE_GROUP, { reduxPluginCreatorMetaReferenceGroupAction, reduxPluginCreatorMetaReferenceGroupAction as metaReferenceGroupAction } from 'redux-plugin-creator/meta-reference-group.action.js';

const TEST_NAME = 'reduxPluginCreatorMetaReferenceGroupActionModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default value of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR_META_REFERENCE_GROUP;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the action creator 'reduxPluginCreatorMetaReferenceGroupAction'`, (t) => {
        t.equal(typeof reduxPluginCreatorMetaReferenceGroupAction, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorMetaReferenceGroupAction('any_group_name'), { reference_group: 'any_group_name' },'should create the expected action adding the reference_group');
        t.deepEqual(reduxPluginCreatorMetaReferenceGroupAction('any_group_name', {type: 'any_action_type', payload: 'any_action_payload'}), { reference_group: 'any_group_name', type: 'any_action_type', payload: 'any_action_payload' }, 'should create the expected action adding the reference_group');
        t.deepEqual(reduxPluginCreatorMetaReferenceGroupAction('group_name_2', {reference_group: 'group_name_1', type: 'any_action_type', payload: 'any_action_payload' }), { reference_group: 'group_name_1', type: 'any_action_type', payload: 'any_action_payload' }, 'should not overwritten the reference_group');
        t.end();
    });
    t.test(`${TEST_NAME}: the action creator 'metaReferenceGroupAction'`, (t) => {
        t.equal(typeof metaReferenceGroupAction, 'function', 'should be a function');
        t.equal(metaReferenceGroupAction, reduxPluginCreatorMetaReferenceGroupAction, 'should be an alias for reduxPluginCreatorMetaReferenceGroupAction');
        t.end();
    });

});
