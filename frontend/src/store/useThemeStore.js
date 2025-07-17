import React from 'react'
import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    //fetch theme from local storage
    theme: localStorage.getItem("chat-theme") || "coffee",
    //update theme to localStorage
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    }
}))