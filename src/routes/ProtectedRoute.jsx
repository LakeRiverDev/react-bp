import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, isAuth }) => {
  return isAuth ? element : <Navigate to="/auth" />;
};

export default ProtectedRoute;
