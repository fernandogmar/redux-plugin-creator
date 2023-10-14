import test from 'tape';
import REDUX_PLUGIN_CREATOR_META_REFERENCE_ID, { reduxPluginCreatorMetaReferenceIdAction, reduxPluginCreatorMetaReferenceIdAction as metaReferenceIdAction } from 'redux-plugin-creator/meta-reference-id.action.js';

const TEST_NAME = 'reduxPluginCreatorMetaReferenceIdActionModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the default value of this module`, (t) => {
        const actual = REDUX_PLUGIN_CREATOR_META_REFERENCE_ID;
        t.equal(typeof actual, 'string', 'should be a string');
        t.notEqual(actual, '', 'should not be empty');
        t.end();
    });

    t.test(`${TEST_NAME}: the action creator 'reduxPluginCreatorMetaReferenceIdAction'`, (t) => {
        t.equal(typeof reduxPluginCreatorMetaReferenceIdAction, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorMetaReferenceIdAction('any_id_name'), { reference_id: 'any_id_name' },'should create the expected action adding the reference_id');
        t.deepEqual(reduxPluginCreatorMetaReferenceIdAction('any_id_name', {type: 'any_action_type', payload: 'any_action_payload'}), { reference_id: 'any_id_name', type: 'any_action_type', payload: 'any_action_payload' }, 'should create the expected action adding the reference_id');
        t.deepEqual(reduxPluginCreatorMetaReferenceIdAction('id_name_2', {reference_id: 'id_name_1', type: 'any_action_type', payload: 'any_action_payload' }), { reference_id: 'id_name_1', type: 'any_action_type', payload: 'any_action_payload' }, 'should not overwritten the reference_id');
        t.end();
    });
    t.test(`${TEST_NAME}: the action creator 'metaReferenceIdAction'`, (t) => {
        t.equal(typeof metaReferenceIdAction, 'function', 'should be a function');
        t.equal(metaReferenceIdAction, reduxPluginCreatorMetaReferenceIdAction, 'should be an alias for reduxPluginCreatorMetaReferenceIdAction');
        t.end();
    });

});
