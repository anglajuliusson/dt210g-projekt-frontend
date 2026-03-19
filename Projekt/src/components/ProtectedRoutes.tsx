import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {

  // Hämtar token från localStorage
  const token = localStorage.getItem("token");

  // Om ingen token finns betyder det att användaren inte är inloggad
  // Då omdirigeras användaren till login-sidan
  if (!token) return <Navigate to="/login" replace />;

  // Om token finns (användaren är inloggad)
  // returneras den skyddade komponenten (children)
  return <>{children}</>;
}

export default ProtectedRoute;