import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import HomePage from './pages/HomePage';
import QRViewPage from './pages/QRViewPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/qr/:id" component={QRViewPage} />
        <PrivateRoute path="/admin" component={AdminPage} roles={['admin']} />
        <PrivateRoute path="/user" component={UserPage} />
      </Switch>
    </Router>
  );
}

export default App;