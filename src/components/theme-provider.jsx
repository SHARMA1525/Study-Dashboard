"use client"

import { createContext, useContext, useEffect, useState } from "react"


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


  useEffect(() => {
    const root = window.document.documentElement
    const storedTheme = localStorage.getItem(storageKey)


    const initialTheme = storedTheme || defaultTheme
    setThemeState(initialTheme)


    if (initialTheme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setResolvedTheme(systemTheme)
      root.classList.add(systemTheme)
    } else {
      setResolvedTheme(initialTheme)
      root.classList.add(initialTheme)
    }
  }, [defaultTheme, enableSystem, storageKey])


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


  const updateTheme = (newTheme) => {
    const root = window.document.documentElement
    const isDark = newTheme === "dark"


    if (disableTransitionOnChange) {
      document.documentElement.classList.add("transition-none")
      window.setTimeout(() => {
        document.documentElement.classList.remove("transition-none")
      }, 0)
    }


    root.classList.remove("light", "dark")


    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }


    const metaThemeColor = document.querySelector("meta[name=theme-color]")
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#0f172a" : "#ffffff")
    }
  }


  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
    updateTheme(newTheme)
  }


  const value = {
    theme,
    setTheme,
    themes,
    resolvedTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}


export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

// build optimization pass
