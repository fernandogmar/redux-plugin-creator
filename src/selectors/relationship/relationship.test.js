import test from 'tape';
import { reduxPluginCreatorRelationshipSelector } from 'redux-plugin-creator/relationship.selector.js';

const TEST_NAME = 'reduxPluginCreatorRelationshipSelectorModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorRelationshipSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorRelationshipSelector, 'function', 'should be a function');
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector('no_plugin')({ configuration: { default_relationship: 'any default relationship'}}),
            'any default relationship',
            'should return the default relationship when the plugin does not have custom relationship'
        );
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector('my_plugin')({ configuration: { relationships: { my_plugin: 'any relationship' }}}),
            'any relationship',
            'should return the relationship of the plugin'
        );
        t.end();
    });

});
