import React, { Component } from 'react';

class login extends Component {
    render() {
        return (
            <div className="text-center">
                <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                
              </div>
            </div><centre>
            <form action="#" className="text-center">

            <center> <div className="row col-lg-6 col-md-6 text-center shoping__checkout">
            
                <div className="col-lg-12 col-md-12"><center> <br/> <h2 className="text-center">Se connecter</h2></center>
                <br/><br/> <input type="text" placeholder="Email ou Numéro de téléphone" />
                </div>
                <div className="col-lg-12 col-md-12">
                  <input type="password" placeholder="Password" />
                  
                </div>
               <br></br>
                <div className="col-lg-12 text-center">
                
                  
                  <button type="submit" className="site-btn">
                  Se connecter
                  </button><br/><br/><i className="text-right">Mot de passe oublié ? </i>
                </div>
              </div>
            </center></form></centre>
          </div>
        </div>
            </div>
        );
    }
}

export default login;