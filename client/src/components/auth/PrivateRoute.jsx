import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../../services/auth';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const token = getToken();
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  return (
    <Route
      {...rest}
      render={(props) =>
        token && (!roles || roles.includes(userRole)) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;