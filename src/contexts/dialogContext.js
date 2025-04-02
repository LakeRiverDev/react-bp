import { createContext, useContext } from "react";

const DialogContext = createContext();

export function useDialog() {
  return useContext(DialogContext);
}

export default DialogContext;
