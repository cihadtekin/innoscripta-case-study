import { configureStore, createSlice } from '@reduxjs/toolkit'
import { UserState } from './types/User';

const initialState: UserState = { user: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.user = null;
    }
  }
});

export const { setUser, logout } = userSlice.actions;

const store = configureStore({
  reducer: { user: userSlice.reducer }
});
export default store;

const user = localStorage.getItem("user");
if (user) {
  store.dispatch(setUser(JSON.parse(user)));
}