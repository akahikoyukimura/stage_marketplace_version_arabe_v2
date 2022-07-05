import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Carousel from 'react-bootstrap/Carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { Link } from "react-router-dom";


class AlerteCommande extends Component {
  constructor(props) {
    super(props);
    // let redirect = false;
    this.state = {
      commande: {},
      cooperative: null,
      rib: '',
      tech: '',
      deadline: '',
      reference: '',
      avance: '',
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
    this.setState({
      commande: this.props.location.state.id,
      deadline: (this.props.location.state.id.deadline.replace(",", "  à ")).substr(0, 20),
      avance: this.props.location.state.id.avance,
      //date: datetime,
    });


    axios
      .get("http://127.0.0.1:8000/api/cooperative/" + cmd.id_cooperative, {
        headers: {
          // "x-access-token": token, // the token is a variable which holds the token
          "Content-Type": "application/json",
          "Authorization": myToken,
        },
      })

      .then((res) => {

        this.setState({ cooperative: res.data, tech: res.data.tech[0].prenom + " " + res.data.tech[0].nom, rib: res.data.rib }
          , () => {
            axios

              .get("http://127.0.0.1:8000/api/reference/" + this.props.location.state.id.especes[0].id_espece, {
                headers: {
                  // "x-access-token": token, // the token is a variable which holds the token
                  Authorization: myToken,
                },
              })
              .then((res) => {
                 this.setState({ reference: res.data.reference }, () => {
                  this.state.commande.reference = this.state.reference;
                });
              })
          })
      })
  }

  handlPost(e) {
    e.preventDefault();
    this.setState({ show: false }, () => { })
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
          "Authorization": myToken,
        },
      })
      .then((res) => {
        this.state.commande.especes.map((e) =>
        (
          axios
            .put(
              "http://127.0.0.1:8000/api/Espece/" + e.id_espece,
              {
                statut: "réservé",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": myToken,
                },
              }
            )
            .then((res) => {

            


            })
        ))
        swalWithBootstrapButtons.fire(
          "Commande validée",
          "Finalisez votre commande dans Mes Commandes",
          'success'
        )

        this.props.history.push("./commandesParStatut");


      })
      .catch((err) => {
        console.log(err);
        this.setState({ show: true }, () => { })

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
    swalWithBootstrapButtons.fire({
      title: "Etes-vous sûr?",
      text: "Voulez-vous annuler votre commande!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "  Oui!  ",
      cancelButtonText: "  Non!  ",
      reverseButtons: true,
    }).then((result) => {


      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Annulation !',
          'Votre commande a bien été annulée',
          'success'
        )

        this.props.history.push("./");

      }
      else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Annulation',
          'Commande non annulée !',
          'error'
        )
      }
    })
  }

  render() {
    //control-arrow control-next

    return (
      <div className="">
        <style>{` .carousel-indicators li  {background-color:#009141; width: 35px;height: 5px;}`}</style>
        <section className="product spad">
          <div className="container">
            <div className="col-lg-12 col-md-6 mx-5 ">
              <h3>Votre commande s'est déroulée avec succès</h3> <br></br>
              <h5 className="mw-75 " style={{ marginLeft: "2%", marginRight: "10%" }} >
                Pour valider votre commande , il vous suffit de payer les frais de reservation en effectuant
               {this.state.commande.mode_paiement_choisi === "transfert" ? <span>
                  {" un transfert d'argent au  technicien : "}<span className="text-danger font-weight-bold text-uppercase">{this.state.tech}</span> </span> :
                  <span>
                    {"  un virement sur le rib suivant : "}<span className="text-danger font-weight-bold">{this.state.rib}</span></span>}
                <br></br>
                <br></br>
                Frais de reservation  à payer  : <span className="text-danger font-weight-bold" >{this.state.avance} Dhs</span>
              </h5>
              <br></br>

              <div style={{ maxHeight: "600px", maxWidth: "50%", marginLeft: "20%" }}>
                {
                  <Carousel fade>
                    {this.state.commande.mode_paiement_choisi === "transfert" ?
                      <Carousel.Item>
                        <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/1p.jpg" />
                      </Carousel.Item> : <Carousel.Item>
                        <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/11p.jpg" />
                      </Carousel.Item>}
                    <Carousel.Item>
                      <img style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/2p.jpg" />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/3p.png" />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/4p.png" />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/5p.png" />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/6p.png" />
                    </Carousel.Item>
                    <Carousel.Item>
                      <img alt="image_carousel" style={{ minHeight: "400px", maxHeight: "400px", minWidth: "100%" }} src="/Images/7p.jpg" />

                    </Carousel.Item>

                  </Carousel>
                }

              </div>
              <br></br>
              <br></br>

              <div className="checkout__input bg-ligh text-danger h6 center mt-5">
                <span className="font-weight-bold  text-danger h5">Attention : </span> Il vous reste jusqu'au{" "}{this.state.deadline}
                <span>
                  <b> {/*this.state.date*/}</b>
                </span>{" "}
                pour payer et importer votre reçu de paiement.
              </div>
              <div className="checkout__input bg-ligh text-danger h6 center  " style={{ marginBottom: "90px" }}>
                Au delà de ce délai, votre commande sera annulée automatiquement !
              </div>
              {this.state.show ?
                <>
                  <div className="mw-75 " style={{ marginRight: "45%" }} >
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
                        > Valider la commande</button>
                      </b></Link>
                  </div>
                  <br></br>
                  <br></br>


                  <div className="mw-75  " style={{ marginRight: "45%" }} >
                    <b className="text-danger float-right ">
                      <button

                        className=" rounded text-white bg-danger py-1 px-2 "
                        onClick={this.annulerCommande}
                        style={{ fontSize: "20px", border: "none" }}
                      //  onClick={(e) => {
                      //   this.handlePanier(e.currentTarget.id);
                      //  }
                      // }
                      >{""} Annuler la commande{" "} </button>
                    </b>
                  </div>
                </> : <>
                  <div className="mw-75 " style={{ marginRight: "45%" }} >
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
                        > Valider la commande</button>
                      </b></Link>
                  </div>
                  <br></br>
                  <br></br>


                  <div className="mw-75  " style={{ marginRight: "45%" }} >
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
                      >{""} Annuler la commande{" "} </button>
                    </b>
                  </div>
                </>}

            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default AlerteCommande;
