import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { GiWeight, GiSheep } from 'react-icons/gi';
import { FaShapes } from 'react-icons/fa'
import { HiOutlineBadgeCheck } from 'react-icons/hi';
class HomeSheeps extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      loading: true,
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 6,
      Disabled: true,
      Annonces: [],
      AnnoncesN: [],
      selectedOptionRace: null,
      race: [],
      selectedOptionEspece: null,

      optionsEspece: [],
      selectedOptionVille: null,
      optionsVille: [],
      conditions: {
        statut: "disponible",
        order_by: "espece",
        order_mode: "asc",
      },
      redirect: false,

      selectedOptionSort: null,
      optionsSort: [

        { value: "prix", label: "Moins cher au plus cher" },
        { value: "prix_dec", label: "Plus cher au moins cher" },

        { value: "age", label: "Plus jeune au plus age" },
        { value: "age_dec", label: "plus age au plus jeune" },

        { value: "poids", label: "Moins lourd au plus lourd" },
        { value: "poids_dec", label: "Plus lourd au moins lourd" },
      ],
    };

    this.onChange = this.onChange.bind(this);
    this.handleChangeEspece = this.handleChangeEspece.bind(this);

    this.handelChercher = this.handelChercher.bind(this);
    this.handelReinitialiser = this.handelReinitialiser.bind(this);

    this.sortData = this.sortData.bind(this);

    this.paginate = this.paginate.bind(this);
    // this.handleFavoris=this.handleFavoris.bind(this)
  }
  handleChangeEspece = (selectedOptionEspece) => {
    this.setState({ selectedOptionRace: null, selectedOptionEspece: selectedOptionEspece })
    let annonce = this.state.AnnoncesN;
    let c = selectedOptionEspece.value
    let races = [];

    let r = [];
    (this.groupBy(annonce, 'espece')[c]).map((m) => {
      races.push(m.race);
    })
    races = [...new Set(races)];
    races.map((e) => { r.splice(0, 0, { "value": e, "label": e }); });

    this.setState({
      race: r,
      Disabled: false,
      conditions: Object.assign(this.state.conditions, {
        espece: c,
        race: null,
      })
    });

  };



  handleChangeRace = (selectedOptionRace) => {
    this.setState({ selectedOptionRace }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          race: this.state.selectedOptionRace.value,
        }),
      })
    );
  };

  handleChangeSort = (selectedOptionSort) => {
    this.setState({ selectedOptionSort }, () =>
      this.setState({
        selectedOptionSort: selectedOptionSort,
      })
    );
  };

  handleChangeVille = (selectedOptionVille) => {
    this.setState({ selectedOptionVille }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          localisation: this.state.selectedOptionVille.value,
        }),
      })
    );
  };

  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
  }
  componentDidMount() {
    const token = localStorage.getItem("usertoken");
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece", {
          headers: {
            // "x-access-token": token, // the token is a variable which holds the token
            // "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            // Accept: "application/json",
            // Authorization: myToken,
          },
          params: {
            statut: "disponible",
            order_by: "espece",
            order_mode: "asc",
          },
        })
        .then((res) => {
          //espece
          let espece = [];
          Object.getOwnPropertyNames(this.groupBy(res.data, 'espece')).map((e) => {
            espece.splice(0, 0, { "value": e, "label": e });
          });

          //ville
          let ville = [];
          let villes = [];
          res.data.map((e) => { villes.push(e.localisation) })
          villes = [...new Set(villes)];
          villes.map((e) => { ville.splice(0, 0, { "value": e, "label": e }); });
          this.setState({
            optionsEspece: espece,
            optionsVille: ville,
            AnnoncesN: res.data,
            Annonces: res.data,
            loading: false,
          });
          const pageNumbers = [];
          for (let i = 1; i <= Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage); i++) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers });
        });
    });
  }

  onChange(e) {
    const n = e.target.name,
      v = e.target.value;

    this.setState({
      conditions: Object.assign(this.state.conditions, { [n]: v }),
    });
  }

  sortData(e) {

    const sortProperty = Object.values(e)[0];
    const sorted = this.state.Annonces;
    if (sortProperty === "prix" || sortProperty === "poids" || sortProperty === "age") {
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => a[sortProperty] - b[sortProperty]);
        this.setState({
          Annonces: sorted,
          loading: false
        });
      });
    } else if (sortProperty === "prix_dec") {
      const sort_ = "prix";
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Annonces: sorted, loading: false });
      });
    } else if (sortProperty === "poids_dec") {
      const sort_ = "poids";
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Annonces: sorted, loading: false });
      });
    } else if (sortProperty === "age_dec") {
      const sort_ = "age";
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Annonces: sorted, loading: false });
      });
    }
    else {
      this.setState({ loading: true }, () => {
        sorted.sort(
          function (a, b) {

            return new Date(b[sortProperty]) - new Date(a[sortProperty]);
          });
        this.setState({ Annonces: sorted, loading: false });
      });
    }
  }


  handelReinitialiser() {
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece", {
          headers: {

            "Content-Type": "application/json",

          },
          params: {
            statut: "disponible",
            order_by: "espece",
            order_mode: "asc",
          },
        })
        .then((res) => {
          this.setState({
            Annonces: res.data,
            loading: false,
            conditions: {
              statut: "disponible",
              order_by: "espece",
              order_mode: "asc",
            },
            selectedOptionEspece: null,
            selectedOptionRace: null,
            Disabled: true,
            selectedOptionVille: null,
          });
          var all = document.querySelectorAll('input[name="reference"],input[name="prix_min"],input[name="prix_max"],input[name="poids_min"],input[name="poids_max"]')
          Array.from(all).map((a) => (a.value = null))

          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage);
            i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers });
        });
    });

  }
  handelChercher() {
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece", {
          headers: {
            // "x-access-token": token, // the token is a variable which holds the token
            "Content-Type": "application/json",
          },
          params: this.state.conditions,
        })
        .then((res) => {
          this.setState({
            Annonces: res.data,
            loading: false,
          });
          const pageNumbers = [];
          for (let i = 1; i <= Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage); i++) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers });
        });
    });
  }

  annonceVision(a) {
    if (a.race === undefined) {
      return " ";
    } else return a.race;
  }
  // handleFavoris(Mid) {
  //   console.log(Mid);
  //   const token = localStorage.getItem("usertoken");
  //   if (!token) {
  //     this.props.history.push("/login");
  //   } else {
  //     // console.log(token);
  //     axios
  //       .put(
  //         "http://127.0.0.1:8000/api/consommateur/" + token + "/favoris",{ id_mouton: Mid }

  //        , {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }

  //       )
  //       .then((res) => {});
  //   }
  // }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    var mois = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
    const indexOfLastAnnonce =
      this.state.currentPage * this.state.annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = this.state.Annonces.slice(
      indexOfFirstAnnonce,
      indexOfLastAnnonce
    );
    const { selectedOptionRace } = this.state;
    const { selectedOptionEspece } = this.state;
    const { optionsEspece } = this.state;
    const { selectedOptionVille } = this.state;
    const { optionsVille } = this.state;
    const { optionsSort } = this.state;
    const { loading } = this.state;
    return (
      <div>
        {/* <!-- Page Preloder --> */}
        {/* <div id="preloder">
          <div className="loader"></div>
        </div> */}

        <section className="">
          <br></br>

          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div id="rechercher" className="col-lg-12">
                  <br></br>
                  <br></br>
                  <div className="sidebar__item">
                    <h4>Rechercher</h4>

                    <h6 id="gras" className="latest-product__item">
                      Espece
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <Select
                          value={selectedOptionEspece}
                          onChange={this.handleChangeEspece}
                          options={optionsEspece}
                          placeholder="Espece"
                          required
                        // className="Select"
                        />
                        <br></br>
                      </div>
                    </div>

                    <h6 id="gras" className="latest-product__item">
                      Race
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <Select
                          id="recherchePlace"
                          isDisabled={this.state.Disabled}
                          value={selectedOptionRace}
                          onChange={this.handleChangeRace}
                          options={this.state.race}
                          placeholder=" Race"
                          required
                        // className="Select"
                        />
                        <br></br>
                      </div>
                    </div>
                    <h6 id="gras" className="latest-product__item">
                      Reference
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
                          id="recherchePlace"

                          type="text"
                          class="form-control"
                          placeholder=" Reference de l'annonce"
                          name="reference"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <br />
                    <h6 id="gras" className="latest-product__item">
                      Prix
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
                          id="recherchePlace"
                          type="text"
                          class="form-control"
                          placeholder=" Budget min"
                          name="prix_min"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
                          id="recherchePlace"
                          type="text"
                          class="form-control"
                          placeholder=" Budget max"
                          name="prix_max"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <br></br>

                    <h6 id="gras" className="latest-product__item">
                      Poids Environ
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
                          id="recherchePlace"
                          type="text"
                          class="form-control"
                          placeholder=" Poids min"
                          name="poids_min"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
                          id="recherchePlace"
                          type="text"
                          class="form-control"
                          placeholder=" Poids max"
                          name="poids_max"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <br></br>

                    <h6 id="gras" className="latest-product__item">
                      Ville
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <Select
                          value={selectedOptionVille}
                          onChange={this.handleChangeVille}
                          options={optionsVille}
                          placeholder=" Ville"

                        // className="Select"
                        />
                        <br></br>
                        <br></br>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        {/* <button className="btn btn-success" onClick={this.handelChercher}> Rechercher </button><br/> */}
                        <button
                          id="roundB"
                          className="newBtn site-btn"
                          onClick={this.handelChercher} >
                          <i className="fa fa-search "></i>

                          {" "}
                          Rechercher{" "}
                        </button>
                        <br></br>
                        <br></br>
                        <button
                          id="roundB"
                          className="newBtn site-btn"
                          onClick={this.handelReinitialiser} >
                          <i className="fa fa-refresh"></i>
                          {" "}
                          Reinitialiser{" "}
                        </button>
                        <br></br>
                        <br></br>
                      </div>
                    </div>

                    {/* <label className="latest-product__item">
                      <input name="withImages" type="checkbox" /> Avec photos
                    </label> */}

                    {/* <label className="latest-product__item">
                      <input name="withVideos" type="checkbox" /> Avec video
                    </label> */}
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-7">
                {/**Text Marketing
                 * <div id="centrerT" className="container">
                  <p>Insert text here</p>
                </div> 
                Fin Text Marketing */}


                <div className="filter__item">
                  <div>
                    <div id="filterPlace" className="col-lg-5 col-md-5 fa ">
                      <Select
                        id="filterPlace"
                        value={this.state.selectedOptionSort}
                        onChange={this.sortData}
                        options={optionsSort}
                        placeholder="&#xf161; Trier par"

                      />
                    </div>
                  </div>

                  <br></br>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="filter__found text-left">
                        <h4>
                          <span id="nbEspece">
                            {" "}
                            {this.state.Annonces.length}
                          </span>{" "}
                          Annonces disponibles à vendre{" "}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/*<!-- Sheeps Grid Section Begin --> */}
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
                      {this.state.Annonces.length === 0 ? <div className="text-center my-5">
                        <p style={{ color: "#fba502" }}>

                          <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i>
                        </p>

                        <h3 style={{ color: "#28a745" }}>Pas d'annonce disponible à vendre !</h3>
                      </div> : <div className="row">
                        {currentAnnonces.map((Annonces) => (
                          <div className="col-lg-4  col-sm-6">

                            <div id="anonce" class="product__item">
                              <div
                                class="product__item__pic set-bg"
                                data-setbg={Annonces.images}
                              >

                                <img
                                  src={Annonces.image_face}
                                  class="product__item__pic set-bg"
                                />

                                <ul class="product__item__pic__hover">
                                  {/* <li>
                              <a
                                id={Annonces._id}
                                onClick={(e) =>
                                  this.handleFavoris(e.currentTarget.id)
                                }
                              >
                                <i className="fa fa-heart"></i>
                              </a>
                            </li> */}
                                  <li>
                                    <Link to={`/DetailsMouton/${Annonces._id.$oid}`}>
                                      <a href="#">
                                        <i class="fa fa-eye"></i>
                                      </a>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              {Annonces.anoc ?
                                <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} class=" badge badge-success py-1 w-100  ">
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span>Labélisé ANOC</span>  </h1>
                                :
                                <span className="badge pt-3 w-100  mt-1  ">{"  "}</span>}

                              <div className="product__item__text p-2 text-justify">

                                <h6 className=" nbrm" style={{ color: "black", fontSize: "18px" }}>

                                  <img style={{ width: "18px", height: "20px", marginBottom: "5px" }}
                                    data-imgbigurl="Images/sheep-head.png"
                                    src="Images/sheep-head.png"
                                    alt=""
                                  />{" " + Annonces.espece}

                                  <span className="float-right">
                                    <FaShapes />{" " + Annonces.race}
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
                                  <i class="fa fa-map-marker"></i> {Annonces.localisation}
                                </h6>
                                <h5 style={{color:"rgb(187, 33, 36)"}} className="  mt-4">
                                  <i class="fa fa-usd" aria-hidden="true"></i>
                                  {" "}
                                  {Annonces.prix + "  Dhs"}
                                </h5>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                      }

                      <div className="center-div">
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
                      </div>
                      <br></br>
                    </div>
                  )}
                  {/* <!-- Sheeps Grid Section End --> */}
                </div>

              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default HomeSheeps;
