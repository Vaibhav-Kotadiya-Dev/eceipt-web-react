// third-party
import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers';

// project import
// import reducers from 'store/reducers';

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers
});

const { dispatch } = store;

const persister = 'EC'; // not sure what's this for

export { store, dispatch, persister };
