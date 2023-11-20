// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
  isOpen: [], // for active default menu
  drawerOpen: true,
  pkg: 0  //Free:0, Basic:1
};

// ==============================|| SLICE - MENU ||============================== //

const menuReducer = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    menuOpen(state, action) {
      let id = action.payload.id;
      state.isOpen = [id];
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },

    setPackage(state, action) {
      state.pkg = action.payload.pkg;
    }
  }
});

export default menuReducer.reducer;

export const { menuOpen, openDrawer, setPackage } = menuReducer.actions;
