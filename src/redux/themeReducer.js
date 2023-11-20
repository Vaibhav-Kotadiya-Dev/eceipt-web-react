// types
import { createSlice } from '@reduxjs/toolkit';
import config from 'config';

// initial state
const initialState = {
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
};

// ==============================|| SLICE - MENU ||============================== //

const themeReducer = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setFontFamily(state, action) {
      state.fontFamily = action.payload.fontFamily;
    },

    setBorderRadius(state, action) {
      state.borderRadius = action.payload.borderRadius;
    }
  }
});

export default themeReducer.reducer;

export const { setFontFamily, setBorderRadius } = themeReducer.actions;
