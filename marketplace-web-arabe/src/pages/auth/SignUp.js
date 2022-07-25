import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";

import Loader from "react-loader-spinner";
// import { register } from "./UserFunctions";
class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      // first_name: "",
      // last_name: "",
      isChecked: false,
      email: "",
      password: "",
      conpassword: "",
      telephone: "",
      civilisation: "",
      loading: false,
      pays: "",
      ville: "",
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.register = this.register.bind(this);
  }

  handleChecked() {
    this.setState({ isChecked: !this.state.isChecked });
  }

  register = (newUser) => {
    return axios
      .post(
        "http://127.0.0.1:8000/api/register",
        {
          email: newUser.email,
          password: newUser.password,
          telephone: newUser.telephone,
          role: "Consommateur",
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
        const consommateur = {
          civilisation: this.state.civilisation,
          nom: this.state.nom,
          prenom: this.state.prenom,
          tel: this.state.telephone,
          email: this.state.email,
          adresse: this.state.adresse,
          pays: this.state.pays,
          ville: this.state.ville,
          favoris: [],
          panier: [],
          id_user: res.data.success.token.token.user_id,
        };

        axios
          .post("http://127.0.0.1:8000/api/consommateur", consommateur, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              //"Access-Control-Allow-Origin": "*",
              // Authorization: myToken,
            },
          })
          .then((res) => {
            const to = this.state.email;
            const url = "http://www.anoc.ma";
            //const myToken = `Bearer ` + localStorage.getItem("myToken");
            const content =
              "Bonjour " +
              this.state.prenom +
              ",\nMerci de vous étre inscrit sur LA Marketplace MyANOC . Nous sommes ravis de vous compter parmis nos clients!\nAvec nous, vous bénéficierez de:\nLes meilleurs prix au Maroc\nUne expérience shopping pratique\nNous vous invitons à profiter de votre liberté de acheter n'importe quand! Asseyez-vous et détendez-vous alors que nous nous efforçons de transformer votre expérience d'achat quotidienne en une expérience d’achat exceptionnelle.\nBonne journée,\n\nANOC\nAssociation Nationale des ovins et caprins\n" +
              url;
            const subject = "Votre compte ANOC MARKETPLACE a été créé  ";
            axios
              .post(
                "http://127.0.0.1:8000/api/sendmail/" + to + "/" + subject,
                { messagee: content },
                {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    //"Access-Control-Allow-Origin": "*",
                    // Authorization: myToken,
                  },
                }
              )
              .then((resultat) => {});
          });
        this.props.history.push("login");

        Swal.fire({
          title: "Compte créé",
          text: "Votre compte a été créé avec succès. Connectez-vous avec l'adresse mail ou le numéro renseignés",
          icon: "success",
          width: 400,
          heightAuto: false,
          confirmButtonColor: "#7fad39",

          confirmButtonText: "Ok!",
        });

        /*       .catch((error) => {
       Swal.fire({
         title: "Compte Erreur",
         text:
           "email numéro renseignés existants",
         icon: "error",
         width: 400,
         heightAuto: false,
         confirmButtonColor: "#7fad39",
   
         confirmButtonText: "Ok!",
       }); 
   }) */
      });
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleValidation() {
    let errors = {};
    let valide = true;

    if (this.state.telephone.length === 0) {
      errors["telephone"] = "Ce champs est obligatoire ";
      valide = false;
    }
    if (this.state.password.length === 0) {
      errors["password"] = "Ce champs est obligatoire ";
      valide = false;
    }
    if (this.state.isChecked === false) {
      errors["check"] = " Vous devez accepter les Conditions Générales ";
      valide = false;
    }

    if (
      this.state.conpassword !== this.state.password ||
      this.state.conpassword.length === 0
    ) {
      if (this.state.conpassword.length === 0) {
        errors["conpassword"] = "Ce champs est obligatoire ";
        valide = false;
      } else {
        errors["conpassword"] = "Entrez exactement le même mot de passe";
        valide = false;
      }
    }
    this.setState({ errors: errors });
    return valide;
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true }, () => {
      const user = {
        email: this.state.email,
        password: this.state.password,
        telephone: this.state.telephone,
      };

      if (this.handleValidation()) {
        this.register(user)
          .then((res) => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false });
            Swal.fire({
              /* title: "Erreur de connection",*/
              text: "Email ou numéro de télephone déjà existant",
              icon: "error",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok!",
            });
          });
      } else {
        this.setState({ loading: false });
      }
    });
  }
  render() {
    const { loading } = this.state;
    const styles = {
      control: (base) => ({
        ...base,
        fontFamily: "Times New Roman",
      }),
      menu: (base) => ({
        ...base,
        fontFamily: "Times New Roman",
      }),
    };

    return (
      <div>
        <style jsx>{`
          .shoping__checkout ul li span {
            color: black;
            font-weight: normal;
          }
        `}</style>
        <div className="contact-form spad">
          <div className="container">
            <div className="row">
              <div className="col-lg-12"></div>
            </div>
            <form action="#" className="text-center" onSubmit={this.onSubmit}>
              <center>
                {" "}
                <div
                  id="loginStyle"
                  className="row col-lg-6 col-md-6 text-center shoping__checkout"
                >
                  <div className="col-lg-12 col-md-12">
                    <center>
                      {" "}
                      <br /> <h2 className="text-center">S'inscrire</h2>
                    </center>
                    <br />{" "}
                  </div>
                  <div className="col-lg-6 col-md-6 form-check-inline">
                    <input
                      onChange={this.onChange}
                      style={{ transform: "scale(0.5)" }}
                      className="form-check-input"
                      type="radio"
                      name="civilisation"
                      value="Mr"
                    />
                    <label className="form-check-label mb-4 " htmlFor="Mr">
                      Monsieur
                    </label>
                    <input
                      onChange={this.onChange}
                      style={{ transform: "scale(0.5)" }}
                      className="form-check-input"
                      type="radio"
                      name="civilisation"
                      value="Mme"
                    />
                    <label className="form-check-label mb-4" htmlFor="Mme">
                      Madame
                    </label>
                  </div>
                  <div className="col-lg-6 col-md-6 "> </div>
                  <div className="col-lg-6 col-md-6 "> </div>
                  <div className="row col-lg-6 col-md-6 pr-0  pl-4 mb-4">
                    <div id="LoginIcon" className="col-lg-2 col-md-2 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa fa-user " aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-10 col-md-10 ">
                      <input
                        type="text"
                        placeholder="Nom"
                        name="nom"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row col-lg-6 col-md-6 pr-0  pl-4 mb-3 ml-3">
                    <div id="LoginIcon" className="col-lg-2 col-md-2 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa fa-user " aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-10 col-md-10 ">
                      <input
                        type="text"
                        placeholder="Prenom"
                        name="prenom"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row col-lg-12 col-md-12 pr-0  pl-4 mb-4">
                    <IntlTelInput
                      preferredCountries={["tw"]}
                      style={{ width: "100%" }}
                      name="telephone"
                      inputClassName="form-control"
                      onPhoneNumberChange={(
                        status,
                        value,
                        countryData,
                        number,
                        id
                      ) => {
                        this.setState({
                          telephone: number.replace(/-/g, "").replace(/ /g, ""),
                        });
                      }}
                      onPhoneNumberBlur={(
                        status,
                        value,
                        countryData,
                        number,
                        id
                      ) => {
                        this.setState({
                          telephone: number.replace(/-/g, "").replace(/ /g, ""),
                        });
                      }}
                      onSelectFlag={(num, country) => {
                        if (
                          country.name.includes("(") &&
                          country.name.includes(")")
                        ) {
                          this.setState({
                            pays: country.name.slice(
                              country.name.indexOf("(") + 1,
                              country.name.indexOf(")")
                            ),
                          });
                        } else {
                          this.setState({ pays: country.name });
                        }
                      }}
                      formatOnInit={false}
                    />{" "}
                    <span className="text-danger">
                      {this.state.errors["telephone"]}
                    </span>
                  </div>
                  <div className="row col-lg-12 col-md-12 pr-0  pl-4 mb-4">
                    <div id="LoginIcon" className="col-lg-1 col-md-1 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa  fa-lock " aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-11 col-md-11 ">
                      <input
                        type="password"
                        placeholder="Mot de passe*"
                        name="password"
                        onChange={this.onChange}
                      />
                    </div>{" "}
                    <span className="text-danger">
                      {this.state.errors["password"]}
                    </span>
                  </div>
                  <div className="row col-lg-12 col-md-12 pr-0  pl-4 mb-4">
                    <div id="LoginIcon" className="col-lg-1 col-md-1 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa  fa-lock " aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-11 col-md-11 ">
                      <input
                        type="password"
                        placeholder="Confirmer le mot de passe*"
                        name="conpassword"
                        onChange={this.onChange}
                      />
                    </div>{" "}
                    <span className="text-danger">
                      {this.state.errors["conpassword"]}
                    </span>
                  </div>
                  <div className="row col-lg-12 col-md-12 pr-0  pl-4 mb-4">
                    <div id="LoginIcon" className="col-lg-1 col-md-1 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-11 col-md-11 ">
                      <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="row col-lg-12 col-md-12 pr-0  pl-4 mb-4">
                    <div id="LoginIcon" className="col-lg-1 col-md-1 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa fa-map-marker " aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-11 col-md-11 ">
                      <input
                        type="text"
                        placeholder="Adresse"
                        name="adresse"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <br></br> <br></br>
                  <div className="row col-lg-12 col-md-12 pr-0  pl-4 mb-5">
                    <div id="LoginIcon" className="col-lg-1 col-md-1 ">
                      <p></p>
                      <span className="symbol-input100">
                        <i className="fa fa-map-marker " aria-hidden="true"></i>
                      </span>{" "}
                    </div>
                    <div id="LoginIcon" className="col-lg-11 col-md-11 ">
                      <input
                        type="text"
                        placeholder="ville"
                        name="ville"
                        onChange={this.onChange}
                      />
                    </div>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      name="remember"
                      className="custom-control-input"
                      id="checkbox-1"
                      onChange={() => this.handleChecked()}
                      checked={this.state.isChecked}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="checkbox-1"
                      onChange={() => this.handleChecked()}
                      checked={this.state.isChecked}
                    >
                      J'accepte{" "}
                      <a
                        style={{
                          color: "#7fad39",
                          textDecoration: "underline",
                        }}
                        href=""
                      >
                        les conditions generales d'utilisation{" "}
                      </a>
                    </label>
                    <br></br>
                    <span className="text-danger ">
                      {this.state.errors["check"]}
                    </span>
                  </div>
                  <br></br> <br></br>
                  <div className="col-lg-12 text-center">
                    {loading ? (
                      <div
                        style={{
                          width: "100%",
                          height: "40rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Loader
                          type="Oval"
                          color="#7fad39"
                          height="50"
                          width="50"
                        />
                      </div>
                    ) : (
                      <button type="submit" className="site-btn mt-5">
                        S'inscrire
                      </button>
                    )}
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
