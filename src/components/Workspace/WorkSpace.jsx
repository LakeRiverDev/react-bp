import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Drawer, Alert, Dialog, DialogContent } from "@mui/material";
import Control from "./Table/Control";
import MainTableXANO from "./Table/MainTableXANO";
import { useScreen } from "@contexts/screenContext";
import { useDrawer } from "@contexts/drawerContext";
import { useDialog } from "@contexts/dialogContext";
import { fetchData, deleteData, updateData, postData } from "@utils/fetches";

export default function WorkSpace() {
  const { openDrawer, toggleDrawer } = useDrawer();
  const { openDialog, toggleDialog, selectedRow } = useDialog();
  const { isXs, isSm } = useScreen();

  const [alertMessage, setAlertMessage] = useState(null);

  const queryClient = useQueryClient();

  const addRow = useMutation({
    mutationFn: (data) => postData("/transactions", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["/transactions"]);
    },
    onError: (error) => {
      console.log(`Ошибка добавления строки: ${error}`);
    },
  });

  const delRow = useMutation({
    mutationFn: (id) => deleteData("/transactions", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["/transactions"]);
    },
    onError: (error, id) => {
      console.log(`Ошибка удаления строки ${id}: ${error}`);
    },
  });

  const editRow = useMutation({
    mutationFn: ({ id, updatedData }) =>
      updateData("/transactions", id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["/transactions"]);
    },
    onError: (error, { id }) => {
      console.log(`Ошибка редактирования строки ${id}: ${error}`);
    },
  });

  const controlQuery = useQuery({
    queryKey: ["control"],
    queryFn: () => fetchData("/control"),
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { md: "column", lg: "row", xl: "row" },
        alignItems: "center",
        height: "100%",
        margin: "0 50px",
      }}
    >
      <Alert
        sx={{
          marginInline: "auto",
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "80%", sm: "80%", md: "35%", lg: "35%", xl: "35%" },
          zIndex: 10,
          textAlign: "center",
          transition: "opacity 0.5s ease-in-out",
          opacity: alertMessage ? 1 : 0,
        }}
        severity="success"
        variant="filled"
      >
        {alertMessage}
      </Alert>

      <MainTableXANO editRow={editRow.mutate} delRow={delRow.mutate} />
      {/* Отображение Control на мобильных: в Drawer (при добавлении новой записи); в Dialog (при редактировании записи) */}
      {isXs || isSm ? (
        <>
          <Drawer
            anchor="bottom"
            open={openDrawer}
            onClose={() => toggleDrawer(false)}
          >
            <Control
              setAlertMessage={setAlertMessage}
              controlQuery={controlQuery}
              addRow={addRow.mutate}
            />
          </Drawer>

          <Dialog
            open={openDialog}
            onClose={() => toggleDialog(false)}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
            }}
          >
            <DialogContent>
              <Control
                setAlertMessage={setAlertMessage}
                controlQuery={controlQuery}
                initialData={selectedRow} // Передача данных строки для редактирования в диалоге
                editRow={editRow.mutate}
                addRow={addRow.mutate}
                delRow={delRow.mutate}
              />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Control
          setAlertMessage={setAlertMessage}
          controlQuery={controlQuery}
          initialData={selectedRow} // Передача данных строки для редактирования
          editRow={editRow.mutate}
          addRow={addRow.mutate}
          delRow={delRow.mutate}
        />
      )}
    </Box>
  );
}
