// third-party
import { combineReducers } from 'redux';

// project import
import menuReducer from './menuReducer';
import themeReducer from './themeReducer';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu: menuReducer,
    theme: themeReducer
});

export default reducers;
