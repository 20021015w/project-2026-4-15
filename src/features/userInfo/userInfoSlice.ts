import { EStoreSliceKey } from "@/app/config";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorage } from "uitls";
import { UserInfo } from "./type";

export const userInfoSlice = createSlice({
  name: EStoreSliceKey.USERINFO,
  reducers: {
    update: (state, action: PayloadAction<UserInfo>) => {
      const {token} = action.payload
      console.log(token,)
      LocalStorage.setLocal("accessToken",token)
      console.log(action,'daf');
      
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
export const userInfo = (state:UserInfo) => state;
export default userInfoSlice.reducer;
