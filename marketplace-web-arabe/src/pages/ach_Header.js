import React, { Component } from "react";
import axios from "axios";
import { GiSheep } from "react-icons/gi";
import { MdAssignment } from "react-icons/md";
import { AiFillHeart, AiOutlineSearch } from "react-icons/ai";
import {
  FaShoppingCart,
  FaUserAlt,
  FaUniversity,
  FaSearch,
} from "react-icons/fa";
import Swal from "sweetalert2";

class Header extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      isLoged: false,
      connectedUser: "",
      connectedUserEmail: "",
      colorMenuAc: "#28a745",
      colors: [],
      commandes: null,
    };
    // this.HandelLogout = this.HandelLogout.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    function appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    }

    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getFullYear() +
      "-" +
      appendLeadingZeroes(current_datetime.getMonth() + 1) +
      "-" +
      appendLeadingZeroes(current_datetime.getDate()) +
      " " +
      appendLeadingZeroes(current_datetime.getHours()) +
      ":" +
      appendLeadingZeroes(current_datetime.getMinutes()) +
      ":" +
      appendLeadingZeroes(current_datetime.getSeconds());

    const expiredTimeToken = localStorage.getItem("expiredTimeToken");
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");

    if (token && expiredTimeToken > formatted_date) {
      if (
        window.location.pathname == "/Commandes" &&
        window.sessionStorage.getItem("ids") &&
        window.sessionStorage.getItem("ids").length > 0
      ) {
        Swal.fire({
          title: "Changement annuler ",
          icon: "error",
          width: 400,
          heightAuto: false,
          timer: 1500,
          showConfirmButton: false,
        });
        window.sessionStorage.setItem("ids", []);
      }
      this.setState({ isLoged: true });
      axios
        .get("http://127.0.0.1:8000/api/consommateur/" + token, {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": Mytoken,
          },
        })

        .then((res) => {
          this.setState({
            connectedUser: res.data.nom.toUpperCase() + " " + res.data.prenom,
            connectedUserEmail: res.data.email,
          });
        });

      // get panier length
      axios
        .get(
          "http://127.0.0.1:8000/api/consommateur/" +
            token +
            "/panier?statut=disponible",
          {
            headers: {
              "Content-Type": "application/json",
              // "Authorization": Mytoken,
            },
          }
        )

        .then((res) => {
          this.setState({
            commandes: res.data.filter(
              (Paniers) => Paniers.statut === "disponible"
            ).length,
          });
          console.log(this.state.commandes);
        });
      // this.props.history.push("/login");

      //Ce bout de code permet de vérifier les commandes avec un deadline dépassé et les annuler
      // avec envoie d'un email au consommateur relatif à la commande pour l'informer de l'annulation automatique
      // var now = new Date("22 Jul 2020 16:00:00 GMT");
      var now = new Date();
      axios
        .get(
          "http://127.0.0.1:8000/api/commandes/",

          {
            headers: {
              Authorization: myToken,
            },
          }
        )
        .then((res) => {
          var resultat = res.data;
          for (let i = 0; i < res.data.length; i++) {
            var statutCmd = res.data[i].statut;
            var deadline = res.data[i].deadline;
            var dd = new Date(
              deadline.substr(6, 4),
              deadline.substr(3, 2) - 1,
              deadline.substr(0, 2),
              deadline.substr(12, 2),
              deadline.substr(15, 2),
              deadline.substr(18, 2)
            );
            if (
              now.getTime() >= dd.getTime() &&
              (statutCmd === "en attente de paiement avance" ||
                statutCmd === "en attente de paiement du reste" ||
                statutCmd === "en attente de validation complément" ||
                statutCmd === "reçu avance refusé" ||
                statutCmd === "reçu reste refusé" ||
                (res.data[i].ancien_statut === " avarié_changement" &&
                  (statutCmd === "en attente de paiement avance" ||
                    statutCmd === "en attente de paiement du reste")))
            ) {
              axios
                .put(
                  "http://127.0.0.1:8000/api/commande/" + res.data[i]._id,
                  {
                    //   msg_refus_avance: this.state.dataUrl,
                    statut: "commande annulée (deadline dépassé)",
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: myToken,
                    },
                  }
                )
                .then(() => {
                  const to = this.state.connectedUserEmail;
                  const content =
                    "Votre commande a été annulée automatiquement car vous avez dépassé le deadline prévu pour l'importation de votre reçu de paiement.";
                  const subject =
                    "Votre commande a été annulée (dépassement du deadline)";
                  axios.post(
                    "http://127.0.0.1:8000/api/sendmail/" +
                      to +
                      "/" +
                      content +
                      "/" +
                      subject,
                    {
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",

                        // "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                });
            }
          }
        });
    } else if (!token || expiredTimeToken < formatted_date) {
      // this.props.history.push("/login");
      this.setState({
        isLoged: false,
      });
    }
  }

  logout() {
    this.setState(
      {
        isLoged: false,
      },
      () => {
        localStorage.removeItem("usertoken");
        localStorage.removeItem("myToken");
        localStorage.removeItem("commandes");
        localStorage.removeItem("ids");
        localStorage.removeItem("reponses");
      }
    );
  }

  render() {
    /** active menu item */
    var { colors } = this.state;
    const CSS = ` .header__menu ul li:hover>a {color:black !important; text-decoration: underline; background-color: transparent !important;} .humberger__menu__wrapper .slicknav_nav a {color:black}	.humberger__menu__wrapper .slicknav_nav a:hover  {text-decoration: underline; color:black}`;
    switch (window.location.pathname) {
      case "/":
        colors[0] = this.state.colorMenuAc;
        break;
      case "/ToutesLesAnnonces":
        colors[0] = this.state.colorMenuAc;
        break;
      case "/AnnoncesParEleveurs":
        colors[1] = this.state.colorMenuAc;
        break;
      case "/commandesParStatut":
        colors[2] = this.state.colorMenuAc;
        break;
      case "/Favoris":
        colors[3] = this.state.colorMenuAc;
        break;
      case "/panier":
        colors[4] = this.state.colorMenuAc;
        break;
      case "/Regles":
        colors[5] = this.state.colorMenuAc;
        break;
      case "/Apropos":
        colors[6] = this.state.colorMenuAc;
        break;
    }
    /** */
    return (
      <>
        <style>{CSS}</style>
        <header className="header">
          {/* Comment goes here */}
          <div className="header__top">
            <div
              className="container"
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
            >
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="header__top__left">
                    <div className="header__logo">
                      <a href="./">
                        <img
                          style={{ height: "70px" }}
                          src="/Images/myanoc.jpg"
                          alt=""
                        />
                        <img
                          style={{ height: "40px" }}
                          src={require("./Images/logo-text.png")}
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="header__top__right">
                    <div className="header__top__right__button item">
                      <div className="rulesButton">
                        <i className="fa fa-gavel" aria-hidden="true"></i>
                        <a
                          href="./Regles"
                          style={{
                            textDecoration: "none",
                            color: "white",
                            fontSize: "1rem",
                          }}
                        >
                          {" "}
                          Règles de vente et d'achat
                        </a>
                      </div>
                    </div>
                    {this.state.isLoged ? (
                      <div className="header__top__right__auth  item">
                        <div>
                          <a
                            style={{
                              color: "#009141",
                              fontFamily: "inherit",
                              fontSize: "0.924rem",
                            }}
                            href="/Compte"
                          >
                            <i className="fa fa-user-circle" />
                            <b>{" " + this.state.connectedUser}</b>
                          </a>
                        </div>
                      </div>
                    ) : null}
                    <div className="header__top__right__auth  item">
                      {this.state.isLoged ? (
                        <div>
                          {" "}
                          <a
                            style={{
                              fontFamily: "inherit",
                              fontSize: "0.924rem",
                            }}
                            href="/login"
                            onClick={this.logout}
                          >
                            <i className="fa fa-sign-out">
                              <b>Se déconnecter</b>{" "}
                            </i>
                          </a>
                        </div>
                      ) : null}
                      {!this.state.isLoged ? (
                        <div>
                          {" "}
                          <a
                            style={{
                              fontFamily: "inherit",
                              fontSize: "0.924rem",
                            }}
                            href="/login"
                          >
                            <i className="fa fa-sign-in">
                              {" "}
                              <b> Se connecter</b>{" "}
                            </i>
                          </a>
                        </div>
                      ) : null}
                    </div>

                    {/* {
                      <div className="header__top__right__language item ">
                        <i className="fa fa-globe mr-2" aria-hidden="true">
                          {" "}
                        </i>
                        <div> Français</div>
                        <span className="arrow_carrot-down"></span>
                        <ul>
                          <li>
                            <a href="#">Français</a>
                          </li>
                          <li>
                            <a href="#"> العربية</a>
                          </li>
                        </ul>
                      </div>
                    } */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <!-- Humberger Begin --> */}
        <header className="header sticky_header">
          <div style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <div>
              <div
                className="col"
                style={{
                  paddingLeft: "0px",
                  paddingRight: "0px",
                  position: "sticky",
                  top: 0,
                }}
              >
                <nav className="header__menu">
                  <ul>
                    <li className="">
                      <div>
                        {" "}
                        <a style={{ color: colors[0] }} href="./">
                          <GiSheep className=" mr-1 fa-lg " />
                          Nos espèces
                        </a>
                      </div>
                    </li>
                    <li className="">
                      <div>
                        {" "}
                        <a
                          style={{ color: colors[1] }}
                          href="./AnnoncesParEleveurs"
                          className="Header"
                        >
                          <FaUserAlt className="  mb-1 " /> Nos éleveurs
                        </a>
                      </div>
                    </li>
                    {this.state.isLoged ? (
                      <span>
                        <li>
                          <div>
                            {" "}
                            <a
                              style={{ color: colors[2] }}
                              className="Header"
                              href="./commandesParStatut"
                            >
                              <MdAssignment className="  fa-lg " /> Mes
                              commandes
                            </a>
                          </div>
                        </li>
                        <span className="form-inline my-2 my-lg-0">
                          <li>
                            <div>
                              {" "}
                              <a
                                style={{ color: colors[3] }}
                                className="Header"
                                href="./Favoris"
                              >
                                <AiFillHeart className=" fa-lg " /> Mes favoris
                              </a>
                            </div>
                          </li>

                          <li>
                            <div>
                              {" "}
                              <a
                                className="Header"
                                style={{ color: colors[4] }}
                                href="./panier"
                              >
                                <FaShoppingCart className="fa-sm mb-1 " /> Mon
                                panier d'achat
                                {this.state.commandes > 0 ? (
                                  <span
                                    style={{
                                      width: "23px",
                                      height: "23px",
                                      borderRadius: "50%",
                                      background: "#fe6927",
                                      color: "white",
                                      fontWeight: "bold",
                                      position: "absolute",
                                      zIndex: "10",
                                      marginLeft: "0.5em",
                                      top: "auto",
                                      bottom: "auto",
                                      paddingTop: "initial",
                                    }}
                                  >
                                    {this.state.commandes}
                                  </span>
                                ) : null}
                              </a>
                            </div>
                          </li>
                        </span>
                      </span>
                    ) : null}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="humberger__open">
              <i className="fa fa-bars"></i>
            </div>
          </div>
        </header>
        <div className="humberger__menu__overlay"></div>
        <div className="humberger__menu__wrapper">
          <div className="humberger__menu__logo">
            <a href="#">
              <img src="/Images/myanoc.jpg" alt="" />
            </a>
          </div>

          <div className="humberger__menu__widget">
            {this.state.isLoged ? (
              <div className="header__top__right__language ">
                <div>
                  <h6 style={{ color: "#009141" }}>
                    <i className="fa fa-user-circle" />{" "}
                    {this.state.connectedUser}
                  </h6>
                </div>
              </div>
            ) : null}
            <br></br>
            {/*}  <i className="fa fa-globe" aria-hidden="true"></i>      <div>Français</div>
              <span className="arrow_carrot-down"></span>
              <ul>
                <li>
                  <a href="#">Français</a>
                </li>
                <li>
                  <a href="#">العربية</a>
                </li>
              </ul>*/}
          </div>
          <nav className="humberger__menu__nav mobile-menu">
            <ul>
              <li className="active">
                <a
                  className="Header"
                  href="./ToutesLesAnnonces"
                  style={{ color: colors[0] }}
                >
                  {" "}
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "15%" }}>
                      {" "}
                      <GiSheep
                        className=" mr-1 fa-lg "
                        style={{ width: "1em" }}
                      />{" "}
                    </div>
                    <div>Nos Espèces </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  className="Header"
                  style={{ color: colors[1] }}
                  href="./AnnoncesParEleveurs"
                >
                  {" "}
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    {" "}
                    <div style={{ width: "15%" }}>
                      {" "}
                      <FaUserAlt className="  mb-1 " />{" "}
                    </div>
                    <div>Nos éleveurs</div>
                  </div>
                </a>
              </li>
              {this.state.isLoged ? (
                <span>
                  <li>
                    <a
                      className="Header"
                      href="./Favoris"
                      style={{ color: colors[3] }}
                    >
                      {" "}
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "15%" }}>
                          {" "}
                          <AiFillHeart className=" fa-lg " />
                        </div>
                        <div> Mes favoris</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a
                      className="Header"
                      href="./panier"
                      style={{ color: colors[4] }}
                    >
                      {" "}
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "15%" }}>
                          {" "}
                          <FaShoppingCart className="fa-sm mb-1 " />
                        </div>
                        <div> Mon panier d'achat</div>
                      </div>{" "}
                    </a>
                  </li>
                  <li>
                    <a
                      className="Header"
                      href="./commandesParStatut"
                      style={{ color: colors[2] }}
                    >
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "15%" }}>
                          {" "}
                          <MdAssignment className="  fa-lg " />
                        </div>
                        <div> Mes commandes</div>
                      </div>{" "}
                    </a>
                  </li>
                </span>
              ) : null}

              <li>
                <a style={{ color: colors[6] }} href="./Apropos">
                  {" "}
                  <div style={{ display: "flex" }}>
                    <div style={{ width: "15%", paddingLeft: "3px" }}>
                      {" "}
                      <FaSearch className=" fa-sm  " />
                    </div>
                    <div> A propos de nous</div>
                  </div>{" "}
                </a>
              </li>
            </ul>
          </nav>

          <div id="mobile-menu-wrap"></div>
          <div className="header__top__right__auth">
            {this.state.isLoged ? (
              <div>
                {" "}
                <a href="/login" onClick={this.logout}>
                  <i className="fa fa-sign-out"> Se déconnecter</i>
                </a>
              </div>
            ) : null}
            {!this.state.isLoged ? (
              <div>
                {" "}
                <a href="/login">
                  <i className="fa fa-sign-in"> Se connecter</i>
                </a>
              </div>
            ) : null}
          </div>
        </div>
        {/* <!-- Humberger End -->*/}
      </>
    );
  }
}

export default Header;
