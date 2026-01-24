import { createSlice } from "@reduxjs/toolkit";
import { Storage, Stringify } from "../../Utils";
import { STORAGE_KEYS } from "../../Constants";
import type { ChildDetailsApiResponse } from "../../Types";

type LayoutState = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  isHovered: boolean;
  isApplicationMenuOpen: boolean;
  isToggleTheme: string;
  permission: ChildDetailsApiResponse[];
};

const StoredPermission = JSON.parse(Storage.getItem(STORAGE_KEYS.PERMISSION) || "null");

const initialState:LayoutState = {
  isExpanded: true,
  isMobileOpen: false,
  isMobile: false,
  isHovered: false,
  isApplicationMenuOpen: false,
  isToggleTheme: "light",
  permission: StoredPermission,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setPermission: (state, action) => {
      state.permission = action.payload;
      Storage.setItem(STORAGE_KEYS.PERMISSION, Stringify(action.payload));
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
      if (!action.payload) {
        state.isMobileOpen = false;
      }
    },
    setToggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    setSidebarOpen: (state, action) => {
      state.isExpanded = action.payload;
    },
    setToggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },

    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },

    setApplicationMenuOpen: (state) => {
      state.isApplicationMenuOpen = !state.isApplicationMenuOpen;
    },

    setToggleTheme: (state, action) => {
      state.isToggleTheme = action.payload;
      if (action.payload === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
  },
});

export const {setPermission, setIsMobile, setToggleSidebar, setToggleMobileSidebar, setIsHovered, setApplicationMenuOpen, setToggleTheme, setSidebarOpen } = layoutSlice.actions;

export default layoutSlice.reducer;
