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
    updateListTitle: (state, action: PayloadAction<IList>) => {
      state.lists = state.lists.map((list) => {
        if (list._id === action.payload._id) {
          return action.payload;
        }
        return list;
      });
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
    updateCardTitle: (state, action: PayloadAction<ICard>) => {
      state.lists = state.lists.map((list) => {
        if (list._id === action.payload.list) {
          return {
            ...list,
            cards: list.cards.map((card) => {
              if (card._id === action.payload._id) {
                return action.payload;
              }
              return card;
            }),
          };
        }
        return list;
      });
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((list) => list._id !== action.payload);
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
  updateListTitle,
  updateCardTitle,
  deleteList,
} = boardsSlice.actions;

export default boardsSlice.reducer;
