import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editCoffeeShopMutationVariables } from "../__generated__/editCoffeeShopMutation";
import { seeCoffeeShopsQuery_seeCoffeeShops } from "../__generated__/seeCoffeeShopsQuery";
import { editItemType } from "./types";

interface shopsProductState {
  value: seeCoffeeShopsQuery_seeCoffeeShops[];
}

const initialState: shopsProductState = {
  value: [],
};

const shopsProductSlice = createSlice({
  name: "ShopsProduct",
  initialState,
  reducers: {
    addArray: (
      state,
      action: PayloadAction<seeCoffeeShopsQuery_seeCoffeeShops[]>,
    ) => {
      const value = [...state.value, ...action.payload];
      console.log(value.length);
      state.value = value;
    },
    addItem: (
      state,
      action: PayloadAction<seeCoffeeShopsQuery_seeCoffeeShops>,
    ) => {
      const value = [action.payload, ...state.value];
      state.value = value;
    },
    editItem: (state, action: PayloadAction<editItemType>) => {
      const {
        id,
        name,
        address,
        photos,
        categories,
        totalComment,
        totalLikes,
        isLiked,
      } = action.payload;
      const value = state.value.map((item) => {
        if (item.id === id) {
          const newItem = {
            ...item,
            ...(name && { name }),
            ...(address && { address }),
            ...(photos && { photos }),
            ...(categories && { categories }),
            ...(totalComment && { totalComment }),
            ...(totalLikes && { totalLikes }),
            ...(isLiked && { isLiked }),
          };
          console.log(newItem);
          return newItem;
        }
        return item;
      });
      state.value = value;
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const filterList = state.value.filter(
        (item) => item.id !== action.payload,
      );
      state.value = filterList;
    },
  },
});

export const { addArray, addItem, editItem, removeItem } =
  shopsProductSlice.actions;

const store = configureStore({
  reducer: {
    shopsProduct: shopsProductSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
