import { createContext, useContext } from "react";

const DrawerContex = createContext();

export function useDrawer() {
  return useContext(DrawerContex);
}

export default DrawerContex;
