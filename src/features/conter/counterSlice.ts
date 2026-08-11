import { EStoreSliceKey } from "@/app/config";
import type { RootState } from "@/app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CounterState } from "./type";
const initialState: CounterState = {
  value: 0,
  status: "idle",
  error: null,
};

export const fetchCount = createAsyncThunk(
  "counter/fetchCount",
  async (amount: number) => {
    const response = await new Promise<{ data: number }>((resolve) =>
      setTimeout(() => resolve({ data: amount }), 1000),
    );
    return response.data;
  },
);

const counterSlice = createSlice({
  name: EStoreSliceKey.COUNTER, // 这个name必须和动态reducer的key完全一致
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = action.payload;
      })
      .addCase(fetchCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "未知错误";
      });
  },
});

export const { increment, decrement, incrementByAmount, reset } =
  counterSlice.actions;
const selectCounterSlice = (state: RootState): CounterState =>
  state[EStoreSliceKey.COUNTER] as CounterState;
export const selectCount = (state: RootState) =>
  selectCounterSlice(state).value;
export const selectCounterStatus = (state: RootState) =>
  selectCounterSlice(state).status;
export const selectCounterError = (state: RootState) =>
  selectCounterSlice(state).error;

export default counterSlice.reducer;
