import test from 'tape';
import { reduxPluginCreatorSliceSelector } from 'redux-plugin-creator/slice.selector.js';

const TEST_NAME = 'reduxPluginCreatorSliceSelectorModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorSliceSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorSliceSelector, 'function', 'should be a function');
        //t.deepEqual(reduxPluginCreatorSliceSelector()({}), undefined,'should return empty slice');
        t.deepEqual(reduxPluginCreatorSliceSelector('REDUCER_1', { reference_group: 'GROUP_1', reference_id: 'ID_1' })({ 'GROUP_1': { 'REDUCER_1': { 'ID_1': 1 }}}), 1, 'should return the selected slice');
        t.end();
    });

});
