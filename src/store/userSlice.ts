import { createSlice } from '@reduxjs/toolkit';

interface UserData {
  token: string;
  email: string;
}

const initialState: UserData = {
  token: '',
  email: '',
};

const userTokenSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUserToken(state, action) {
      state.token = action.payload;
    },
    setUserEmail(state, action) {
      state.email = action.payload;
    },
    deleteToken(state) {
      state.token = '';
      state.email = '';
    },
  },
});

export const { setUserToken, setUserEmail, deleteToken } =
  userTokenSlice.actions;
export default userTokenSlice.reducer;
