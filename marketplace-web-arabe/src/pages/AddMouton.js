import React, { Component } from "react";

class AddMouton extends Component {
  render() {
    return (
      <div>
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="contact__form__title">
                  <h2>Ajouter annonce mouton</h2>
                </div>
              </div>
            </div>
            <form action="#">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Numéro de boucle" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Race" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Sexe" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Poids" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Localisation" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Prix" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Eleveur" />
                </div>
                <div className="col-lg-6 col-md-6">
                  <input type="text" placeholder="Avance" />
                </div>
                <div className="col-lg-12 ">
                  <input type="file" placeholder="Images" />
                </div>
                <div className="col-lg-12 text-center">
                  <textarea
                    placeholder="Description
"
                  ></textarea>
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

export default AddMouton;
