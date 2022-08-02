import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FormattedMessage } from "react-intl";

const intl = JSON.parse(localStorage.getItem("intl"));

class CommandesParStatut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      Commandes: [],
      deadline: [],
      delivery: "",
      redirect: false,
      Livraison: [],
    };
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

    if (!token || expiredTimeToken < formatted_date) {
      this.props.history.push("/login");
    } else {
      this.setState({ loading: true }, () => {
        axios
          .get("http://127.0.0.1:8000/api/commandes/dashboard", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
              Authorization: myToken,
            },
            params: {
              id_consommateur: token,
              order_by: "date_creation",
              order_mode: "asc",
            },
          })

          .then((res) => {
            this.setState({
              Commandes: res.data.count,
              deadline: res.data.deadline,
              delivery: res.data.delivery,
              loading: false,
            });
          });
      });
    }
  }

  render() {
    const { loading } = this.state;
    console.log(this.state.Commandes);
    //commandes annulees
    const cmdAnnulee = this.state.Commandes[0];

    //Avances a payer
    const cmdAvancePayer = this.state.Commandes[1];

    //Produit réservé
    const cmdReserve = this.state.Commandes[2];

    // Reste à payer
    const cmdRestePayer = this.state.Commandes[3];

    //Produit à livrer
    const cmdLivrer = this.state.Commandes[4];

    //Produit Complement
    const cmdComplement = this.state.Commandes[5];

    //Paiement Cash à payer
    const cmdCashPayer = this.state.Commandes[6];

    //Paiement cash effectué
    const cmdCashDone = this.state.Commandes[7];

    return (
      <div>
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
            <br></br>
            <Loader type="Oval" color="#7fad39" height="100" width="80" />
          </div>
        ) : (
          <center>
            <div>
              <section style={localStorage.getItem("lg")=="ar"?{"direction":"rtl"}:{}} className="featured spad">
                <div className="container">
                  {/*<!-- Categorie Menus Grid Section Begin --> */}
                  <div className="row justify-content-center">
                    {/* comment utiliser*/}
                    <div className="col-lg-3 col-md-8 col-sm-8">
                      <Link
                        to={
                          cmdComplement == 0
                            ? {
                                pathname: "/dashHelp",
                              }
                            : {
                                pathname: "/Commandes",
                                state: {
                                  id: "en attente de paiement du complément",
                                },
                              }
                        }
                      >
                        {" "}
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic"
                            // data-setbg="Images/bg_purple.jpg"
                            style={{
                              backgroundImage:
                                "url(" +
                                require("./Images/bg_orange.jpg") +
                                ")",
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            {cmdComplement > 0 ? (
                              <span
                                style={{
                                  color: "#bb2124",
                                  position: "relative",
                                  right: "31%",
                                }}
                                className="  text-left "
                              >
                                <FormattedMessage id="cmd_statut_dernier_delai"/>{" "}
                                {this.state.deadline[2].substr(6, 4) +
                                  "/" +
                                  this.state.deadline[2].substr(3, 2) +
                                  "/" +
                                  this.state.deadline[2].substr(0, 2)}
                              </span>
                            ) : null}
                            <a href="" id="dashboardLink">
                              <center>
                                <br></br>{" "}
                                <img
                                  src="Images/info.png"
                                  width="95px"
                                  height="95px"
                                  alt=""
                                />
                                <h4 style={{ color: "white" }}>
                                  <br></br>
                                  {cmdComplement == 0
                                    ? <FormattedMessage id="cmd_statut_comment_utiliser"/>
                                    : <FormattedMessage id="cmd_statut_compliments_a_payer"/>}
                                </h4>
                                <br></br>
                                <br></br>
                              </center>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* avance 1/4 */}
                    <div className="col-lg-3 col-md-8 col-sm-8">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de paiement avance" },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            style={{
                              width: "30px",
                              height: "25px",
                              borderRadius: "20px",
                              background: "white",
                              color: "green",
                              fontWeight: "bold",
                              position: "absolute",
                              zIndex: "10",
                              margin: "15px",
                            }}
                          >
                            1/4{" "}
                          </div>
                          <div
                            className="featured__item__pic"
                            // data-setbg="Images/bg_red.jpg"
                            style={{
                              backgroundImage:
                                "url(" + require("./Images/bg_bleu.jpg") + ")",
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            {/* {cmdAvancePayer > 0 ? (
                              <span
                                style={{
                                  color: "#bb2124",
                                  position: "relative",
                                  right: "31%",
                                }}
                                className="  text-left"
                              >
                                Dernier delai :{" "}
                                {this.state.deadline[0].substr(6, 4) +
                                  "/" +
                                  this.state.deadline[0].substr(3, 2) +
                                  "/" +
                                  this.state.deadline[0].substr(0, 2)}
                              </span>
                            ) : null} */}

                            <a href="" id="dashboardLink">
                              <center>
                                <br></br>{" "}
                                <img
                                  src="Images/waiting_payment.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                  <FormattedMessage id="cmd_statut_avances"/>
                                </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>
                                    {cmdAvancePayer}{" "}
                                    <img
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        marginBottom: "8px",
                                      }}
                                      data-imgbigurl="Images/sheep-headB.png"
                                      src="Images/sheep-headB.png"
                                      alt=""
                                    />
                                  </b>
                                </h2>
                                <br></br>
                              </center>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* reservé 2/4 */}
                    <div className="col-lg-3 col-md-8 col-sm-8">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de validation avance" },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            style={{
                              width: "30px",
                              height: "25px",
                              borderRadius: "20px",
                              background: "white",
                              color: "green",
                              fontWeight: "bold",
                              position: "absolute",
                              zIndex: "10",
                              margin: "15px",
                            }}
                          >
                            2/4{" "}
                          </div>

                          <div
                            style={{
                              backgroundImage:
                                "url(" + require("./Images/bg_bleu.jpg") + ")",
                            }}
                            className="featured__item__pic "
                            // data-setbg="Images/bg_bleu.jpg"
                            padding-left="10px"
                            padding-right="10px"
                          >
                            <a href="" id="dashboardLink">
                              <center>
                                <br></br>{" "}
                                <img
                                  src="Images/hourglass.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                  <FormattedMessage id="cmd_statut_produit_reserve"/>
                                </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>
                                    {cmdReserve}{" "}
                                    <img
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        marginBottom: "8px",
                                      }}
                                      data-imgbigurl="Images/sheep-headB.png"
                                      src="Images/sheep-headB.png"
                                      alt=""
                                    />
                                  </b>
                                </h2>
                              </center>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* cash a payer */}
                    {cmdCashDone || cmdCashPayer ? (
                      <>
                        {" "}
                        <div className="col-lg-3 col-md-8 col-sm-8">
                          <Link
                            to={{
                              pathname: "/Commandes",
                              state: { id: "en attente de paiement cash" },
                            }}
                          >
                            <div id="cadre" className="featured__item">
                              <div
                                style={{
                                  backgroundImage:
                                    "url(" +
                                    require("./Images/bg_green.png") +
                                    ")",
                                }}
                                className="featured__item__pic "
                                // data-setbg="Images/bg_bleu.jpg"
                                padding-left="10px"
                                padding-right="10px"
                              >
                                <a href="" id="dashboardLink">
                                  <center>
                                    <br></br>{" "}
                                    <img
                                      src="Images/hourglass.png"
                                      width="95px"
                                      height="95px"
                                    />
                                    <br></br>
                                    <br></br>
                                    <h4 style={{ color: "white" }}>
                                      <FormattedMessage id="cmd_statut_paiment_cash_a_payer"/>
                                    </h4>
                                    <br></br>
                                    <h2 style={{ color: "white" }}>
                                      <b>
                                        {cmdCashPayer}{" "}
                                        <img
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            marginBottom: "8px",
                                          }}
                                          data-imgbigurl="Images/sheep-headB.png"
                                          src="Images/sheep-headB.png"
                                          alt=""
                                        />
                                      </b>
                                    </h2>
                                  </center>
                                </a>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="row justify-content-center">
                    {/* commande annuler*/}
                    <div className="col-lg-3 col-md-8 col-sm-8">
                      <Link
                        to={{
                          pathname: "/Commandes",

                          state: {
                            id: "commande annulée (deadline dépassé)#reçu avance refusé#reçu reste refusé#reçu complément refusé#avarié#rejetée#annulée manuellement#remboursement#avarié_changement#avarié_remboursement#avarié_annulé",
                          },
                        }}
                      >
                        {" "}
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic"
                            // data-setbg="Images/bg_purple.jpg"
                            style={{
                              backgroundImage:
                                "url(" +
                                require("./Images/bg_orange1.jpg") +
                                ")",
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            <a href="" id="dashboardLink">
                              <center>
                                <br></br>{" "}
                                <img
                                  src="Images/sad.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                  <FormattedMessage id="cmd_statut_annule"/>{" "}
                                </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>
                                    {cmdAnnulee}{" "}
                                    <img
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        marginBottom: "8px",
                                      }}
                                      data-imgbigurl="Images/sheep-headB.png"
                                      src="Images/sheep-headB.png"
                                      alt=""
                                    />
                                  </b>
                                </h2>
                                <br></br>
                              </center>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* reste 3/4 */}
                    <div className="col-lg-3 col-md-8 col-sm-8">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de paiement du reste" },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            style={{
                              width: "30px",
                              height: "25px",
                              borderRadius: "20px",
                              background: "white",
                              color: "green",
                              fontWeight: "bold",
                              position: "absolute",
                              zIndex: "10",
                              margin: "15px",
                            }}
                          >
                            3/4{" "}
                          </div>

                          <div
                            className="featured__item__pic "
                            // data-setbg="Images/bg_red1.jpg"
                            style={{
                              backgroundImage:
                                "url(" + require("./Images/bg_bleu.jpg") + ")",
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            {cmdRestePayer > 0 ? (
                              <span
                                style={{
                                  color: "#bb2124",
                                  position: "relative",
                                  right: "31%",
                                }}
                                className="  text-left  "
                              >
                                <FormattedMessage id="cmd_statut_dernier_delai"/>{" "}
                                {this.state.deadline[1].substr(6, 4) +
                                  "/" +
                                  this.state.deadline[1].substr(3, 2) +
                                  "/" +
                                  this.state.deadline[1].substr(0, 2)}
                              </span>
                            ) : null}
                            <a href="" id="dashboardLink">
                              <center>
                                <br></br>{" "}
                                <img
                                  src="Images/waiting_payment.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                <FormattedMessage id="cmd_statut_reste_a_payer"/>
                                </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>
                                    {cmdRestePayer}{" "}
                                    <img
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        marginBottom: "8px",
                                      }}
                                      data-imgbigurl="Images/sheep-headB.png"
                                      src="Images/sheep-headB.png"
                                      alt=""
                                    />
                                  </b>
                                </h2>
                              </center>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* livrer 4/4 */}
                    <div className="col-lg-3 col-md-8 col-sm-8">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: {
                            id: "validé#en attente de validation reste#en attente de validation du complément",
                          },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            style={{
                              width: "30px",
                              height: "25px",
                              borderRadius: "20px",
                              background: "white",
                              color: "green",
                              fontWeight: "bold",
                              position: "absolute",
                              zIndex: "10",
                              margin: "15px",
                            }}
                          >
                            4/4{" "}
                          </div>

                          <div
                            className="featured__item__pic "
                            // data-setbg="Images/bg_green1.jpg"
                            style={{
                              backgroundImage:
                                "url(" + require("./Images/bg_bleu.jpg") + ")",
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            {cmdLivrer > 0 && this.state.delivery ? (
                              <span
                                style={{
                                  color: "#bb2124",
                                  position: "relative",
                                  right: "28%",
                                }}
                                className="   text-left  "
                              >
                                <FormattedMessage id="cmd_statut_date_livraison"/>{" "}
                                {this.state.delivery.replace(/-/g, "/")}
                              </span>
                            ) : null}

                            <a href="" id="dashboardLink">
                              <center>
                                <br></br>{" "}
                                <img
                                  src="Images/smile.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                <FormattedMessage id="cmd_statut_produit_a_livrer"/>
                                </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>
                                    {cmdLivrer}{" "}
                                    <img
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                        marginBottom: "8px",
                                      }}
                                      data-imgbigurl="Images/sheep-headB.png"
                                      src="Images/sheep-headB.png"
                                      alt=""
                                    />
                                  </b>
                                </h2>
                              </center>
                            </a>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* cash eff */}
                    {cmdCashDone || cmdCashPayer ? (
                      <>
                        {" "}
                        <div className="col-lg-3 col-md-8 col-sm-8">
                          <Link
                            to={{
                              pathname: "/Commandes",
                              state: { id: "paiement cash effectué" },
                            }}
                          >
                            <div id="cadre" className="featured__item">
                              <div
                                style={{
                                  backgroundImage:
                                    "url(" +
                                    require("./Images/bg_green.png") +
                                    ")",
                                }}
                                className="featured__item__pic "
                                // data-setbg="Images/bg_bleu.jpg"
                                padding-left="10px"
                                padding-right="10px"
                              >
                                <a href="" id="dashboardLink">
                                  <center>
                                    <br></br>{" "}
                                    <img
                                      src="Images/smile.png"
                                      width="95px"
                                      height="95px"
                                    />
                                    <br></br>
                                    <br></br>
                                    <h4 style={{ color: "white" }}>
                                      <FormattedMessage id="cmd_statut_paiment_cash_effectue"/>
                                    </h4>
                                    <br></br>
                                    <h2 style={{ color: "white" }}>
                                      <b>
                                        {cmdCashDone}{" "}
                                        <img
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            marginBottom: "8px",
                                          }}
                                          data-imgbigurl="Images/sheep-headB.png"
                                          src="Images/sheep-headB.png"
                                          alt=""
                                        />
                                      </b>
                                    </h2>
                                  </center>
                                </a>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </section>
            </div>
          </center>
        )}
      </div>
    );
  }
}

export default CommandesParStatut;
