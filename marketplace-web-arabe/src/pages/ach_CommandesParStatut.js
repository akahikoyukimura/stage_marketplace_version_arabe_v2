import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
 
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
    //commandes annulees
    const cmdAnnulee = this.state.Commandes[0];

    //Avances a payer
    const cmdAvancePayer = this.state.Commandes[1]

    //Produit réservé
    const cmdReserve = this.state.Commandes[2]
    // Reste à payer

    const cmdRestePayer = this.state.Commandes[3]

    //Produit à livrer
    const cmdLivrer = this.state.Commandes[4]

    //Produit Complement
    const cmdComplement = this.state.Commandes[5]

    return (
      <div>
        {loading ? (
          <div
            style={{
              width: "100%",
              height: "100",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <br></br>
            <Loader
              type="Oval"
              color="#7fad39"
              height="80"
              width="80"
            />
          </div>
        ) : (
          <center>
            <div>
              <section className="featured spad">
                <div className="container">
                  {/*<!-- Categorie Menus Grid Section Begin --> */}
                  <div className="row featured__filter">
                    {/* à ajouter */}
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de paiement du complément" },
                        }}
                      >
                        {" "}
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic"
                            // data-setbg="Images/bg_purple.jpg"
                            style={{
                              backgroundImage: "url(" + require("./Images/bg_orange.jpg") + ")"
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                             {cmdComplement > 0 ?
                              <span  style={{color:"#bb2124",position:"relative",right:"31%"}}
                               className="  text-left ">Dernier delai : {this.state.deadline[2].substr(6, 4)+"/"+this.state.deadline[2].substr(3, 2)+"/"+this.state.deadline[2].substr(0, 2)}</span>
                              : null}
                            <center>
                              <a href="">
                                <br></br>{" "}
                                {cmdComplement == 0 ? <><br></br>{" "}<br></br>{" "}</> : null}
                                <img
                                  src="Images/info.png"
                                  width="95px"
                                  height="95px"
                                />
                                <h4 style={{ color: "white" }}>
                                  <br></br>{cmdComplement == 0 ? "Comment utiliser cette rubrique ?" : "Compléments à payer "}
                                </h4>
                                <br></br>
                                {cmdComplement != 0 ?
                                  <h2 style={{ color: "white" }}>
                                    <b>{cmdComplement}{" "}
                                      <img style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                                        data-imgbigurl="Images/sheep-headB.png"
                                        src="Images/sheep-headB.png"
                                        alt=""
                                      /></b>
                                  </h2> : null}
                              </a>
                            </center>
                          </div>
                        </div>
                      </Link>
                    </div>


                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <Link
                        to={{
                          pathname: "/Commandes",

                          state: { id: "commande annulée (deadline dépassé)#reçu avance refusé#reçu reste refusé#reçu complément refusé#avarié#rejetée#annulée manuellement#remboursement#avarié_changement#avarié_remboursement#avarié_annulé" },
                        }}
                      >
                        {" "}
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic"
                            // data-setbg="Images/bg_purple.jpg"
                            style={{
                              backgroundImage: "url(" + require("./Images/bg_orange1.jpg") + ")"
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            <center>
                              <a href="">
                                <br></br>{" "}

                                <img
                                  src="Images/sad.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                  Commandes annulées{" "}
                                </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>{cmdAnnulee}{" "}<img style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                                    data-imgbigurl="Images/sheep-headB.png"
                                    src="Images/sheep-headB.png"
                                    alt=""
                                  /></b>
                                </h2>
                                <br></br>
                              </a>
                            </center>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* à ajouter */}
                    <div className="col-lg-6 col-md-6 col-sm-6">

                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de paiement avance" },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic"
                            // data-setbg="Images/bg_red.jpg"
                            style={{
                              backgroundImage: "url(" + require("./Images/bg_bleu.jpg") + ")"
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            {cmdAvancePayer > 0 ?
                              <span
                              style={{color:"#bb2124",position:"relative",right:"31%"}}
                               className="  text-left">Dernier delai : {this.state.deadline[0].substr(6, 4)+"/"+this.state.deadline[0].substr(3, 2)+"/"+this.state.deadline[0].substr(0, 2)}</span>
                              : null}

                            <center>
                              <a href="">
                                <br></br>{" "}
                                <img
                                  src="Images/waiting_payment.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br><br></br>
                                <h4 style={{ color: "white" }}>
                                  Avances a payer
                              </h4>
                                <br></br>

                                <h2 style={{ color: "white" }}>
                                  <b>{cmdAvancePayer}{" "} <img style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                                    data-imgbigurl="Images/sheep-headB.png"
                                    src="Images/sheep-headB.png"
                                    alt=""
                                  /></b>
                                </h2>
                                <br></br>
                              </a>
                            </center>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de validation avance" },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            style={{
                              backgroundImage: "url(" + require("./Images/bg_bleu.jpg") + ")"
                            }}
                            className="featured__item__pic "
                            // data-setbg="Images/bg_bleu.jpg"
                            padding-left="10px"
                            padding-right="10px"
                          >
                            <center>
                              <a href="">
                                <br></br>{" "}
                                <img
                                  src="Images/hourglass.png"
                                  width="95px"
                                  height="95px"
                                />

                                <br></br>
                                <br></br>
                                <h4 style={{ color: "white" }}>
                                  Produit réservé
                              </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>{cmdReserve}{" "}<img style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                                    data-imgbigurl="Images/sheep-headB.png"
                                    src="Images/sheep-headB.png"
                                    alt=""
                                  /></b>
                                </h2>
                              </a>
                            </center>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <Link
                        to={{
                          pathname: "/Commandes",
                          state: { id: "en attente de paiement du reste" },
                        }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic "
                            // data-setbg="Images/bg_red1.jpg"
                            style={{
                              backgroundImage: "url(" + require("./Images/bg_green.png") + ")"
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                           {cmdRestePayer > 0 ?
                              <span
                              style={{color:"#bb2124",position:"relative",right:"31%"}}
                               className="  text-left  ">Dernier delai : {this.state.deadline[1].substr(6, 4)+"/"+this.state.deadline[1].substr(3, 2)+"/"+this.state.deadline[1].substr(0, 2)}</span>
                              : null}
                            <center>
                              <a href="">
                                <br></br>{" "}
                                <img
                                  src="Images/waiting_payment.png"
                                  width="95px"
                                  height="95px"
                                />
                                <br></br><br></br>
                                <h4 style={{ color: "white" }}>
                                  Reste à payer
                              </h4>
                                <br></br>
                                <h2 style={{ color: "white" }}>
                                  <b>{cmdRestePayer}{" "}<img style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                                    data-imgbigurl="Images/sheep-headB.png"
                                    src="Images/sheep-headB.png"
                                    alt=""
                                  /></b>
                                </h2>

                              </a>
                            </center>
                           
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <Link
                        to={{ pathname: "/Commandes", state: { id: "validé#en attente de validation reste#en attente de validation du complément" } }}
                      >
                        <div id="cadre" className="featured__item">
                          <div
                            className="featured__item__pic "
                            // data-setbg="Images/bg_green1.jpg"
                            style={{
                              backgroundImage: "url(" + require("./Images/bg_green.png") + ")"
                            }}
                            padding-left="10px"
                            padding-right="10px"
                          >
                            {cmdLivrer > 0 &&this.state.delivery?
                              <span
                              style={{color:"#bb2124",position:"relative",right:"28%"}}
                               className="   text-left  ">Date de livraison : {this.state.delivery.replace(/-/g,"/")}</span>
                              : null}

                            <center>
                              <a href="">
                                <br></br>{" "}
                                <img
                                  src="Images/smile.png"
                                  width="95px"
                                  height="95px"
                                />

                                <br></br><br></br>
                                <h4 style={{ color: "white" }}>
                                  Produit à livrer
                              </h4>
                                <br></br>

                                <h2 style={{ color: "white" }}>
                                  <b>{cmdLivrer}{" "}<img style={{ width: "40px", height: "40px", marginBottom: "8px" }}
                                    data-imgbigurl="Images/sheep-headB.png"
                                    src="Images/sheep-headB.png"
                                    alt=""
                                  /></b>
                                </h2>
                              </a>
                            </center>
                          </div>
                        </div>
                      </Link>
                    </div>

                  </div>
                  {/* <!-- Categorie Menus Grid Section End --> */}
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
