import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Carousel from "react-bootstrap/Carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'))

class AlerteCommande extends Component {
  constructor(props) {
    super(props);
    // let redirect = false;
    this.state = {
      commande: {},
      cooperative: null,
      rib: "",
      tech: "",
      deadline: "",
      reference: "",
      avance: "",
      show: true,
      date: Date,
      redirect: false,
    };
    this.handlPost = this.handlPost.bind(this);
    this.annulerCommande = this.annulerCommande.bind(this);
  }
  // componentDidMount() {
  //   const cmd = this.props.location.state.id;
  //   const datee = new Date();

  //   const D = datee.setHours(datee.getHours() + 8).toLocaleString();
  //   // console.log(datee.toLocaleString().getHours())
  //   this.setState({ commande: cmd, date: D });
  // }

  componentDidMount() {
    var cmd = this.props.location.state.id;

    const myToken = `Bearer ` + localStorage.getItem("myToken");
    const a=localStorage.getItem('lg')=="ar"?" مع":" à";
    this.setState({
      commande: this.props.location.state.id,
      deadline: (this.props.location.state.id.deadline.replace(",", a)).substr(0, 22),
      avance: this.props.location.state.id.avance,
      //date: datetime,
    });

    axios
      .get("http://127.0.0.1:8000/api/cooperative/" + cmd.id_cooperative, {
        headers: {
          // "x-access-token": token, // the token is a variable which holds the token
          "Content-Type": "application/json",
          Authorization: myToken,
        },
      })

      .then((res) => {
        this.setState(
          {
            cooperative: res.data,
            tech: res.data.tech[0].prenom + " " + res.data.tech[0].nom,
            rib: res.data.rib,
          },
          () => {
            axios

              .get(
                "http://127.0.0.1:8000/api/reference/" +
                  this.props.location.state.id.especes[0].id_espece,
                {
                  headers: {
                    // "x-access-token": token, // the token is a variable which holds the token
                    Authorization: myToken,
                  },
                }
              )
              .then((res) => {
                this.setState({ reference: res.data.reference }, () => {
                  this.state.commande.reference = this.state.reference;
                });
              });
          }
        );
      });
  }

  handlPost(e) {
    e.preventDefault();
    this.setState({ show: false }, () => {});
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "ml-2 btn btn-success",
        cancelButton: " btn btn-danger",
      },
      buttonsStyling: false,
    });
    const myToken = `Bearer ` + localStorage.getItem("myToken");

    axios

      .post("http://127.0.0.1:8000/api/commande", this.state.commande, {
        headers: {
          Accept: "application/json",
          Authorization: myToken,
        },
      })
      .then((res) => {
        this.state.commande.especes.map((e) =>
          axios
            .put(
              "http://127.0.0.1:8000/api/Espece/" + e.id_espece,
              {
                statut: "réservé",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: myToken,
                },
              }
            )
            .then((res) => {})
        );
        swalWithBootstrapButtons.fire(
          intl.messages.alerte_cmd_validation_title,
          intl.messages.alerte_cmd_validation_body,
          "success"
        );

        this.props.history.push("./commandesParStatut");
      })
      .catch((err) => {
        console.log(err);
        this.setState({ show: true }, () => {});
      });
  }

  annulerCommande() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "mx-3 btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: intl.messages.panier_delete_item,
        text: intl.messages.alerte_cmd_annuler_popup_text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: intl.messages.panier_delete_oui,
        cancelButtonText: intl.messages.panier_delete_non,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            intl.messages.alerte_cmd_annulation_success_title,
            intl.messages.alerte_cmd_annulation_success_body,
            "success"
          );

          this.props.history.push("./");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            intl.messages.alerte_cmd_annulation_failed_title,
            intl.messages.alerte_cmd_annulation_failed_body,
            "error"
          );
        }
      });
  }

  render() {
    //control-arrow control-next
    console.log(this.state.commande.mode_paiement_choisi);
    return (
      <div style={localStorage.getItem('lg')=='ar'?{"direction":"rtl","textAlign":"right"}:{}} className="">
        <style>{` .carousel-indicators li  {background-color:#009141; width: 35px;height: 5px;}`}</style>
        <section className="product spad">
          <div className="container">
            <div className="col-lg-12 col-md-6 mx-5 ">
              <h3><FormattedMessage id="alerte_cmd_title"/></h3> <br></br>
              {this.state.commande.mode_paiement_choisi === "cash" ? (
                <>
                  <h5>
                    <FormattedMessage id="alerte_cmd_cash_message"/>
                  </h5>
                </>
              ) : (
                <>
                  {" "}
                  <h5
                    className="mw-75 "
                    style={{ marginLeft: "2%", marginRight: "10%" }}
                  >
                    <FormattedMessage id="alerte_cmd_h5_message_validation"/>
                    {this.state.commande.mode_paiement_choisi ===
                    "transfert" ? (
                      <span>
                        {" "}{<FormattedMessage id="alerte_cmd_h5_message_transfert_au_technicien"/>}
                        <span className="text-danger font-weight-bold text-uppercase">
                          {this.state.tech}
                        </span>{" "}
                      </span>
                    ) : (
                      <span>
                        {<FormattedMessage id="alerte_cmd_h5_message_virement_sur_rib"/>}
                        <span className="text-danger font-weight-bold">
                          {this.state.rib}
                        </span>
                      </span>
                    )}
                    <br></br>
                    <br></br>
                    <FormattedMessage
                id = "alerte_cmd_h5_frais_reservation"
                values = {{avance:this.state.avance, span: (word)=> <span className="text-danger font-weight-bold">{word}</span>}}
                />
                    {/* Frais de reservation à payer :{" "}
                    <span className="text-danger font-weight-bold">
                      {this.state.avance} Dhs
                    </span> */}
                  </h5>
                </>
              )}
              <br></br>
              <div
                style={localStorage.getItem('lg')=='ar'?{"maxHeight":"600px","maxWidth":"50%","marginRight":"20%"}:{"maxHeight":"600px","maxWidth":"50%","marginLeft":"20%"}}
              >
                {
                  <Carousel fade>
                    {this.state.commande.mode_paiement_choisi ===
                    "transfert" ? (
                      <Carousel.Item>
                        <img
                          alt="image_carousel"
                          style={{
                            minHeight: "400px",
                            maxHeight: "400px",
                            minWidth: "100%",
                          }}
                          src="/Images/1p.jpg"
                        />
                      </Carousel.Item>
                    ) : (
                      <Carousel.Item>
                        <img
                          alt="image_carousel"
                          style={{
                            minHeight: "400px",
                            maxHeight: "400px",
                            minWidth: "100%",
                          }}
                          src={localStorage.getItem('lg')=='ar'?"/Images/11p_ar.jpg":"/Images/11p.jpg"}
                        />
                      </Carousel.Item>
                    )}
                    <Carousel.Item>
                      <img
                        style={{
                          minHeight: "400px",
                          maxHeight: "400px",
                          minWidth: "100%",
                        }}
                        src="/Images/2p.jpg"
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        alt="image_carousel"
                        style={{
                          minHeight: "400px",
                          maxHeight: "400px",
                          minWidth: "100%",
                        }}
                        src={localStorage.getItem('lg')=='ar'?"/Images/3p_ar.png":"/Images/3p.png"}
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        alt="image_carousel"
                        style={{
                          minHeight: "400px",
                          maxHeight: "400px",
                          minWidth: "100%",
                        }}
                        src={localStorage.getItem('lg')=='ar'?"/Images/4p_ar.png":"/Images/4p.png"}
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        alt="image_carousel"
                        style={{
                          minHeight: "400px",
                          maxHeight: "400px",
                          minWidth: "100%",
                        }}
                        src={localStorage.getItem('lg')=='ar'?"/Images/5p_ar.png":"/Images/5p.png"}
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        alt="image_carousel"
                        style={{
                          minHeight: "400px",
                          maxHeight: "400px",
                          minWidth: "100%",
                        }}
                        src={localStorage.getItem('lg')=='ar'?"/Images/6p_ar.png":"/Images/6p.png"}
                      />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img
                        alt="image_carousel"
                        style={{
                          minHeight: "400px",
                          maxHeight: "400px",
                          minWidth: "100%",
                        }}
                        src={localStorage.getItem('lg')=='ar'?"/Images/7p_ar.jpg":"/Images/7p.jpg"}
                      />
                    </Carousel.Item>
                  </Carousel>
                }
              </div>
              <br></br>
              <br></br>
              {this.state.commande.mode_paiement_choisi !== "cash" ? (
                <>
                  <div className="checkout__input bg-ligh text-danger h6 center mt-5">
                  <FormattedMessage
                id = "alerte_cmd_attention_message1"
                values = {{deadline:this.state.deadline, span: (word)=> <span className="font-weight-bold  text-danger h5">{word}</span>}}
                />
                    {/* <span className="font-weight-bold  text-danger h5">
                      Attention :{" "}
                    </span>{" "}
                    Il vous reste jusqu'au {this.state.deadline}
                    <span>
                      <b> </b></span>{" "}
                    pour payer et importer votre reçu de paiement. */}
                  </div>
                  <div
                    className="checkout__input bg-ligh text-danger h6 center  "
                    style={{ marginBottom: "90px" }}
                  >
                    <FormattedMessage id="alerte_cmd_attention_message2"/>
                  </div>
                </>
              ) : (
                <></>
              )}
              {this.state.show ? (
                <>
                  <div className="mw-75 " style={localStorage.getItem('lg')=='ar'?{ marginRight: "35%" }:{marginRight: "45%"}}>
                    <Link
                      to={{
                        pathname: "./commandesParStatut",
                      }}
                    >
                      <b className="text-danger float-right">
                        <button
                          className=" rounded text-white bg-success py-1 px-3 "
                          onClick={this.handlPost}
                          style={{ fontSize: "19px", border: "none" }}
                        >
                          {" "}
                          <FormattedMessage id="alerte_cmd_valider"/>
                        </button>
                      </b>
                    </Link>
                  </div>
                  <br></br>
                  <br></br>

                  <div className="mw-75  " style={localStorage.getItem('lg')=='ar'?{ marginRight: "40%" }:{marginRight: "45%"}}>
                    <b className="text-danger float-right ">
                      <button
                        className=" rounded text-white bg-danger py-1 px-2 "
                        onClick={this.annulerCommande}
                        style={{ fontSize: "20px", border: "none" }}
                        //  onClick={(e) => {
                        //   this.handlePanier(e.currentTarget.id);
                        //  }
                        // }
                      >
                        {""} <FormattedMessage id="alerte_cmd_annuler"/>{" "}
                      </button>
                    </b>
                  </div>
                </>
              ) : (
                <>
                  <div className="mw-75 " style={localStorage.getItem('lg')=='ar'?{ marginRight: "35%" }:{marginRight: "45%"}}>
                    <Link
                      to={{
                        pathname: "./commandesParStatut",
                      }}
                    >
                      <b className="text-danger float-right">
                        <button
                          disabled
                          className=" rounded text-white bg-success py-1 px-3 "
                          onClick={this.handlPost}
                          style={{ fontSize: "19px", border: "none" }}
                        >
                          {" "}
                          <FormattedMessage id="alerte_cmd_valider"/>
                        </button>
                      </b>
                    </Link>
                  </div>
                  <br></br>
                  <br></br>

                  <div className="mw-75  " style={localStorage.getItem('lg')=='ar'?{ marginRight: "40%" }:{marginRight: "45%"}}>
                    <b className="text-danger float-right ">
                      <button
                        disabled
                        className=" rounded text-white bg-danger py-1 px-2 "
                        onClick={this.annulerCommande}
                        style={{ fontSize: "20px", border: "none" }}
                        //  onClick={(e) => {
                        //   this.handlePanier(e.currentTarget.id);
                        //  }
                        // }
                      >
                        {""} <FormattedMessage id="alerte_cmd_annuler"/>{" "}
                      </button>
                    </b>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default AlerteCommande;
