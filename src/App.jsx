import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import Header from "@components/Header/Header";
import WorkSpace from "@components/Workspace/WorkSpace";
import Auth from "@components/Auth/Auth";
import ProtectedRoute from "@routes/ProtectedRoute";
import { AuthContext } from "@contexts/authContext";
import { useScreen } from "@contexts/screenContext";

export default function App() {
  const { isAuth, logout } = useContext(AuthContext);
  const { isXs, isSm } = useScreen();

  return (
    <div className="flex flex-col h-screen">
      <Routes>
        <Route
          path="/auth"
          element={isAuth ? <Navigate to="/workspace" /> : <Auth />}
        />
        <Route
          path="/workspace"
          element={
            <ProtectedRoute
              isAuth={isAuth}
              element={
                <>
                  {isXs || isSm ? (
                    <>
                      <WorkSpace />
                      <Header handleLogout={logout} />
                    </>
                  ) : (
                    <>
                      <Header handleLogout={logout} />
                      <WorkSpace />
                    </>
                  )}
                </>
              }
            />
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuth ? "/workspace" : "/auth"} />}
        />
      </Routes>
    </div>
  );
}
