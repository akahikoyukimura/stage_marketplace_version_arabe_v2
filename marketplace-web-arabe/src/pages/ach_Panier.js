import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { HiOutlineBadgeCheck } from 'react-icons/hi';

import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FaShapes } from 'react-icons/fa'

import { GiWeight } from 'react-icons/gi';
class Commandes extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      loading: true,
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 2,
      Paniers: [],
      panier: [],
      redirect: false,
      coop: [],
      coopn: [],
    };
    // this.elv = this.elv.bind(this);
    this.handleDeleteFromPanier = this.handleDeleteFromPanier.bind(this);
  }
  // elv = (id) => {
  //   axios
  //     .get("http://127.0.0.1:8000/api/mouton/" + id)
  //     .then((res) => {
  //       //  console.log(res.data.objet)
  //       this.setState({ mouton: res.data.objet });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
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
      appendLeadingZeroes(current_datetime.getHours() - 2) +
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
          .get("http://127.0.0.1:8000/api/consommateur/" + token + "/panier", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
              Authorization: myToken,
            },
          })
          .then((res) => {

            this.setState(
              {
                Paniers: res.data,
                loading: false,
              },
              () =>
                this.setState({
                  Paniers: this.state.Paniers.filter(
                    (Paniers) => Paniers.statut === "disponible"
                  ),
                })
            );
            let i = 0; let coop = [];
            this.state.Paniers.map((c) => { coop[i] = c.id_cooperative; i++ });
            const unique = (value, index, self) => { return self.indexOf(value) === index }
            this.setState({ coop: coop.filter(unique) });
            let coopn = [];
            this.state.coop.map((c) => (
              axios
                .get("http://127.0.0.1:8000/api/cooperative/" + c, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: myToken,
                  },
                })
                .then((res) => {
                  coopn.splice(0, 0, { "nom": res.data.nom, "idc": c, "adresse": res.data.adresse, "ville": res.data.ville, "rib": res.data.rib, "techniciens": res.data.techniciens, "parametres": res.data.parametres,"livraison":res.data.livraison,"occasion":res.data.occasion,"id_animateur":res.data.id_animateur });
                  this.setState({ coopn: coopn });
                  let p = [];
                  this.state.coop.map((c) => {
                    p.splice(0, 0, {
                      "_id": c,
                      "nom": coopn.filter((f) => (f.idc === c)).map((m) => m.nom)[0],
                      "adresse": coopn.filter((f) => (f.idc === c)).map((m) => m.adresse)[0],
                      "ville": coopn.filter((f) => (f.idc === c)).map((m) => m.ville)[0],
                      "rib": coopn.filter((f) => (f.idc === c)).map((m) => m.rib)[0],
                      "tech": coopn.filter((f) => (f.idc === c)).map((m) => m.techniciens)[0],
                      "parametres": coopn.filter((f) => (f.idc === c)).map((m) => m.parametres)[0],
                      "livraison":coopn.filter((f) => (f.idc === c)).map((m) => m.livraison)[0],
                      "occasion":coopn.filter((f) => (f.idc === c)).map((m) => m.occasion)[0],
                      "id_animateur":coopn.filter((f) => (f.idc === c)).map((m) => m.id_animateur)[0],
                      "id_espaces": this.state.Paniers.filter((f) => (f.id_cooperative === c)).map((m) => m._id),
                      "especes": this.state.Paniers.filter((f) => (f.id_cooperative === c)),
                      "prix": this.state.Paniers.filter((f) => (f.id_cooperative === c)).reduce(function (prev, cur) { return prev - (- cur.prix); }, 0)
                    })
                  });
                  this.setState({ panier: p });
                  const pageNumbers = [];
                  for (let i = 1; i <= Math.ceil(this.state.panier.length / this.state.annoncesPerPage); i++) {
                    pageNumbers.push(i);
                  }
                  this.setState({ nombrePages: pageNumbers });
                })));


          });
      });
    }
  }
  handleDeleteFromPanier(Mid, cid) {
    // const idm = this.props.location.state.id;
    // console.log(Mid);
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (!token) {
      this.props.history.push("/login");
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "ml-2 btn btn-success",
          cancelButton: " btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons.fire({
        title: "Etes-vous sûr?",
        text: "Voulez-vous supprimer cette annonce !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "  Oui !  ",
        cancelButtonText: "  Non !  ",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {

          axios
            .put(
              "http://127.0.0.1:8000/api/consommateur/" + token + "/panier/" + Mid,
              {},
              {
                headers: {
                  //"Content-Type": "application/json",

                  Authorization: myToken,
                },
              }
            )
            .then(() => {
              this.setState(
                {

                  Paniers: this.state.Paniers.filter(
                    (Paniers) => Paniers._id !== Mid
                  ),
                });

              let p = [];

              this.state.coop.map((c) => {
                p.splice(0, 0, {
                  "_id": c,
                  "nom": this.state.coopn.filter((f) => (f.idc === c)).map((m) => m.nom)[0],
                  "adresse": this.state.coopn.filter((f) => (f.idc === c)).map((m) => m.adresse)[0],
                  "ville": this.state.coopn.filter((f) => (f.idc === c)).map((m) => m.ville)[0],
                  "rib": this.state.coopn.filter((f) => (f.idc === c)).map((m) => m.rib)[0],
                  "tech": this.state.coopn.filter((f) => (f.idc === c)).map((m) => m.techniciens)[0],
                  "parametres": this.state.coopn.filter((f) => (f.idc === c)).map((m) => m.parametres)[0],
                  "id_espaces": this.state.Paniers.filter((f) => (f.id_cooperative === c)).map((m) => m._id),
                  "especes": this.state.Paniers.filter((f) => (f.id_cooperative === c)),
                  "prix": this.state.Paniers.filter((f) => (f.id_cooperative === c)).reduce(function (prev, cur) { return prev - (- cur.prix); }, 0)
                })
              });

              this.setState({ panier: p.filter((f) => f.especes.length >= 1) });


              this.props.history.push("/panier")

            });
          Swal.fire({
            title: "Supprimé avec succès ",
            icon: "success",
            width: 400,
            heightAuto: false,
            timer: 1500,
            showConfirmButton: false,

          });
          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.panier.filter((f) => f.especes.length >= 1).length / (this.state.annoncesPerPage));
            i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers });


        }
        else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire({
            title: "Annonce non supprimée ! ",
            icon: "error",
            width: 400,
            heightAuto: false,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      })
    }
  }
  annonceVision(a) {
    if (a.race === undefined) {
      return " ";
    } else return a.race;
  }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    var fav = this.state.Paniers.filter((Paniers) => Paniers !== null);

    const { loading } = this.state;

    let titre;
    if (fav.length === 1 || fav.length === 0) {
      titre = (
        <h6>
          <span>{fav.length}</span>  Annonce{" "}
        </h6>
      );
    } else {
      titre = (
        <h6>
          <span>{fav.length}</span>  Annonces{" "}
        </h6>
      );
    }
    return (
      <div>
        {/* //   {/* <!-- Page Preloder --> */}
        {/* <div id="preloder">
           <div className="loader"></div>
        </div>  */}

        <section className="">
          <div className="container">
            <br></br>
            <h3 class="latest-product__item">
              Mon Panier <i class="fa fa-shopping-cart"></i>
            </h3>


            <div className="row">

              <div className="col-lg-12 col-md-7">
                {/*<!-- Sheeps Grid Section Begin --> */}
                <div className="filter__found text-left">
                  <h6>
                    <span>{titre}</span>
                  </h6>
                </div>
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
                      <Loader
                        type="Oval"
                        color="#7fad39"
                        height="80"
                        width="80"
                      />
                    </div>
                  ) : (
                    <div>
                      <div >
                        {this.state.panier.length===0?   <div className="text-center my-5">
                           <p style={{color:"#fba502"}}>

                          <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i>
                        </p>

                          <h3 style={{color:"#28a745"}}>Liste de panier vide !</h3> 
                      </div>:this.state.panier.slice(this.state.currentPage * 2 - 2, this.state.currentPage * 2)
                          .map((p) => <div class="row border mb-2">
                            <div className=" col-lg-12 col-md-12 col-sm-12 mt-3">
                              <b className="text-dark">Cooperative : </b><b className="text-primary">{p.nom}</b>
                              <Link
                                to={{
                                  pathname: "/Commander",
                                  state: {
                                    id: p.id_espaces,
                                    cooperative: p
                                  },
                                }}
                              >
                                <b className="text-danger float-right">
                                  {p.prix} Dhs {" "} <button
                                    id={p.id_espaces}
                                    className=" rounded text-white bg-success py-1 px-2 ml-3  "
                                    style={{ fontSize: "16px", border: "none" }}
                                  //  onClick={(e) => {
                                  //   this.handlePanier(e.currentTarget.id);
                                  //  }
                                  // }
                                  >
                                    {""} Commande globale</button>
                                </b></Link>
                            </div>

                            <br></br>
                            {p.especes.map((Annonces) => (
                               <div className="col-lg-3 col-md-3 col-sm-6">
                                <br></br>
                                <div id="anonce" className="product__item">
                                  <div
                                    className="product__item__pic set-bg"
                                  // data-setbg={Annonces.images}
                                  // src="Images/sardi1.jpg"
                                  >
                                    <centre>
                                      {" "}
                                      <img
                                        src={Annonces.image_face}
                                        className="product__item__pic set-bg"
                                      />
                                    </centre>
                                    <ul class="product__item__pic__hover">
                                      <li>
                                        <Link to={`/DetailsMouton/${Annonces._id}`}>
                                          <a href="#">
                                            <i class="fa fa-eye"></i>
                                          </a>
                                        </Link>
                                      </li>
                                      <li>
                                        <a
                                          id={Annonces._id}
                                          onClick={(e) =>
                                            this.handleDeleteFromPanier(
                                              e.currentTarget.id, p._id
                                            )
                                          }
                                        >
                                          <i class="fa fa-trash"></i>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>

                                  {Annonces.anoc ?
                                    <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} class=" badge badge-success pt-2 w-100  ">
                                      <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                      <span>Labélisé ANOC</span>  </h1>
                                    :
                                    <span className="badge pt-3 w-100 mb-2    ">{" "}</span>
                                  }

                                  <div className="product__item__text p-2 text-justify">
                                    {/* <h6 className="text-danger">{"         " + Annonces.statut}</h6> */}
                                    {/* <h6>{"   Livrer à :      " + Annonces.point_relais}</h6> */}
                                    {/* <h6> {"         " + Annonces.prix + "   Dhs"}</h6> */}
                                    <h6 > <img style={{ width: "18px", height: "20px", marginBottom: "5px" }}
                                      data-imgbigurl="Images/sheep-head.png"
                                      src="Images/sheep-head.png"
                                      alt=""
                                    />{" " + Annonces.espece}


                                      <span className="float-right">
                                        <FaShapes /> {this.annonceVision(Annonces)}
                                      </span> </h6>


                                    <h6>
                                      <img
                                        style={{ width: "18px", height: "18px", marginRight: "5px" }}
                                        src="./Images/age.png" />

                                      {Annonces.age + " mois"}

                                      <span className="float-right ">
                                        <GiWeight className=" mr-1 fa-lg " />
                                        {Annonces.poids + " Kg"}</span></h6>

                                    <h6 className=" nbrm" style={{ color: "black", fontSize: "18px" }}>
                                      <i class="fa fa-map-marker"></i> {Annonces.region}
                                    </h6>


                                    <h5 id="mad">
                                      <i class="fa fa-usd" aria-hidden="true"></i>

                                      {"         " + Annonces.prix + "  Dhs"}
                                    </h5>
                                    {Annonces.statut === "disponible" ?
                                      <Link
                                        to={{
                                          pathname: "/Commander",
                                          state: {
                                            id: Annonces._id,
                                            cooperative: p
                                          },
                                        }}
                                      > <button
                                        id={Annonces._id}
                                        className="float-right rounded text-white bg-success py-1 px-2  "
                                        style={{ fontSize: "16px", border: "none" }}
                                      //  onClick={(e) => {
                                      //   this.handlePanier(e.currentTarget.id);
                                      //  }
                                      // }
                                      >
                                          {""} Commander
                                    </button></Link> : null}

                                  </div>
                                </div>
                              </div>
                            ))}</div>)}
                       </div>
                      {/* <!-- Sheeps Grid Section End --> */}

                      { <div className="center-div">
                        <nav className="row">
                          <ul className="pagination center-div">
                            {this.state.nombrePages.map((number) => (
                              <li
                                key={number}
                                className="page-item stylePagination"
                              >
                                <a
                                  onClick={() => this.paginate(number)}
                                  className="page-link"
                                >
                                  {number}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </div>}
                      <br></br>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <br></br>
          </div>
        </section>
      </div>
    );
  }
}
export default Commandes;
