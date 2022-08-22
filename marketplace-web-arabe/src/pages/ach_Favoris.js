import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import "bootstrap-less";
import Loader from "react-loader-spinner";
import Swal from "sweetalert2";
import { GiWeight } from "react-icons/gi";
import { IoMdMale } from "react-icons/io";
import { FaShapes } from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FormattedMessage } from "react-intl";
require("bootstrap-less/bootstrap/bootstrap.less");


const intl = JSON.parse(localStorage.getItem("intl"));

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
          this.setState({
            panier: res.data,
          });
          let p = [];
          this.state.panier.map((e) => {
            p.push(e._id);
          });
          this.setState({ idp: p });
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
              Authorization: myToken,
            },
          }
        )
        .then(
          this.setState({ nbr: this.state.idp.push(Mid), idp: this.state.idp })
        );

      Swal.fire({
        title: intl.messages.favoris_ajoute_au_panier_succes,
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

      swalWithBootstrapButtons
        .fire({
          title: intl.messages.panier_delete_item,
          text: intl.messages.panier_delete_message,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: intl.messages.panier_delete_oui,
          cancelButtonText: intl.messages.panier_delete_non,
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .put(
                "http://127.0.0.1:8000/api/consommateur/" +
                  token +
                  "/favoris/" +
                  Mid,
                {},
                {
                  headers: {
                    //"Content-Type": "application/json",

                    Authorization: myToken,
                  },
                }
              )
              .then(() => {
                this.setState({
                  Favoris: this.state.Favoris.filter(
                    (Favoris) => Favoris._id !== Mid
                  ),
                });
                this.props.history.push("/Favoris");
              });
            Swal.fire({
              title: intl.messages.panier_delete_succes,
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
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: intl.messages.panier_delete_failed,
              icon: "error",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
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
    const indexOfFirstAnnonce = indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = this.state.Favoris.slice(
      indexOfFirstAnnonce,
      indexOfLastAnnonce
    );
    const { loading } = this.state;
    let titre;
    if (fav.length == 1 || fav.length == 0) {
      titre = (
        <h6>
          <span>{fav.length}</span> <FormattedMessage id="annonce"/>{" "}
        </h6>
      );
    } else {
      titre = (
        <h6>
          <span>{fav.length}</span> <FormattedMessage id="annonce"/>{" "}
        </h6>
      );
    }

    return (
      <div>
        {/* //   {/* <!-- Page Preloder --> */}
        {/* <div id="preloder">
           <div className="loader"></div>
        </div>  */}
        <section className="" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right", marginTop:"50px"}: {}}>
          <div className="container" style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right", marginTop:"50px"}: {}}>
            <br></br>
            <h3 className="latest-product__item">
              <FormattedMessage  id="header_favori" />{" "}
              <span className="text-left text-danger ">
                {" "}
                <i className="fa fa-heart"></i>
              </span>
            </h3>
            <div className="row" >
              <div className="col-lg-12 col-md-7">
                {/*<!-- Sheeps Grid Section Begin --> */}
                <div className="filter__found text-left">
                  <h6>
                    <span style={localStorage.getItem("lg") == "ar"? { direction: "rtl", textAlign: "right"}: {}}>{titre}</span>
                  </h6>
                </div>
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
                      height="80"
                      width="80"
                    />
                  </div>
                ) : (
                  <div>
                    {this.state.Favoris.length == 0 ? (
                      <div
                        className="text-center my-5"
                        style={{ height: "30rem" }}
                      >
                        <p style={{ color: "#fba502" }}>
                          <i
                            className="fa fa-frown-o fa-5x"
                            aria-hidden="true"
                          ></i>
                        </p>

                        <h3 style={{ color: "#28a745" }}>
                          <FormattedMessage id="favoris_vide" />
                        </h3>
                      </div>
                    ) : (
                      <div className="row">
                        {currentAnnonces.map((Annonces) => (
                          <div className="col-lg-3 col-md-6 col-sm-6">
                            <div id="anonce" className="product__item">
                              <div
                                className="product__item__pic set-bg"
                                // data-setbg={Annonces.images}
                                // src="Images/sardi1.jpg"
                              >
                                <img
                                  src={Annonces.image_face}
                                  alt="item"
                                  style={{
                                    width: "355px",
                                    height: "170px",
                                    borderTopRightRadius: "10%",
                                    borderTopLeftRadius: "10%",
                                    objectFit: "contain",
                                  }}
                                />
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
                              {Annonces.anoc ? (
                                <h1
                                  style={{
                                    borderRadius: "0% 0% 0% 40%",
                                    fontSize: "14px",
                                  }}
                                  className=" badge badge-success pt-2 w-100  "
                                >
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                                </h1>
                              ) : (
                                <span className="badge pt-3 w-100 mb-2    ">
                                  {" "}
                                </span>
                              )}

                              <div className="product__item__text p-2 text-justify">
                                <div
                                  className="region"
                                  style={{
                                    color: "#aaa",
                                    fontSize: "15px",
                                    textAlign: "center",
                                  }}
                                >
                                  <i
                                    className="fa fa-map-marker"
                                    style={{ marginRight: "0.5rem" }}
                                  ></i>
                                  {localStorage.getItem("lg") == "ar"
                                          ? typeof Annonces.localisation_ar!='undefined'
                                            ? Annonces.localisation_ar
                                            :Annonces.localisation
                                          : Annonces.localisation}
                                </div>
                                <div
                                  className="product__item__information"
                                  style={{
                                    color: "black",
                                    fontSize: "15px",
                                  }}
                                >
                                  <div className=" nbrm">
                                    <img
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        marginBottom: "5px",
                                        marginRight: "5px",
                                      }}
                                      data-imgbigurl="Images/sheep-head.png"
                                      src="Images/sheep-head.png"
                                      alt=""
                                    />
                                    {Annonces.espece == "chevre" ? (
                                            <FormattedMessage id="tout_les_annonces_chevre" />
                                          ) : (
                                            <FormattedMessage id="tout_les_annonces_mouton" />
                                          )}
                                    <span style={
                                              localStorage.getItem("lg") == "ar"
                                                ? { float: "left" }
                                                : { float: "right" }
                                            }>
                                      <FaShapes
                                        style={{ marginRight: "5px" }}
                                      />{" "}
                                      {localStorage.getItem("lg") == "ar"
                                              ? Annonces.race_ar
                                              ?Annonces.race_ar
                                              :Annonces.race
                                              :Annonces.race}
                                    </span>
                                  </div>
                                  <div>
                                    <IoMdMale
                                      className=" mr-1 fa-lg "
                                      style={{
                                        marginRight: "5px",
                                      }}
                                    />
                                    {localStorage.getItem("lg") == "ar"
                                            ? Annonces.sexe == "Mâle"
                                              ? "ذكر"
                                              : "أنثى"
                                            : Annonces.sexe}
                                    <span style={
                                              localStorage.getItem("lg") == "ar"
                                                ? { float: "left" }
                                                : { float: "right" }
                                            }>
                                      <GiWeight
                                        className=" mr-1 fa-lg "
                                        style={{ marginRight: "5px" }}
                                      />
                                      <FormattedMessage
                                              id="panier_mouton_poids_kg"
                                              values={{ poids: Annonces.poids }}
                                            />
                                    </span>
                                  </div>
                                  <div>
                                    <span style={
                                              localStorage.getItem("lg") == "ar"
                                                ? { float: "right" }
                                                : { float: "left" }
                                            }>
                                      <MdCake
                                        className=" mr-1 fa-lg "
                                        style={{ marginRight: "5px" }}
                                      />
                                      <FormattedMessage
                                              id="panier_mouton_age_mois"
                                              values={{ age: Annonces.age }}
                                            />
                                    </span>
                                  </div>
                                  <div
                                    style={
                                      localStorage.getItem("lg") == "ar"
                                        ? {
                                            float: "left",
                                            color: "#fe6927",
                                            fontSize: "18px",
                                            fontWeight: "1000",
                                            textDecoration: "bold",
                                            alignContent: "center",
                                          }
                                        : {
                                            float: "right",
                                            color: "#fe6927",
                                            fontSize: "18px",
                                            fontWeight: "1000",
                                            textDecoration: "bold",
                                            alignContent: "center",
                                          }
                                    }
                                  >
                                    <img
                                      style={{ height: "30px" }}
                                      src={require("./Images/cash-payment.png")}
                                      alt=""
                                    />
                                    {/* <FaDollarSign
                                      className=" mr-1 fa-lg "
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        marginRight: "0.5rem",
                                      }}
                                    /> */}
                                    <FormattedMessage
                                            id="panier_mouton_currency"
                                            values={{ prix: Annonces.prix }}
                                          />
                                  </div>
                                  <br></br>
                                  {Annonces.statut == "disponible" ? (
                                    <div style={{ textAlign: "center" }}>
                                      <br></br>

                                      {!this.ispanier(Annonces._id) ? (
                                        <button
                                          id={Annonces._id}
                                          className="rounded  text-white bg-success py-1 px-2  "
                                          style={{
                                            fontSize: "16px",
                                            borderWidth: "0px",
                                          }}
                                          onClick={(e) => {
                                            this.handlePanier(
                                              e.currentTarget.id
                                            );
                                          }}
                                        >
                                          <i className="fa fa-shopping-cart ">
                                            {" "}
                                            {""} <FormattedMessage id="favoris_ajoute_au_panier" />
                                          </i>
                                        </button>
                                      ) : (
                                        <>
                                          <br></br>
                                        </>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}{" "}
                  </div>
                )}
                <div className="center-div">
                  <Pagination
                    activePage={this.state.currentPage}
                    itemsCountPerPage={9}
                    totalItemsCount={this.state.Favoris.length}
                    pageRangeDisplayed={7}
                    onChange={this.paginate.bind(this)}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
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
