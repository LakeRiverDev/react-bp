import { createTheme, ThemeProvider } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { CssBaseline } from "@mui/material";
import ThemeContext from "./themeContext";

export const ThemeProviderWrapper = ({ children }) => {
  const savedMode = localStorage.getItem("themeMode") || "light";
  const [mode, setMode] = useState(savedMode);

  const theme = useMemo(
    // Создание темы MUI с useMemo
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    // Функция переключения темы
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
