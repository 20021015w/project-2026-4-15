import { EStoreSliceKey } from "@/app/config";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CounterState } from "./type";


const initialState: CounterState = {
  value: 0,
  status: 'idle',
  error: null,
};
export const fetchCount = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    const response = await new Promise<{ data: number }>((resolve) =>
      setTimeout(() => resolve({ data: amount }), 1000)
    );
    return response.data;
  }
);
const counterSlice = createSlice({
  name: EStoreSliceKey.COUNTER,
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
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = action.payload;
      })
      .addCase(fetchCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || '未知错误';
      });
  },
});
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

export const selectCount = (state: { counter: CounterState }) => state.counter.value;
export const selectCounterStatus = (state: { counter: CounterState }) => state.counter.status;
export const selectCounterError = (state: { counter: CounterState }) => state.counter.error;

export { counterSlice };
export default counterSlice.reducer;