import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const isAuthenticated = () => {
  return localStorage.getItem("username") !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default PrivateRoute;
