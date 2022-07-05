import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import login from '../pages/auth/Login'
import register from '../pages/auth/SignUp'
class Auth extends Component {
    render() {
        return (
            <div>
              <BrowserRouter>
              <Route exact path="/login" component={login} />
              <Route exact path="/regester" component={register} />
              </BrowserRouter>  
            </div>
        );
    }
}

export default Auth;
