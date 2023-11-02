import test from 'tape';
import { reduxPluginCreatorIsLoggerSelector } from 'redux-plugin-creator/is-logger.selector.js';

const TEST_NAME = 'reduxPluginCreatorIsLoggerSelectorModule';

test(TEST_NAME, (t) => {

    t.test(`${TEST_NAME}: the 'reduxPluginCreatorIsLoggerSelector' selector`, (t) => {
        t.equal(typeof reduxPluginCreatorIsLoggerSelector, 'function', 'should be a function');
        t.equal(reduxPluginCreatorIsLoggerSelector()({}), false,'should return false when no loggers');
        t.equal(reduxPluginCreatorIsLoggerSelector('any logger name')({}), false,'should return false when no loggers');
        t.equal(reduxPluginCreatorIsLoggerSelector()({ configuration: { logger_names: [] }}), false,'should return false when no loggers');
        t.equal(reduxPluginCreatorIsLoggerSelector('any logger name')({ configuration: { logger_names: [ 'a logger' ] }}), false,'should return false when no loggers with that name');
        t.equal(reduxPluginCreatorIsLoggerSelector('any logger name')({ configuration: { logger_names: [ 'a logger', 'any logger name' ] }}), true,'should return true when there is a logger with that name');
        t.end();
    });

});
