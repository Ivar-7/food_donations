import { useLayoutEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "./themeContext";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored =
      localStorage.getItem("okoa-food-theme") ??
      localStorage.getItem("foodbridge-theme");
    return stored === "dark" || stored === "light" ? stored : "light";
  });
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("okoa-food-theme", theme);
    localStorage.removeItem("foodbridge-theme");
  }, [theme]);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () =>
          setTheme((value) => (value === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
