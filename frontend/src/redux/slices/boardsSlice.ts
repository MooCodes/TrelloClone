import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard } from "../../components/Board/Board";

export interface IBoardsState {
  boards: IBoard[];
}

const initialState: IBoardsState = {
  boards: [],
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<IBoard[]>) => {
      state.boards = action.payload;
    },
    setBoardsIndex: (state) => {
      state.boards = state.boards.map((board, index) => {
        return {
          ...board,
          index: index,
        };
      });
    }
  },
});

export const { setBoards, setBoardsIndex } = boardsSlice.actions;


export default boardsSlice.reducer;
