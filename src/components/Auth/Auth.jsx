import AuthForm from "./AuthForm/AuthForm";
import Description from "./Description";
import { Divider, Stack, IconButton, Box } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { useTheme } from "@contexts/themeContext";

export default function Auth() {
  const { mode, toggleTheme } = useTheme();
  return (
    <div className="flex items-center justify-center h-full">
      <Stack direction={{ md: "column", lg: "row", xl: "row" }} spacing={4}>
        <Box
          sx={{ display: { xs: "none", sm: "none", md: "none", lg: "flex" } }}
        >
          <Description />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ xs: "none", sm: "none", md: "none", lg: "flex" }}
        >
          <IconButton className="ml-auto" onClick={toggleTheme}>
            {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
          </IconButton>
        </Divider>
        <AuthForm />
      </Stack>
    </div>
  );
}
