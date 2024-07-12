import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IList } from "../../components/List/List";

export interface IListsState {
  lists: IList[];
}

const initialState: IListsState = {
  lists: [],
};

export const boardsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<IList[]>) => {
      state.lists = action.payload;
    },
    updateListsIndex: (state) => {
      state.lists = state.lists.map((list, index) => {
        return {
          ...list,
          index: index,
        };
      });
    },
  },
});

export const { setLists, updateListsIndex } = boardsSlice.actions;

export default boardsSlice.reducer;
