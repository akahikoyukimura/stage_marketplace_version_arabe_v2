import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { GiWeight, GiSheep } from 'react-icons/gi';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import ReactPaginate from "react-paginate";
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { FaShapes } from 'react-icons/fa';
import { Badge, Modal, Button } from 'react-bootstrap'

class HomeSheepsParEleveur extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      Annonces: [],
      AnnoncesN: [],
      loading: true,
      Disabled: true,
      longueur: 0,
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      annoncesPerPage: 6,
      selectedOptionRace: null,
      Eleveur: {},
      selectedOptionEspece: null,
      optionsEspece: [],
      selectedOptionVille: null,
      optionsVille: [],
      conditions: {
        order_by: "race",
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
      showSearchModal: false,

    };
    this.onChange = this.onChange.bind(this);
    this.handelChercher = this.handelChercher.bind(this);
    this.handelReinitialiser = this.handelReinitialiser.bind(this);

    this.sortData = this.sortData.bind(this);

    this.paginate = this.paginate.bind(this);
  }
  showSearch = () => {
    this.setState({
      showSearchModal: !this.state.showSearchModal
    })
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
  handelReinitialiser() {
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/Espece", {
          headers: {

            "Content-Type": "application/json",

          },
          params: {
            order_by: "espece",
            order_mode: "asc",
          },
        })
        .then((res) => {
          this.setState({
            Annonces: res.data.filter((data) => data.id_eleveur === this.state.Eleveur._id).filter((f) => f.statut !== "produit avarié"),
            loading: false,
            conditions: {
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
          for (let i = 1; i <= Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage); i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers,showSearchModal:false  });
        });
    });

  }

  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
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

    //if (!token || expiredTimeToken < formatted_date) {
    //   this.props.history.push("/login");
    // } else {
    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/eleveur/" + this.props.match.params.id, {
          headers: {
            // "x-access-token": token, // the token is a variable which holds the token
          },

        })
        .then((res) => {

          this.setState({
            Eleveur: res.data

          }, () => {
            console.log(this.state.Eleveur)

            axios
              .get("http://127.0.0.1:8000/api/Espece", {
                headers: {
                  // "x-access-token": token, // the token is a variable which holds the token
                },
                params: {
                  id_eleveur: this.state.Eleveur._id,
                  order_by: "race",
                  order_mode: "asc",
                },
              })
              .then((res) => {
                //espece
                let espece = [];
                Object.getOwnPropertyNames(this.groupBy(res.data.filter((f) => f.statut !== "produit avarié"), 'espece')).map((e) => {
                  espece.splice(0, 0, { "value": e, "label": e });
                });

                let ville = [];
                res.data.map((e) => {
                  ville.splice(0, 0, { "value": e.localisation, "label": e.localisation });
                });
                ville = Array.from(new Set(ville.map(s => s.value))).map(value => {
                  return { value: value, label: ville.find(s => s.value === value).label }
                });
                this.setState({
                  optionsEspece: espece,
                  AnnoncesN: res.data.filter((f) => f.statut !== "produit avarié"),
                  Annonces: res.data.filter((f) => f.statut !== "produit avarié"),
                  loading: false,
                  optionsVille: [...new Set(ville)]

                });
                const pageNumbers = [];
                for (let i = 1; i <= Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage); i++
                ) {
                  pageNumbers.push(i);
                }
                this.setState({ nombrePages: pageNumbers });
              });

          });

        });


    });
    //}
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

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }


  onChange(e) {
    const n = e.target.name,
      v = e.target.value;

    this.setState({
      conditions: Object.assign(this.state.conditions, { [n]: v }),
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
            Annonces: res.data.filter((data) => data.id_eleveur === this.state.Eleveur._id).filter((f) => f.statut !== "produit avarié"),
            loading: false,
          });
          const pageNumbers = [];
          for (let i = 1; i <= Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage); i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers,showSearchModal:false });
        });
    });
  }

  annonceVision(a) {
    if (a.race === undefined) {
      return " ";
    } else return a.race;
  }

  render() {
    const indexOfLastAnnonce =
      this.state.currentPage * this.state.annoncesPerPage;
    const indexOfFirstAnnonce = indexOfLastAnnonce - this.state.annoncesPerPage;
    const currentAnnonces = this.state.Annonces.slice(indexOfFirstAnnonce, indexOfLastAnnonce);
    const { selectedOptionEspece } = this.state;
    const { optionsEspece } = this.state;
    const { selectedOptionRace } = this.state;
    const { optionsRace } = this.state;
    const { selectedOptionVille } = this.state;
    const { optionsVille } = this.state;
    const { optionsSort } = this.state;
    const { loading } = this.state;
    var reserv = this.state.Annonces.filter(
      (Annonces) => Annonces.statut === "réservé"
    );
    var dispo = this.state.Annonces.filter(
      (Annonces) => Annonces.statut === "disponible"
    );
    var vendu = this.state.Annonces.filter(
      (Annonces) => Annonces.statut === "vendu"
    );

    return (
      <div>
        
        {/**modal de recherche */}
        <Modal

show={this.state.showSearchModal}
onHide={this.showSearch}
backdrop="static"
keyboard={false}
id="modalRecherche"
>
<Modal.Header closeButton>
  <h4 className="text-left mt-4">Rechercher</h4>
</Modal.Header>
<Modal.Body>

  <div className="sidebar__item" style={{ backgroundColor:"#F3F6FA"}}>
  <div className="">
                <div  className="col-lg-12">
                  <br></br>
                  <br></br>
                  <div className="sidebar__item">
                   

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
                      Poids
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
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
                  </div>
                </div>
              </div>

 </div>


</Modal.Body>

</Modal>

        {/**modal de recherche */}
        <section className="">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div id="rechercher" className="rechercherD col-lg-12">
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
                      Poids
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
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
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12">
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
                  <div className="filter__item">
                      <div className="row"> 
                      <div className="col-6">{" "}</div>
                      <div className="col-5">{" "}</div>
                        <div onClick={this.showSearch} className='ModalSearch'>
<i class="fa fa-search fa-lg" aria-hidden="true"></i>
</div></div>
                
                    <div className="row">
                      <div className="col-lg-4 col-md-5"></div>
                      <div className="col-lg-12 col-md-12">
                        <br />
                        <div class="row mb-5">
                          <div class="col-sm"> <img
                            src={this.state.Eleveur.photo_profil}
                            class=" product__item__pic  set-bg" />
                            {this.state.Eleveur.anoc ?
                              <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} class=" badge badge-success  pt-1 w-100  ">
                                <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                <span>Labélisé ANOC</span>  </h1>
                              :
                              <span className="badge pt-3 w-100 mt-1   ">{"  "}</span>}</div>
                          <div class="col-sm" >
                            <h3 className="mt-1">
                              <Box component="fieldset" mb={3} borderColor="transparent">
                                Eleveur :{" "}
                                {this.state.Eleveur.nom +
                                  " " +
                                  this.state.Eleveur.prenom}{" "}{" "}
                                <Rating name="read-only" value={this.state.Eleveur.rating} readOnly />
                              </Box>
                            </h3>{" "}
                            <h6 className="my-2">  <i class="fa fa-map"></i> <b>Region  : </b>{" " + this.state.Eleveur.region} </h6>
                            <h6 className="mb-2"><i class="fa fa-home"></i>   <b>Ville : </b>{" " + this.state.Eleveur.ville}</h6>
                            <h6 className="mb-2"><i class="fa fa-phone" aria-hidden="true"></i>   <b>Telephone : </b>{" " + this.state.Eleveur.tel}</h6>
                            <h6 className="">  <img style={{ width: "18px", height: "20px", marginBottom: "5px" }}
                              data-imgbigurl="Images/sheep-head.png"
                              src="Images/sheep-head.png"
                              alt=""
                            />   <b> <span id="nbEspece">
                              {this.state.Annonces.length}
                            </span>{" "}
                             Têtes au total</b></h6>
                            {this.state.Eleveur.anoc ?
                              <span className=" text-success" style={{ position: "relative", top: "40px" }}>
                                <HiOutlineBadgeCheck className=" mr-1 fa-lg " /> Le label de l'ANOC est un gage de la qualité du produit. <br></br></span>
                              : null}
                          </div>
                        </div>
                        <div>
                          <br></br></div>
                        <h6 id="centrerT" className="mt-3">
                          <b id="nbEspece">{vendu.length}{" "}</b> Vendus{" "}
                          <b className="ml-3" id="nbEspece">{dispo.length}{" "}</b> Disponibles{" "}
                          <b className="ml-3" id="nbEspece">{reserv.length}{" "}</b> Réservés{" "}
                        </h6>
                        <br></br>
                        <h5>Ce qu'il vous propose :</h5>
                        <br></br>
                        <div>
                          <div id="filterPlace" className="col-lg-5 col-md-5 fa ">
                            <Select
                              id="filterPlace"
                              value={this.state.selectedOptionSort}
                              onChange={this.sortData}
                              options={optionsSort}
                              placeholder="&#xf161; Trier par"
                            //
                            //f0b0

                            // className="Select"
                            />
                          </div>

                        </div>
                        <br></br>

                      </div>
                    </div>
                  </div>
                )}
                {/*<!-- Sheeps Grid Section Begin --> */}
                <div>
                  {loading ? (
                    null
                  ) : (
                    <div>
                      <div className="row">
                        {currentAnnonces.map((Annonces) => (
                          <div className="col-lg-4 col-md-6 col-sm-6">
                            <div id="anonce" className="product__item">
                              <div
                                className="product__item__pic set-bg"
                                data-setbg={Annonces.images}
                              >
                                <img
                                  src={Annonces.image_face}
                                  className="product__item__pic set-bg"
                                />

                                <ul className="product__item__pic__hover">

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
                                <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} class=" badge badge-success  pt-1 w-100  ">
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span>Labélisé ANOC</span>  </h1>
                                : <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} class=" badge  pt-4 w-100  ">

                                  <span>{" "} </span>  </h1>}
                              <div className="product__item__text p-2 text-justify">
                                <h6 ><GiSheep className=" mr-1 fa-lg " />{Annonces.espece}

                                  <span className="float-right">
                                    < FaShapes />{" " + this.annonceVision(Annonces)}
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
                                  {"         " + Annonces.prix + " Dhs"}
                                  <h5 style={{ color: "rgb(187, 33, 36)" }} className="  float-right" >
                                    {"         " + Annonces.statut}</h5></h5>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

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
                </div>

                {/*paginationElement*/}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default HomeSheepsParEleveur;
