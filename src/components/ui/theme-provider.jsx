"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Create a context for the theme
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
  themes: ["light", "dark", "system"],
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  themes = ["light", "dark", "system"],
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
}) {
  const [theme, setThemeState] = useState(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState("light")

  // Initialize theme
  useEffect(() => {
    const root = window.document.documentElement
    const storedTheme = localStorage.getItem(storageKey)

    // Use stored theme or default
    const initialTheme = storedTheme || defaultTheme
    setThemeState(initialTheme)

    // Apply theme
    if (initialTheme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setResolvedTheme(systemTheme)
      root.classList.add(systemTheme)
    } else {
      setResolvedTheme(initialTheme)
      root.classList.add(initialTheme)
    }
  }, [defaultTheme, enableSystem, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = () => {
      if (theme === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light"
        setResolvedTheme(newTheme)
        updateTheme(newTheme)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [enableSystem, theme])

  // Function to update the theme
  const updateTheme = (newTheme) => {
    const root = window.document.documentElement
    const isDark = newTheme === "dark"

    // Handle transition
    if (disableTransitionOnChange) {
      document.documentElement.classList.add("transition-none")
      window.setTimeout(() => {
        document.documentElement.classList.remove("transition-none")
      }, 0)
    }

    // Remove all theme classes
    root.classList.remove("light", "dark")

    // Add the new theme class
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }

    // Update meta theme-color
    const metaThemeColor = document.querySelector("meta[name=theme-color]")
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0f172a" : "#ffffff")
    }
  }

  // Set theme function
  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
    updateTheme(newTheme)
  }

  // Context value
  const value = {
    theme,
    setTheme,
    themes,
    resolvedTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
