import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios";
class changePasswordLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      email: "",
      password: "",
      password_confirmation: "",
      redirect: true,
      loading: false,
      // timeConnexion: new(Date),
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.extractParamsUrl = this.extractParamsUrl.bind(this);
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  extractParamsUrl(chaineGET) {
    var valeur = chaineGET.split("=")[1];
    console.log(chaineGET.split("=")[1]);
    this.setState({ token: valeur });
  }

  onSubmit(e) {
    var url = window.location.href;
    var toke = this.extractParamsUrl(url);
    console.log(this.state.token);
    e.preventDefault();
    const adress = this.state.email;
    console.log(this.state.email);
    this.setState({ loading: true }, () => {
      axios
        .post(
          "http://127.0.0.1:8000/api/password/reset",
          {
            email: adress,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
            token: this.state.token,
          },
          {
            headers: {
              // "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              Accept: "application/json",
              //Authorization: myToken,
              // "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((res) => {
          this.props.history.push("/ToutesLesAnnonces");
          this.setState({ loading: false });
          Swal.fire({
            title: "Mot de Passe modifié!",
            text: "Connectez-vous avec le nouveau mot de passe.",
            icon: "success",
            width: 400,
            heightAuto: false,
            confirmButtonColor: "#7fad39",

            confirmButtonText: "Ok",
          });
        })
        .catch((err) => {
          this.setState({ loading: false });
          console.log(err.response.data.error);
          if (
            err.response.data.error === "This password reset token is invalid."
          ) {
            Swal.fire({
              /* title: "Erreur de connection",*/
              text: "Lien de réinitailisation déja expiré. Veuillez reprendre la réinitialisation!",
              icon: "info",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          } else if (
            err.response.data.error ===
            "We can't find a user with that e-mail address."
          ) {
            Swal.fire({
              /* title: "Erreur de connection",*/
              text: "Votre email est incorrect!",
              icon: "error",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          } else if (this.state.password_confirmation != this.state.password) {
            Swal.fire({
              /* title: "Erreur de connection",*/
              text: "Les mots de passe saisis ne sont pas identiques. Veuillez saisir le même mot de passe !",
              icon: "error",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          } else {
            Swal.fire({
              title: "Oooops...",
              text: "Erreur Serveur",
              icon: "info",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok",
            });
          }
        });
    });
  }
  render() {
    const { loading } = this.state;
    return (
      <div className="text-center">
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12"></div>
            </div>
            <centre>
              <form
                action="#"
                className="text-center"
                noValidate
                onSubmit={this.onSubmit}
              >
                <center>
                  {" "}
                  <div
                    id="loginStyle"
                    className="row col-lg-6 col-md-6 text-center shoping__checkout"
                  >
                    <div className="col-lg-12 col-md-12">
                      <center>
                        {" "}
                        <br />{" "}
                        <h2 className="text-center">Nouveau Mot de Passe</h2>
                      </center>
                      <br />
                      <br />{" "}
                      <div className="row">
                        <div id="LoginIcon" className="col-lg-1 col-md-1">
                          <p></p>
                          <span className="symbol-input100">
                            <i
                              className="fa fa-envelope"
                              aria-hidden="true"
                            ></i>
                          </span>{" "}
                        </div>
                        <div id="LoginIcon" className="col-lg-11 col-md-11">
                          <input
                            type="text"
                            placeholder="Email "
                            aria-hidden="true"
                            name="email"
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                      <p></p>
                      <div className="row">
                        <div id="LoginIcon" className="col-lg-1 col-md-1">
                          <p></p>
                          <span className="symbol-input100">
                            <i className="fa fa-lock" aria-hidden="true"></i>
                          </span>{" "}
                        </div>
                        <div id="LoginIcon" className="col-lg-11 col-md-11">
                          <input
                            type="password"
                            placeholder="Mot de Passe"
                            name="password"
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                      <p></p>
                      <div className="row">
                        <div id="LoginIcon" className="col-lg-1 col-md-1">
                          <p></p>
                          <span className="symbol-input100">
                            <i className="fa fa-lock" aria-hidden="true"></i>
                          </span>{" "}
                        </div>
                        <div id="LoginIcon" className="col-lg-11 col-md-11">
                          <input
                            type="password"
                            placeholder="Confirmation Mot de Passe"
                            name="password_confirmation"
                            onChange={this.onChange}
                          />
                        </div>
                      </div>
                      <p></p>
                    </div>
                    <p></p>
                    <div className="col-lg-12 text-center">
                      <p></p>
                      {loading ? (
                        <div
                          style={{
                            width: "100%",
                            height: "40rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        ></div>
                      ) : (
                        <button type="submit" className="site-btn">
                          Confirmer
                        </button>
                      )}
                      <p></p>
                    </div>
                  </div>
                </center>
              </form>
            </centre>
          </div>
        </div>
      </div>
    );
  }
}
export default changePasswordLink;
