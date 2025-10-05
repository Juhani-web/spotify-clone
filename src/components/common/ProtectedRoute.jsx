import { Navigate } from "react-router-dom";
import { getAccessTokenFromStorage } from "../../utils/getAccessTokenFromStorage.js";

const ProtectedRoute = ({ children }) => {
  const token = getAccessTokenFromStorage();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
