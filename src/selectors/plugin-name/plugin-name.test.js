import test from 'tape';
import { reduxPluginCreatorPluginNameSelector } from 'redux-plugin-creator/plugin-name.selector.js';
import Configurator, { configureDefaultPluginRelationship, configurePluginRelationship } from 'redux-plugin-creator/state.configurator.js';

const TEST_NAME = 'reduxPluginCreatorPluginNameSelectorModule';

test(TEST_NAME, (t) => {
    t.test(`${TEST_NAME}: the 'reduxPluginCreatorPluginNameSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorPluginNameSelector, 'function', 'should be a function');
        t.deepEqual(
            reduxPluginCreatorPluginNameSelector('any plugin name')({}),
            'any plugin name',
            'should return the plugin name passed'
        );
        t.deepEqual(
            reduxPluginCreatorPluginNameSelector({ plugin_name: 'my_plugin_name' })({}),
            'my_plugin_name',
            'should return the plugin name that the redux_component is related to'
        );
        t.deepEqual(
            reduxPluginCreatorPluginNameSelector('my_action')(
                Configurator({}, () => ({ my_action: 'my_plugin_name'}))
                    .get())
            ,
            'my_plugin_name',
            'should return the plugin name that the name of the redux_component is related to'
        )
        t.deepEqual(
            reduxPluginCreatorPluginNameSelector({ type: 'my_action' })(
                Configurator({}, () => ({ my_action: 'my_plugin_name'}))
                .get()
            ),
            'my_plugin_name',
            'should return the plugin name of the redux_component type'
        );
        t.end();
    });

});
