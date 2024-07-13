import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IList } from "../../components/List/List";
import { ICard } from "../../components/Card/Card";

export interface IListsState {
  lists: IList[];
}

const initialState: IListsState = {
  lists: [],
};

interface IAddCardToList {
  listId: string;
  card: ICard;
}

export const boardsSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<IList[]>) => {
      state.lists = action.payload;
    },
    addList: (state, action: PayloadAction<IList>) => {
      state.lists = [...state.lists, action.payload];
    },
    updateNewListId: (state, action: PayloadAction<IList>) => {
      state.lists = state.lists.map((list) => {
        if (list._id === "0") {
          return action.payload;
        }
        return list;
      });
    },
    updateListsIndex: (state) => {
      state.lists = state.lists.map((list, index) => {
        return {
          ...list,
          index: index,
        };
      });
    },
    addCardToList: (state, action: PayloadAction<IAddCardToList>) => {
      state.lists = state.lists.map((list) => {
        if (list._id === action.payload.listId) {
          return {
            ...list,
            cards: [...list.cards, action.payload.card],
          };
        }
        return list;
      });
    },
    updateNewCardId: (state, action: PayloadAction<ICard>) => {
      state.lists = state.lists.map((list) => {
        if (list._id === action.payload.list) {
          return {
            ...list,
            cards: list.cards.map((card) => {
              if (card._id === "0") {
                return action.payload;
              }
              return card;
            }),
          };
        }
        return list;
      });
    },
    updateCardsIndex: (state) => {
      state.lists = state.lists.map((list) => {
        return {
          ...list,
          cards: list.cards.map((card, index) => {
            return {
              ...card,
              index: index,
            };
          }),
        };
      });
    },
  },
});

export const {
  setLists,
  updateListsIndex,
  addList,
  updateNewListId,
  addCardToList,
  updateNewCardId,
  updateCardsIndex,
} = boardsSlice.actions;

export default boardsSlice.reducer;
