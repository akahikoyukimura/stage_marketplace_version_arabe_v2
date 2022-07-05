import React, { Component } from "react";
import axios from "axios";

class SignUp extends Component {
  render() {
    return (
      <div>
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12"></div>
            </div>

            <form action="#" className="text-center">
              <center>
                {" "}
                <div className="row col-lg-6 col-md-6 text-center shoping__checkout">
                  <div className="col-lg-12 col-md-12">
                    <center>
                      {" "}
                      <br /> <h2 className="text-center">S'inscrire</h2>
                    </center>
                    <br />{" "}
                  </div>

                  <div className="col-lg-6 col-md-6">
                    <input type="text" placeholder="Nom*" />
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <input type="text" placeholder="Prénom" />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <input
                      type="text"
                      placeholder="Email*"
                      name="login"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <input
                      type="text"
                      placeholder="Numéro de téléphone*"
                      onChange={this.onChange}
                    />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <input
                      type="password"
                      placeholder="Mot de passe*"
                      name="password"
                    />
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <input type="text" placeholder="Adresse*" />
                  </div>
                  <br></br>
                  <div className="col-lg-12 text-center">
                    <button type="submit" className="site-btn">
                      S'inscrire
                    </button>
                    <br />
                    <br />
                    <i className="text-right">(*) Champs obligatoires</i>
                  </div>
                </div>
              </center>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
