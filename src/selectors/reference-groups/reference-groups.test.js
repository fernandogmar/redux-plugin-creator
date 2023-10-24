import test from 'tape';
import { reduxPluginCreatorReferenceGroupsSelector } from 'redux-plugin-creator/reference-groups.selector.js';

const TEST_NAME = 'reduxPluginCreatorReferenceGroupsSelectorModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorReferenceGroupsSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorReferenceGroupsSelector, 'function', 'should be a function');
        t.deepEqual(reduxPluginCreatorReferenceGroupsSelector({}), [],'should return an empty array');
        t.deepEqual(
            reduxPluginCreatorReferenceGroupsSelector({ 'slices': {
                    'GROUP_1': { 'REDUCER_1': { 'ID_1': 1}},
                    'GROUP_2': { 'REDUCER_1': { 'ID_1': 1}},
                }
            }),
            ['GROUP_1', 'GROUP_2'],
            'should return the available reference groups'
        );
        t.end();
    });

});
