import { EStoreSliceKey } from "@/app/config";
import { RootState } from "@/app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocalStorage } from "@utils/method";
import { UserInfo } from "./type";
import { AuthLoginResponse } from "@/models/api.types";
export const userInfoSlice = createSlice({
  name: EStoreSliceKey.USERINFO,
  reducers: {
    update: (state, action: PayloadAction<AuthLoginResponse>) => {
      const { token, refreshToken } = action.payload;
      LocalStorage.setLocal("accessToken", token);
      LocalStorage.setLocal("refreshToken", refreshToken);
      return { ...state, ...action.payload };
    },
    clear: () => {
      return { id: "", name: "", token: "" };
    },
  },
  initialState: {
    id: "",
    name: "",
  } as UserInfo,
});

export const { update, clear } = userInfoSlice.actions;
export const userInfo = (state: RootState) => state[EStoreSliceKey.USERINFO] as UserInfo;
export default userInfoSlice.reducer;
