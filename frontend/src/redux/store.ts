import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardsSlice";
import listsReducer from "./slices/listsSlice";

const store = configureStore({
  reducer: {
    boards: boardReducer,
    lists: listsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
