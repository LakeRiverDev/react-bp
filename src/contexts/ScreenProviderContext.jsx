import { useTheme, useMediaQuery } from "@mui/material";
import ScreenContext from "./screenContext";

export const ScreenProvider = ({ children }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs")); // 0-599
  const isSm = useMediaQuery(theme.breakpoints.only("sm")); // 600-899
  const isMd = useMediaQuery(theme.breakpoints.only("md")); // 900-1199
  const isLg = useMediaQuery(theme.breakpoints.only("lg")); // 1200-1535
  const isXl = useMediaQuery(theme.breakpoints.only("xl")); // 1536-выше

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <ScreenContext.Provider
      value={{
        isXs,
        isSm,
        isMd,
        isLg,
        isXl,
        isMobile,
        isTablet,
        isDesktop,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};
