import { createSlice } from "@reduxjs/toolkit";

type LayoutState = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  isHovered: boolean;
  isApplicationMenuOpen: boolean;
  openSubmenu: string | null;
  isToggleTheme: string;
};

const initialState: LayoutState = {
  isExpanded: true,
  isMobileOpen: false,
  isMobile: false,
  isHovered: false,
  isApplicationMenuOpen: false,
  openSubmenu: null,
  isToggleTheme: "light",
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
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

    setToggleSubmenu: (state, action) => {
      state.openSubmenu = state.openSubmenu === action.payload ? null : action.payload;
    },
    setToggleTheme: (state, action) => {
      state.isToggleTheme = action.payload;
      if (action.payload === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    },
  },
});

export const { setIsMobile, setToggleSidebar, setToggleMobileSidebar, setIsHovered, setApplicationMenuOpen, setToggleSubmenu, setToggleTheme, setSidebarOpen } = layoutSlice.actions;

export default layoutSlice.reducer;
