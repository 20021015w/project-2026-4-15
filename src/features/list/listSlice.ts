import { EStoreSliceKey } from "@/app/config";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListBase } from "./type";

const initValue: ListBase[] = [{
  isDone: false,
  listInfo: 'eat',
  displayIndex: 0,
  id: "0"
}];

const listSlice = createSlice({
  name: EStoreSliceKey.LIST,
  initialState: initValue,
  reducers: {
    addList: (state, action: PayloadAction<ListBase>) => {
      return [...state, action.payload]
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      return state.filter(todo => todo.id !== action.payload);
    },
    // listSlice.ts 中的 deleteTodos
    deleteTodos: (state, action: PayloadAction<string[]>) => {
      const deleteSet = new Set(action.payload);
      return state.filter(item => !deleteSet.has(item.id));
    },
    done: (state, action: PayloadAction<string>) => {
      return state.reduce((curr, item) => {
        if (item.id === action.payload) {
          curr.push({
            ...item,
            isDone: !item.isDone
          })
        } else {
          curr.push(item)
        }
        return curr
      }, [] as ListBase[])
    },
  }
});

export const { addList, deleteTodo, deleteTodos, done } = listSlice.actions;

export const todoList = (state: { list: ListBase[] }) => state.list;

export default listSlice.reducer;