import { useState } from "react";
import DrawerContex from "./drawerContext";

export const DrawerProvider = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = (state) => {
    setOpenDrawer(state);
  };

  return (
    <DrawerContex.Provider value={{ openDrawer, toggleDrawer }}>
      {children}
    </DrawerContex.Provider>
  );
};
