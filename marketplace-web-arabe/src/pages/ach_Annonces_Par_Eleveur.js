import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import {FormattedMessage} from 'react-intl'

class AllOffers extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      loading: true,
      AnnoncesN: [],
      Annonces: [],
      Eleveurs: [],
      EleveursN: [],
      activePage: 1,
      nombrePages: [],
      currentPage: 1,
      eleveursPerPage: 6,
      redirect: false,
      Disabled: true,
      selectedOptionRace: null,
      race: [],
      selectedOptionRegions: null,
      optionsRegions: [],
      selectedOptionVille: null,
      optionsVille: [],
      conditions: {
        order_by: "espece",
        order_mode: "asc",
      },
      redirect: false,

      selectedOptionSort: null,
      optionsSort: [
        { value: "rating", label: (<> <i className="fa fa-star-o text-warning fa-sm"></i>  <FormattedMessage id="eleveurs_etoile"></FormattedMessage>[5 <i className="fa fa-long-arrow-right  "></i> 1] </>) },
        { value: "rating_dec", label: (<> <i className="fa fa-star-o text-warning fa-sm" style={{ color: "#ebebeb" }}></i>  <FormattedMessage id="eleveurs_etoile"></FormattedMessage> [1 <i className="fa fa-long-arrow-right  "></i>5] </>) },
      ],
    };

    this.onChange = this.onChange.bind(this);
    this.handelChercher = this.handelChercher.bind(this);
    this.handelReinitialiser = this.handelReinitialiser.bind(this);
    this.sortData = this.sortData.bind(this);
    this.paginate = this.paginate.bind(this);
  }
  nombre(eleveur) {
    return this.state.AnnoncesN.filter((esp) => esp.id_eleveur === eleveur._id && esp.statut !== "produit avarié");
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

   // if (!token || expiredTimeToken < formatted_date) {
    //  this.props.history.push("/login");
   // } else {
      this.setState({ loading: true }, () => {
        axios
          .get("http://127.0.0.1:8000/api/eleveur", {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
            },
            params: {
              order_by: "espece",
              order_mode: "asc",
            },
          })
          .then((res) => {

            this.setState({
              EleveursN: res.data.filter(
                (Eleveurs) => Eleveurs.Especes !== undefined
              ),

              Eleveurs: res.data,
              loading: false,

            });
            const elv = this.state.Eleveurs.filter(
              (Eleveurs) => Eleveurs.Especes !== undefined
            );

            //region
            let regions = [];
            Object.getOwnPropertyNames(this.groupBy(res.data, 'region')).map((e) => {
              regions.splice(0, 0, { "value": e, "label": e });
            });
            /**ville */
            let allville = [];
            elv.map((e) => {
              allville.splice(0, 0, { "value": e.ville, "label": e.ville });
            });

            allville = Array.from(new Set(allville.map(s => s.value))).map(value => {
              return { value: value, label: allville.find(s => s.value === value).label }
            });
            this.setState({ optionsVille: allville, optionsRegions: regions })
            const pageNumbers = [];
            for (
              let i = 1;
              i <=
              Math.ceil(elv.length / this.state.eleveursPerPage);
              i++
            ) {
              pageNumbers.push(i);
            }
            this.setState({ nombrePages: pageNumbers });

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
                //espece
                let espece = [];
                Object.getOwnPropertyNames(this.groupBy(res.data.filter((f) => f.statut != "produit avarié"), 'espece')).map((e) => {
                  espece.splice(0, 0, { "value": e, "label": e });
                });

                this.setState({
                  optionsEspece: espece,
                  AnnoncesN: res.data,
                  Annonces: res.data,
                  loading: false,
                });
              })
          });
      });
 //   }
  }
  handleChangeEspece = (selectedOptionEspece) => {
    this.setState({ selectedOptionRace: null, selectedOptionEspece: selectedOptionEspece })
    let annonce = this.state.AnnoncesN;
    let c = selectedOptionEspece.value
    let races = [];
    let catg = [];


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

  handleChangeVille = (selectedOptionVille) => {
    this.setState({ selectedOptionVille }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          ville: this.state.selectedOptionVille.value,

        }),
      })
    );
  };
  handleChangeRegion = (selectedOptionRegions) => {
    this.setState({ selectedOptionVille: null, selectedOptionRegions: selectedOptionRegions });
    let eleveurs = this.state.EleveursN;
    let c = selectedOptionRegions.value
    let villes = [];
    let v = [];
    (this.groupBy(eleveurs, 'region')[c]).map((m) => { villes.push(m.ville) })
    villes = [...new Set(villes)];
    villes.map((e) => { v.splice(0, 0, { "value": e, "label": e }) });
    this.setState({
      optionsVille: v,
      conditions: Object.assign(this.state.conditions, {
        region: c,
        ville: null,
      }),
    })
  };

  sortData(e) {
    const sortProperty = Object.values(e)[0];
    const sorted = this.state.Eleveurs;

    if (sortProperty === "rating_dec") {
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => a["rating"] - b["rating"]);
        this.setState({
          Eleveurs: sorted,
          loading: false
        });
      });
    } else if (sortProperty === "rating") {
      const sort_ = sortProperty;
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => b[sort_] - a[sort_]);
        this.setState({ Eleveurs: sorted, loading: false });
      });
    }
  }

  paginate(pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  handelReinitialiser() {

    this.setState({ loading: true }, () => {
      axios
        .get("http://127.0.0.1:8000/api/eleveur", {
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
            Eleveurs: res.data,
            loading: false,
            conditions: {
              order_by: "espece",
              order_mode: "asc",
            },
            selectedOptionEspece: null,
            selectedOptionRace: null,
            Disabled: true,
            selectedOptionVille: null,
            selectedOptionRegions: null,
          });

          const elv = this.state.Eleveurs.filter(
            (Eleveurs) => Eleveurs.Especes !== undefined
          );
          let regions = [];
          Object.getOwnPropertyNames(this.groupBy(elv, 'region')).map((e) => {
            regions.splice(0, 0, { "value": e, "label": e });
          });

          let allville = [];
          elv.map((e) => {
            allville.splice(0, 0, { "value": e.ville, "label": e.ville });
          });

          allville = Array.from(new Set(allville.map(s => s.value))).map(value => {
            return {
              value: value,
              label: allville.find(s => s.value === value).label
            }
          });
          this.setState({
            optionsVille: allville,
            optionsRegions: regions
          })
          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.Eleveurs.length / this.state.eleveursPerPage);
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
        .get("http://127.0.0.1:8000/api/eleveur", {
          headers: {
            // "x-access-token": token, // the token is a variable which holds the token
            "Content-Type": "application/json",
          },
          params: this.state.conditions,
        })
        .then((res) => {
          this.setState({
            Eleveurs: res.data,
            loading: false,
          });

          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(
              this.state.Eleveurs.length / this.state.eleveursPerPage
            );
            i++
          ) {
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

  render() {
    var elv = this.state.Eleveurs.filter(
      (Eleveurs) => Eleveurs.Especes !== undefined
    );

    const indexOfLastEleveur =
      this.state.currentPage * this.state.eleveursPerPage;
    const indexOfFirstEleveur =
      indexOfLastEleveur - this.state.eleveursPerPage;
    const currentEleveurs = elv.slice(
      indexOfFirstEleveur,
      indexOfLastEleveur);
    const { loading } = this.state;
    const { selectedOptionRace } = this.state;
    const { selectedOptionEspece } = this.state;
    const { optionsEspece } = this.state;
    const { selectedOptionVille } = this.state;
    const { selectedOptionRegions } = this.state;
    const { optionsVille } = this.state;
    const { optionsRegions } = this.state;
    const { optionsSort } = this.state;
    return (
      <div>
        <section
          style={localStorage.getItem("lg") == "ar" ? { direction: "rtl" } : {}}
          className=""
        >
          <br></br>
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div 
                  style={
                    localStorage.getItem("lg") == "ar"
                      ? { direction: "rtl", textAlign: "right" }
                      : {}
                  }
                   id="rechercher" className="col-lg-12">
                  <br></br>
                  <br></br>
                  <div className="sidebar__item">
                    <h4>
                      <FormattedMessage id="eleveurs_rechercher">
                      </FormattedMessage>
                    </h4>

                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_espece">
                      </FormattedMessage>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_espece">
                          {(placeholder) => (
                            <Select
                            value={selectedOptionEspece}
                            onChange={this.handleChangeEspece}
                            options={optionsEspece}
                            placeholder={placeholder}
                            required
                          />
                          )}
                        
                        </FormattedMessage>
                        <br></br>
                      </div>
                    </div>

                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_race"></FormattedMessage>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_race">
                          {(placeholder) =>(
                            <Select
                            id="recherchePlace"
                            isDisabled={this.state.Disabled}
                            value={selectedOptionRace}
                            onChange={this.handleChangeRace}
                            options={this.state.race}
                            placeholder={placeholder}
                            required
                          />
                          )}
                        
                        </FormattedMessage>

                      </div>
                    </div>
                    <br></br>
                    <h6 id="gras" className="latest-product__item">
                    <FormattedMessage id="eleveurs_region"></FormattedMessage>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_region">
                          {(placeholder) => (
                            <Select
                              value={selectedOptionRegions}
                              onChange={this.handleChangeRegion}
                              options={optionsRegions}
                              placeholder={placeholder}
                              required
                              // className="Select"
                            />
                          )}
                          </FormattedMessage>
                        
                        <br></br>
                      </div>
                    </div>

                    <h6 id="gras" className="latest-product__item">
                    <FormattedMessage id="eleveurs_ville"></FormattedMessage>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_ville">
                            {(placeholder) => (
                              <Select
                              value={selectedOptionVille}
                              onChange={this.handleChangeVille}
                              options={optionsVille}
                              placeholder={placeholder}
    
                            />
                            )}
                        
                        </FormattedMessage>
                        <br></br>
                        <br></br>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <button
                          id="roundB"
                          className="newBtn site-btn"
                          onClick={this.handelChercher} >
                          <i className="fa fa-search "></i>
                          {" "}
                          <FormattedMessage id="eleveurs_rechercher"></FormattedMessage>{" "}
                        </button>
                        <br></br>
                        <br></br>
                        <button
                          id="roundB"
                          className="newBtn site-btn"
                          onClick={this.handelReinitialiser} >
                          <i className="fa fa-refresh"></i>
                          {" "}
                          <FormattedMessage id="eleveurs_reinitialiser"></FormattedMessage>{" "}
                        </button>
                        <br></br>
                        <br></br>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-7">
                {/**Text Marketing
                 * <div id="centrerT" className="container">
                  <p>Insert text here</p>
                </div> 
                Fin Text Marketing */}
                <div style={localStorage.getItem("lg")=="ar"?{"textAlignLast":"right"}:{}} className="filter__item">
                  <div>
                    <div id="filterPlace" className="col-lg-5 col-md-5 fa ">
                      <FormattedMessage 
                      id="eleveurs_trie"
                      values={{ icon: <>&#xf161;</> }}>
                        {(placeholder) => (
                          <Select
                        id="filterPlace"
                        value={this.state.selectedOptionSort}
                        onChange={this.sortData}
                        options={optionsSort}
                        placeholder={placeholder}
                      />
                        )}
                      </FormattedMessage>
                    </div>
                  </div>

                  <br></br>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="filter__found text-left">
                        <h4>    <FormattedMessage id="eleveurs_nos_eleveurs"></FormattedMessage>{" : "}<span id="nbEspece">
                          {" "}
                          {elv.length}
                        </span>{" "} </h4>
                      </div>
                    </div>
                  </div>
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
                      {elv.length === 0 ? <div className="text-center my-5">
                        <p style={{ color: "#fba502" }}>

                          <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i>
                        </p>

                        <h3 style={{ color: "#28a745" }}><FormattedMessage id="eleveurs_pas_eleveur"></FormattedMessage></h3>
                      </div> : <div className="row">
                        {currentEleveurs.map((Eleveurs) => (
                          <div className="col-lg-4  col-sm-6">

                            <div id="anonce" className="product__item">
                              <div
                                className="product__item__pic set-bg"
                                data-setbg={Eleveurs.photo_profil} >

                                <img
                                  src={Eleveurs.photo_profil}
                                  className="product__item__pic set-bg" />

                                <ul className="product__item__pic__hover">
                                  <Link
                                    key={Eleveurs._id}
                                    to={{
                                      pathname: `/HomeSheepsParEleveur/${Eleveurs._id}`,
                                      state: {
                                        id: {
                                          id: Eleveurs,
                                        },
                                      },
                                    }}
                                    id={Eleveurs._id}  >
                                    <li>
                                      <a href="ToutesLesAnnoncesElveur"> {" "} <i className="fa fa-eye"></i>{" "} </a>
                                    </li>
                                  </Link>
                                </ul>
                              </div>
                              {Eleveurs.anoc ?
                                <h1 style={{ borderRadius: "0% 0% 0% 40%", fontSize: "14px" }} className=" badge badge-success pt-2 w-100  ">
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span>Labélisé ANOC</span>  </h1>
                                :
                                <span className="badge pt-3 w-100 mt-1   ">{"  "}</span>}
                              <div className="product__item__text p-2 text-justify">
                                <h6 >
                                  <i className="fa fa-user-circle-o"></i>{" " + Eleveurs.prenom + "         " + Eleveurs.nom}
                                  <span className="float-right rounded  border-dark border pr-1">
                                    {" "}<img style={{ width: "18px", height: "20px", marginBottom: "5px" }}
                                      data-imgbigurl="Images/sheep-head.png"
                                      src="Images/sheep-head.png"
                                      alt=""
                                    />{"  " + this.nombre(Eleveurs).length + " "}

                                  </span>
                                </h6>
                                <h6 >  <i className="fa fa-map"></i>{" " + Eleveurs.region} </h6>
                                <h6><i className="fa fa-home"></i> {Eleveurs.ville}</h6>
                                <h5>
                                  <Box style={{ textAlign: "center", marginBottom: "0px" }} component="fieldset" mb={3} borderColor="transparent">
                                    <Rating name="read-only" value={Eleveurs.rating} readOnly />
                                  </Box>
                                </h5>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>}


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
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default AllOffers;
