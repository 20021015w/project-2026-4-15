import { EStoreSliceKey } from "@/app/config";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorage } from "uitls";
import { UserInfo } from "./type";

export const userInfoSlice = createSlice({
  name: EStoreSliceKey.USERINFO,
  reducers: {
    update: (state, action: PayloadAction<UserInfo>) => {
      const {token} = action.payload
      LocalStorage.setLocal("accessToken",token)
      return { ...state, ...action.payload };
    },
    clear: (state) => {
      return { id: '', name: '', token:''};
    }
  },
  initialState: {
    id: '',
    name: '',
  } as UserInfo,

});

export const { update, clear } = userInfoSlice.actions;
export const userInfo = (state:RootState) => state[EStoreSliceKey.USERINFO] as UserInfo;
export default userInfoSlice.reducer;
