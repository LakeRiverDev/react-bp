import { useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Badge
} from "@mui/material";
import {
  AutoGraph,
  Email,
  Notifications,
  DarkModeOutlined,
  LightModeOutlined,
  Logout,
  AddCircle,
} from "@mui/icons-material";
import { useTheme } from "@contexts/themeContext";
import { AuthContext } from "@contexts/authContext";
import { useScreen } from "@contexts/screenContext";
import { useDrawer } from "@contexts/drawerContext";

export default function Header() {
  const { mode, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext);
  const { isXs, isSm } = useScreen();
  const { toggleDrawer } = useDrawer(); // Контекст открытия Drawer

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");

  //Функция создания аватара с 1й буквой имени
  function letterAvatar(userName) {
    return {
      children: `${userName[0].toUpperCase()}`,
    };
  }

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        sx={{
          display: { xs: "none", sm: "none", md: "flex" },
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          bottom: { xs: 0, sm: 0, md: "auto" },
        }}
      >
        <Toolbar sx={{ minHeight: "64px", justifyContent: "space-around" }}>
          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
            }}
          >
            <AutoGraph sx={{ fontSize: "2.5rem", color: "primary.main" }} />
            <Badge badgeContent="beta" color="success">
              <Typography variant="h6" component="div">
              BPlanner
            </Typography>
            </Badge>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              borderRight: "1px solid #e0e0e0",
              pr: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "right",
                mr: 1,
              }}
            >
              <Typography variant="body1">{userName}</Typography>
              <Typography variant="caption">{userEmail}</Typography>
            </Box>
            <Avatar
              sx={{ width: 30, height: 30 }}
              {...letterAvatar(userName)}
              color="primary"
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "space-around",
              flexGrow: { xs: 1, sm: 1, md: 0 },
              position: "relative",
            }}
          >
            <IconButton onClick={toggleTheme}>
              {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
            <IconButton disabled>
              <Email />
            </IconButton>
            <IconButton disabled>
              <Notifications />
            </IconButton>
            <IconButton onClick={logout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {(isXs || isSm) && (
        <BottomNavigation
          sx={{ position: "fixed", bottom: 0, width: "100%", zIndnex: 10 }}
        >
          <BottomNavigationAction
            icon={
              mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />
            }
            onClick={toggleTheme}
          />
          <BottomNavigationAction icon={<Email />} />
          <BottomNavigationAction
            icon={<AddCircle sx={{ fontSize: 40 }} />}
            onClick={() => toggleDrawer(true)}
          />
          <BottomNavigationAction icon={<Notifications />} />
          <BottomNavigationAction icon={<Logout onClick={logout} />} />
        </BottomNavigation>
      )}
    </>
  );
}
