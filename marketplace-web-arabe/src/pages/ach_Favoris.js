import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import "bootstrap-less";
import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import { GiWeight, GiSheep } from 'react-icons/gi';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { FaShapes } from 'react-icons/fa'

class Commandes extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      nbr: null,
      loading: true,
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 8,
      Favoris: [],
      redirect: false,
      activePage: 15,
      panier: [],
      idp: [],
    };
    // this.elv = this.elv.bind(this);
    this.handleDeleteFromFavoris = this.handleDeleteFromFavoris.bind(this);
    this.handlePanier = this.handlePanier.bind(this);

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
          .get("http://127.0.0.1:8000/api/consommateur/" + token + "/favoris", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              // "Content-Type": "application/json",
              Authorization: myToken,
            },
          })
          .then((res) => {
            this.setState(
              {
                Favoris: res.data,
                loading: false,
              },
              () => console.log("in call" + this.state.Favoris)
            );
            const pageNumbers = [];
            for (
              let i = 1;
              i <=
              Math.ceil(this.state.Favoris.length / this.state.annoncesPerPage);
              i++
            ) {
              pageNumbers.push(i);
            }
            this.setState({ nombrePages: pageNumbers });
          });
      });
    }



    this.setState(() => {
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
              panier: res.data,

            }
          );
          let p = [];
          this.state.panier.map((e) => { p.push(e._id) })
          this.setState({ idp: p })
        });

    });
  }
  annonceVision(a) {
    if (a.race === undefined) {
      return " ";
    } else return a.race;
  }
  ispanier(a) {

    return this.state.idp.includes(a);
  }
  handlePanier(Mid) {
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (!token) {
      this.props.history.push("/login");
    } else {
      // console.log(token);
      axios
        .put(
          "http://127.0.0.1:8000/api/consommateur/" + token + "/panier",
          { id_espece: Mid },

          {
            headers: {
              // "Access-Control-Allow-Origin": "*",
              // "Content-Type": "application/json",
              // Accept: "application/json",
              "Authorization": myToken,
            },
          }
        )
        .then(this.setState({ nbr: this.state.idp.push(Mid), idp: this.state.idp }));


      Swal.fire({
        title: "Ajouté dans Pannier",
        icon: "success",
        width: 400,
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
        /* confirmButtonColor: "#7fad39",

        confirmButtonText: "Ok!",*/
      });

    }
  }
  handleDeleteFromFavoris(Mid) {

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
              "http://127.0.0.1:8000/api/consommateur/" + token + "/favoris/" + Mid,
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
                  Favoris: this.state.Favoris.filter(
                    (Favoris) => Favoris._id !== Mid
                  ),
                });
              this.props.history.push("/Favoris")

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
            Math.ceil(this.state.Favoris.length / this.state.annoncesPerPage);
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

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    var fav = this.state.Favoris.filter((Favoris) => Favoris !== null);
    const indexOfLastAnnonce =
      this.state.currentPage * this.state.annoncesPerPage;
    const indexOfFirstAnnonce =
      indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = this.state.Favoris.slice(
      indexOfFirstAnnonce,
      indexOfLastAnnonce
    );
    const { loading } = this.state;
    let titre;
    if (fav.length == 1 || fav.length == 0) {
      titre = (
        <h6>
          <span>{fav.length}</span> Annonce {" "}
        </h6>
      );
    } else {
      titre = (
        <h6>
          <span>{fav.length}</span> Annonces {" "}
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
            <h3 className="latest-product__item">
              Mes favoris <i className="fa fa-heart"> </i>
            </h3>
            <div className="row">

              <div className="col-lg-12 col-md-7">
                {/*<!-- Sheeps Grid Section Begin --> */}
                <div className="filter__found text-left">
                  <h6>
                    <span>{titre}</span>
                  </h6>
                </div>
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
                    {this.state.Favoris.length == 0 ?
                      <div className="text-center my-5">
                           <p style={{color:"#fba502"}}>

                          <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i>
                        </p>

                          <h3 style={{color:"#28a745"}}>Liste des favoris vide !</h3> 
                      </div>
                      :
                      <div className="row">
                        {currentAnnonces.map((Annonces) => (
                          <div className="col-lg-3 col-md-3 col-sm-6">
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
                                <ul className="product__item__pic__hover">
                                  <li>
                                    <Link to={`/DetailsMouton/${Annonces._id}`}>
                                      <a href="#">
                                        <i className="fa fa-eye"></i>
                                      </a>
                                    </Link>
                                  </li>
                                  <li>
                                    <a
                                      id={Annonces._id}
                                      onClick={(e) =>
                                        this.handleDeleteFromFavoris(
                                          e.currentTarget.id
                                        )
                                      }
                                    >
                                      <i className="fa fa-trash"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              {Annonces.anoc ?
                                <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} className=" badge badge-success pt-2 w-100  ">
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span>Labélisé ANOC</span>  </h1>
                                :
                                <span className="badge pt-3 w-100 mb-2    ">{" "}</span>
                              }

                              <div className="product__item__text p-2 text-justify">
                                <h6 >
                                  <img style={{ width: "18px", height: "20px", marginBottom: "5px" }}
                                    data-imgbigurl="Images/sheep-head.png"
                                    src="Images/sheep-head.png"
                                    alt=""
                                  />
                                  {" " + Annonces.espece}

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
                                  <i className="fa fa-usd" aria-hidden="true"></i>

                                  {"         " + Annonces.prix + "  Dhs"}
                                </h5>

                                {Annonces.statut == "disponible" ?
                                  (<div>
                                    {!this.ispanier(Annonces._id) ?
                                      <button
                                        id={Annonces._id}
                                        className="float-right rounded mt-2 text-white bg-success py-1 px-2  "
                                        style={{ fontSize: "16px", border: "none" }}
                                        onClick={(e) => {
                                          this.handlePanier(e.currentTarget.id);
                                        }
                                        }
                                      >
                                        <i className="fa fa-shopping-cart "> {""} ajouter au Panier</i>
                                      </button>
                                      : <button

                                        disabled="disabled"
                                        className="float-right rounded text-white mt-2    btn-default py-1 px-2  "
                                        style={{ fontSize: "16px", border: "none" }}
                                      >
                                        <i className="fa fa "> </i>
                                      </button>}
                                  </div>)
                                  : (<button

                                    disabled="disabled"
                                    className="float-right rounded text-white  mt-2  btn-default py-1 px-2  "
                                    style={{ fontSize: "16px", border: "none" }}
                                  >
                                    <i className="fa fa "> </i>
                                  </button>)}<div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    }  </div>)}
                <div className="center-div">
                  <nav className="row">
                    <ul className="pagination center-div">
                      {this.state.nombrePages.map((number) => (
                        <li key={number} className="page-item stylePagination">
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
                </div>

                <br></br>
                {/* <!-- Sheeps Grid Section End --> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default Commandes;
