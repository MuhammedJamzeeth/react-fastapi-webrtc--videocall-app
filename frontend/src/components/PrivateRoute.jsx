import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const isAuthenticated = () => {
  return localStorage.getItem("authToken") === null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PrivateRoute;
