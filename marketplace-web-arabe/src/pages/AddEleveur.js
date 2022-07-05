import React, { Component } from "react";

class AddEleveur extends Component {
  render() {
    return (
      <div>
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="contact__form__title">
                  <h2>Ajouter  éleveur</h2>
                </div>
              </div>
            </div>
            <form action="#">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Nom" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Prénom" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Numéro de téléphone" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Poids" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Adresse" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Numéro de RIB" />
                </div>
               
                <div className="col-lg-12 ">
                  <input type="file" placeholder="Images" />
                </div>
                <div className="col-lg-12 text-center">
                 
                  <button type="submit" className="site-btn">
                    Ajouter
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddEleveur;
