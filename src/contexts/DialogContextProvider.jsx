import { useState } from "react";
import DialogContext from "./dialogContext";

export const DialogProvider = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const toggleDialog = (state, row = null) => {
    setOpenDialog(state);
    setSelectedRow(row);
  };

  return (
    <DialogContext.Provider value={{ openDialog, toggleDialog, selectedRow }}>
      {children}
    </DialogContext.Provider>
  );
};
