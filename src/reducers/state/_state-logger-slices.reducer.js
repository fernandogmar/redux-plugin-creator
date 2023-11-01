import { slicesReducer } from './_slices.reducer.js';
import { loggers } from 'redux-plugin-creator';
import values from 'ramda/src/values';

const _stateLoggerSlicesReducer = (redux_plugin_creator_state, action) => [action]
    .reduce(
        slicesReducer(reducersSelector(loggers)),
        redux_plugin_creator_state
    );

// helpers
const reducersSelector = (loggers) => () => values(loggers);

export {
    _stateLoggerSlicesReducer
};
