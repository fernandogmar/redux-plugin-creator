import { registerSelector } from 'redux-plugin-creator/register.js';
import allPass from 'ramda/src/allPass';
import includes from 'ramda/src/includes';
import isNotNil from 'ramda/src/isNotNil';
import pathSatisfies from 'ramda/src/pathSatisfies';

const isLogger = (reducer_name) => pathSatisfies(
    allPass([isNotNil, includes(reducer_name)]),
    ['configuration', 'logger_names']
);
const { SELECTOR_NAME, reduxPluginCreatorIsLoggerSelector } = registerSelector(isLogger);


export {
    reduxPluginCreatorIsLoggerSelector,
    SELECTOR_NAME as default
};
