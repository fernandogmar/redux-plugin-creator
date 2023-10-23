import test from 'tape';
import { reduxPluginCreatorReferenceIdsSelector } from 'redux-plugin-creator/reference-ids.selector.js';

const TEST_NAME = 'reduxPluginCreatorReferenceIdsSelectorModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorReferenceIdsSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorReferenceIdsSelector, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorReferenceIdsSelector()({}), [],'should return an empty array');
        t.deepEqual(
            reduxPluginCreatorReferenceIdsSelector('REDUCER_1', { reference_group: 'GROUP_1', reference_id: 'ID_1' })({ 'slices': {'GROUP_1': { 'REDUCER_1': { 'ID_1': 1, 'ID_2': 2 }}}}),
            ['ID_1', 'ID_2'],
            'should return the available reference ids'
        );
        t.end();
    });

});
