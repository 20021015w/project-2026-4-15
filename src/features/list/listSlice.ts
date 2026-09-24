import { EStoreSliceKey } from "@/app/config";
import { RootState } from "@/app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ListBase } from "./type";
import { listsList } from "@/models/api.client";

interface ListState {
  data: ListBase[];
  loading: boolean;
  error: string | null;
}

const initValue: ListState = {
  data: [
    {
      status: "PENDING",
      content: "eat",
      displayIndex: 0,
      title: "",
      id: "0",
      // 新增字段：任务创建时间
      createdAt: "",
      // 新增字段：任务完成时间
      updatedAt: "",
    },
  ],
  loading: false,
  error: null,
};
export const fetchList = createAsyncThunk(
  "fetch/list",
  async (param: { status?: "PENDING" | "DONE" | "ARCHIVED" }, { rejectWithValue }) => {
    try {
      const res = await listsList({ ...param });
      if (res.code !== 0) {
        return rejectWithValue(res.message || "获取列表失败");
      }
      // 后端 ListItem -> 前端 ListBase 字段映射
      return res.data.map((item, index): ListBase => ({
        id: String(item.id),
        content: item.content || "",
        status: item.status,
        displayIndex: index,
        title: item.title || "",
        // 新增字段：任务创建时间
        createdAt: item.createdAt || "",
        // 新增字段：任务完成时间
        updatedAt: item.updatedAt || "",
      }));
    } catch (err: any) {
      return rejectWithValue(err?.message || "网络错误，获取列表失败");
    }
  },
);
const listSlice = createSlice({
  name: EStoreSliceKey.LIST,
  initialState: initValue,
  reducers: {
    addList: (state, action: PayloadAction<ListBase>) => {
      state.data.push(action.payload);
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((todo) => todo.id !== action.payload);
    },
    deleteTodos: (state, action: PayloadAction<string[]>) => {
      const deleteSet = new Set(action.payload);
      state.data = state.data.filter((item) => !deleteSet.has(item.id));
    },
    done: (state, action: PayloadAction<string>) => {
      state.data = state.data.map((item) =>
        item.id === action.payload
          ? { ...item, status: item.status === "DONE" ? "PENDING" : "DONE" }
          : item,
      );
    },
    archiveTodo: (state, action: PayloadAction<string>) => {
      state.data = state.data.map((item) =>
        item.id === action.payload
          ? { ...item, status: item.status === "ARCHIVED" ? "PENDING" : "ARCHIVED" }
          : item,
      );
    },
  },
  extraReducers(builder) {
    builder
      // 请求pending：开启loading
      .addCase(fetchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 请求成功，覆盖列表
      .addCase(fetchList.fulfilled, (state, action: PayloadAction<ListBase[]>) => {
        state.loading = false;
        state.data = action.payload;
      })
      // 请求失败
      .addCase(fetchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addList, deleteTodo, deleteTodos, done, archiveTodo } = listSlice.actions;
export const todoList = (state: RootState) => state[EStoreSliceKey.LIST] as ListState;

export default listSlice.reducer;
