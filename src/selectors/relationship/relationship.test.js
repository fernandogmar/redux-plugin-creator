import test from 'tape';
import { reduxPluginCreatorRelationshipSelector } from 'redux-plugin-creator/relationship.selector.js';
import Configurator, { configureDefaultPluginRelationship, configureNameMappers, configurePluginRelationship } from 'redux-plugin-creator/state.configurator.js';

const TEST_NAME = 'reduxPluginCreatorRelationshipSelectorModule';

test(TEST_NAME, (t) => {
    t.test(`${TEST_NAME}: the 'reduxPluginCreatorRelationshipSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorRelationshipSelector, 'function', 'should be a function');
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector('no_plugin')(
                Configurator()
                .map(configureDefaultPluginRelationship('any default relationship'))
                .get()
            ),
            'any default relationship',
            'should return the default relationship when the plugin does not have custom relationship'
        );
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector('my_plugin')(
                Configurator()
                .map(configurePluginRelationship('my_plugin', 'my_plugin_relationship'))
                .get()
            ),
            'my_plugin_relationship',
            'should return the relationship of the plugin'
        );
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector({ plugin_name: 'my_plugin' })(
                Configurator()
                .map(configurePluginRelationship('my_plugin', 'my_plugin_relationship'))
                .get()
            ),
            'my_plugin_relationship',
            'should return the relationship of the redux_component method'
        );
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector('my_action')(
                Configurator()
                .map(configurePluginRelationship('my_plugin', 'my_plugin_relationship'))
                .map(configureNameMappers([], { my_action: 'my_plugin'}))
                .get()
            ),
            'my_plugin_relationship',
            'should return the relationship of the redux_component name'
        );
        t.deepEqual(
            reduxPluginCreatorRelationshipSelector({ type: 'my_action' })(
                Configurator()
                .map(configurePluginRelationship('my_plugin', 'my_plugin_relationship'))
                .map(configureNameMappers([], { my_action: 'my_plugin'}))
                .get()
            ),
            'my_plugin_relationship',
            'should return the relationship of the redux_component type'
        );
        t.end();
    });

});
