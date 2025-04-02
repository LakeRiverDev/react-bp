import { useState } from "react";
import { Box, Switch, Chip } from "@mui/material";
import { AddCircleOutline, Key } from "@mui/icons-material";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

export default function AuthForm() {
  const [signIn, setSignIn] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Chip
            label="Регистрация"
            variant={signIn ? "outlined" : "filled"}
            color="primary"
            sx={{ fontSize: "1rem" }}
            size="small"
            icon={<AddCircleOutline />}
          />
          <Switch
            size="lg"
            color="primary"
            onChange={(e) => setSignIn(e.target.checked)}
            checked={signIn}
            className="mb-1"
          />
          <Chip
            label="Авторизация"
            variant={!signIn ? "outlined" : "filled"}
            color="primary"
            sx={{ fontSize: "1rem" }}
            size="small"
            icon={<Key />}
          />
        </Box>
        {signIn ? <SignIn /> : <SignUp setSignIn={setSignIn} />}
      </Box>
    </Box>
  );
}
