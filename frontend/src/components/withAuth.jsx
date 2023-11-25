import { Navigate } from "react-router-dom";

const withAuth = (ComponentToProtect) => {
  const Auth = (props) => {
    const accessToken =  localStorage.getItem("accessToken");
    if (accessToken) {
      return <ComponentToProtect {...props} />;
    } else {
      return <Navigate to="/login" state={{ path: location.pathname }} />;
    }
  };
  return Auth;
};

export default withAuth;
