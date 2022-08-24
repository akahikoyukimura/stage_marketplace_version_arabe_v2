import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { GiWeight} from "react-icons/gi";
import { IoMdMale } from "react-icons/io";
import { FaShapes } from "react-icons/fa";
import { MdCake } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import { Modal } from "react-bootstrap";
import Pagination from "react-js-pagination";
import RangeSlider from "react-bootstrap-range-slider";
import {FormattedMessage} from 'react-intl'

class HomeSheepsParEleveur extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      valueprice: null,
      valuepoids: null,
      poids_max: null,
      poids_min: null,
      prix_max: 10000,
      prix_min: 1,
      race:[],
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
      selectedOptionStatut: "",
      Eleveur: {},
      selectedOptionEspece: null,
      optionsEspece: [],
      selectedOptionVille: null,
      optionsVille: [],
      optionsRegions:[],
      conditions: {
        order_by: "race",
        order_mode: "asc",
      },
      redirect: false,
      selectedOptionSort: null,
      optionsSort: [
        { value: "prix", label: <FormattedMessage id="tout_les_annonces_moins_cher_au_plus" /> },
        { value: "prix_dec", label:<FormattedMessage id="tout_les_annonces_plus_cher_au_moins" /> },

        { value: "age", label: <FormattedMessage id="tout_les_annonces_plus_jeune_au_plus_age" /> },
        { value: "age_dec", label:<FormattedMessage id="tout_les_annonces_plus_age_au_plus_jeune" /> },

        { value: "poids", label: <FormattedMessage id="tout_les_annonces_moins_lourd_au_plus_lourd" /> },
        { value: "poids_dec", label:<FormattedMessage id="tout_les_annonces_plus_lourd_aumoins_lourd" /> },
      ],
      showSearchModal: false,
      statut: [
        { value: "vendu", label: <FormattedMessage id="homeSheep_vendu"/> },
        { value: "disponible", label: <FormattedMessage id="homeSheep_dispo"/> },
      ],
    };
    this.onChange = this.onChange.bind(this);
    this.handelChercher = this.handelChercher.bind(this);
    this.handelReinitialiser = this.handelReinitialiser.bind(this);

    this.sortData = this.sortData.bind(this);

    this.paginate = this.paginate.bind(this);
  }
  showSearch = () => {
    this.setState({
      showSearchModal: !this.state.showSearchModal,
    });
  };
  handleChangeEspece = (selectedOptionEspece) => {
    this.setState({
      selectedOptionRace: null,
      selectedOptionEspece: selectedOptionEspece,
    });
    let annonce = this.state.AnnoncesN;
    let c = selectedOptionEspece.value;
    console.log(c)
    let races = [];
    // let races_ar = [];
    let races_ar = [
      {value:"Boujâad",label:"أبي الجعد"},
      {value:"D’man (Daman)",label:"دمان"},
      {value:"Sardi",label:"سردي"},
      {value:"Timahdite (Bergui)",label:"تمحضيت"},
      {value:"Béni-Guil (Daghma)",label:"بني جيل (دغمة)"},
      {value:"El Hamra",label:"الحمرا"},
      {value:"Barcha",label: "البرشاء"},
      {value:"Noire", label:"الأسود"}
    ];


    let r = [];
    this.groupBy(annonce, "espece")[c].map((m) => {
      races.push(m.race);
      // if (localStorage.getItem("lg") == "ar") {
      //   races_ar.push(m.race_ar);
      // }
    });
    races = [...new Set(races)];
    // if (localStorage.getItem("lg") == "ar") {
    //   races = [...new Set(races_ar)];  // modifier
    // }
    races.map((e) => {
      r.splice(0, 0, { value: e, label: e });
    });

    // if (localStorage.getItem("lg") == "ar") {
    //   for (
    //     let index = 0, j = races_ar.length - 1;
    //     index < r.length, j >= 0;
    //     index++, j--
    //   ) {
    //     r[index].label = races_ar[j];
    //   }
    // }
    if (localStorage.getItem("lg") == "ar") {
      for (
        let index = 0;
        index < r.length;
        index++
      ) {
        for (let j = 0; j < races_ar.length; j++) {
          if(r[index].value===races_ar[j].value)
          r[index].label = races_ar[j].label;
          
        }
        
      }
    }


    this.setState({
      race: r,
      Disabled: false,
      conditions: Object.assign(this.state.conditions, {
        espece: c,
        race: null,
      }),
    });
    console.log(r);
  };

  // handleChangeEspece = (selectedOptionEspece) => {
  //   this.setState({
  //     selectedOptionRace: null,
  //     selectedOptionEspece: selectedOptionEspece,
  //   });
  //   let annonce = this.state.AnnoncesN;
  //   let c = selectedOptionEspece.value;
  //   let races = [];

  //   let r = [];

  //   this.groupBy(annonce, "espece")[c].map((m) => {
  //     races.push(m.race);
  //   });

  //   races = [...new Set(races)];
  //   races.map((e) => {
  //     r.splice(0, 0, { value: e, label: e });
  //   });
  //   this.setState({
  //     race: r,

  //     Disabled: false,
  //     conditions: Object.assign(this.state.conditions, {
  //       espece: c,
  //       race: null,
  //     }),
  //   });
  // };

  handleChangeRace = (selectedOptionRace) => {
    this.setState({ selectedOptionRace }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          race: this.state.selectedOptionRace.value,
        }),
      })
    );
  };
  handleChangeStatut = (Statut) => {
    this.setState({ Statut }, () =>
      this.setState({
        conditions: Object.assign(this.state.conditions, {
          statut: this.state.Statut.value,
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
            Annonces: res.data
              .filter((data) => data.id_eleveur === this.state.Eleveur._id)
              .filter((f) => f.statut !== "produit avarié"),
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
          var all = document.querySelectorAll(
            'input[name="reference"],input[name="prix_min"],input[name="prix_max"],input[name="poids_min"],input[name="poids_max"]'
          );
          Array.from(all).map((a) => (a.value = null));

          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage);
            i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers, showSearchModal: false });
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
        .get(
          "http://127.0.0.1:8000/api/eleveur/" + this.props.match.params.id,
          {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
            },
          }
        )
        .then((res) => {
          this.setState(
            {
              Eleveur: res.data,
            },
            () => {
              console.log(this.state.Eleveur);

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
                  Object.getOwnPropertyNames(
                    this.groupBy(
                      res.data.filter((f) => f.statut !== "produit avarié"),
                      "espece"
                    )
                  ).map(
                    
                    (e) => {
                      localStorage.getItem("lg") == "ar"
                        ? e == "mouton"
                          ? espece.splice(0, 0, { value: "mouton", label: "خروف" })
                          : espece.splice(0, 0, { value: "chevre", label: "ماعز" })
                        : espece.splice(0, 0, { value: e, label: e });
                    }
                  );

                  let race1=[];
                  let races=[];
                  let races_ar=[
                    {value:"Béni-Guil (Daghma)", label:"بني جيل (دغمة)"},
                    {value:"Timahdite (Bergui)", label:"تمحضيت (بركي)"},
                    {value:"Sardi", label:"سردي"},
                    {value:"D’man (Daman)", label:"دمان"},
                    {value:"Boujâad", label:"بوجعد"},
                    {value:"El Hamra", label:"الحمرا"},

                  ];
                   //ville
                   let ville = [];
                   let villes=[]
                   let villes_ar = [
                     {value:"ERRACHIDIA",label:"الرشيدية"},
                     {value:"Midelt",label:"ميدلت"},
                     {value:"Safi",label:"اسفي"},
                     {value:"Jerada",label:"جرادة"},
                     {value:"Benslimane",label:"بن سليمان"},
                     {value:"Mohammedia",label:"المحمدية"},
                     {value:"Taourirt",label:"تاوريرت"},
                     {value:"Ifrane",label:"افران"},
                     {value:"Khouribga",label:"خريبݣة"},
                     {value:"OUARZAZATE",label:"ورزازات"},
                     {value:"El Kelaâ des Sraghna",label:"قلعة السراغنة"},
                   ];
                   let region1=[];
                   let regions=[];
                   let regions_ar = 
                   [
                     {value:"Tanger-Tétouan-Al Hoceïma",label:" طنجة - تطوان - الحسيمة"},
                     {value:"Béni Mella-Khénifra",label:"بني ملال خنيفرة"},
                     {value:"Draa tafilalt",label:"درعة - تافيلالت"},
                     {value:"l'Oriental",label:"الجهة الشرقية"},
                     {value:"Benslimane",label: "درعة - تافيلالت"},
                     {value:"Mohammedia",label: "درعة - تافيلالت"},
                     {value:"DARAA TAFILALTE",label: "درعة - تافيلالت"},
                     {value:"casablanca-settat",label:"الدار البيضاء - سطات"},
                     {value:"Marrakech-Safi",label:"مراكش - أسفي"},
                     {value:"Fès-Meknès", label:"فاس مكناس"}, 
                     {value:"Mohammedia",label: "درعة - تافيلالت"},
                   ]
 
                  let minP = 100000;
                  let maxP = 1;
                  let minW = 100000;
                  let maxW = 1;

                  res.data.map((e) => {
                    if (e.prix > maxP) {
                      maxP = e.prix;
                    }
                    if (e.prix < minP) {
                      minP = e.prix;
                    }
                    if (e.poids > maxW) {
                      maxW = e.poids;
                    }
                    if (e.poids < minW) {
                      minW = e.poids;
                    }
                    villes.push(e.localisation);
                    regions.push(e.region);
                    
                  });
                  this.setState({
                    prix_max: maxP,
                    prix_min: minP,
                    poids_min: minW,
                    poids_max: maxW,
                  });

                  // ville = Array.from(new Set(ville.map((s) => s.value))).map(
                  //   (value) => {
                  //     return {
                  //       value: value,
                  //       label: ville.find((s) => s.value === value).label,
                  //     };
                  //   }
                  // );

                  //ville
                  villes.push("Ifrane")
                  villes=[...new Set(villes)];
                  villes.map((e) => {
                    ville.splice(0, 0, {value: e, label: e})
                  })
                 
                  if (localStorage.getItem("lg") === "ar") {
                
                    for (
                      let index = 0;
                      index < ville.length;
                      index++
                    ) {
                      for (let j = 0; j < villes_ar.length; j++) {
                        if(ville[index].value===villes_ar[j].value)
                        ville[index].label = villes_ar[j].label;
                        
                      }
                      
                    }
      
                  }

                  //region
                  //region
                  regions.push("Fès-Meknès");
                  regions=[...new Set(regions)];
                  regions.map((e) => {
                    region1.splice(0, 0, {value: e, label: e})
                  })
                 
                  if (localStorage.getItem("lg") === "ar") {
                
                  for (
                    let index = 0;
                    index < region1.length;
                    index++
                  ) {
                    for (let j = 0; j < regions_ar.length; j++) {
                      if(region1[index].value===regions_ar[j].value)
                      region1[index].label = regions_ar[j].label;
                      
                    }
                    
                  }
      
                }

                 //race
                 races=[...new Set(races)];
                 races.map((e) => {
                   race1.splice(0, 0, {value: e, label: e})
                 })
                
                 if (localStorage.getItem("lg") === "ar") {
               
                   for (
                     let index = 0;
                     index < race1.length;
                     index++
                   ) {
                     for (let j = 0; j < races_ar.length; j++) {
                       if(race1[index].value===races_ar[j].value)
                       race1[index].label = races_ar[j].label;
                       
                     }
                     
                   }
     
                 }

                  this.setState({
                    optionsVille: ville,
                    optionsRegions: region1,
                    optionsEspece: espece,
                    optionsRace: race1,
                    AnnoncesN: res.data.filter(
                      (f) => f.statut !== "produit avarié"
                    ),
                    Annonces: res.data.filter(
                      (f) => f.statut !== "produit avarié"
                    ),
                    loading: false,
                    optionsVille: [...new Set(ville)],
                  });
                  const pageNumbers = [];
                  for (
                    let i = 1;
                    i <=
                    Math.ceil(
                      this.state.Annonces.length / this.state.annoncesPerPage
                    );
                    i++
                  ) {
                    pageNumbers.push(i);
                  }
                  this.setState({ nombrePages: pageNumbers });
                });
            }
          );
        });
    });
    // axios
    //   .get("http://127.0.0.1:8000/api/EspecesMinMax", {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     params: this.state.conditions,
    //   })
    //   .then((res) => {
    //     this.setState({
    //       prix_max: res.data.all.prix_max,
    //       prix_min: res.data.all.prix_min,
    //       poids_min: res.data.all.poids_min,
    //       poids_max: res.data.all.poids_max,
    //     });
    //   });

    //}
  }

  sortData(e) {
    const sortProperty = Object.values(e)[0];
    const sorted = this.state.Annonces;
    this.setState({
      selectedOptionSort: Object.values(e)[1],
    });
    if (
      sortProperty === "prix" ||
      sortProperty === "poids" ||
      sortProperty === "age"
    ) {
      this.setState({ loading: true }, () => {
        sorted.sort((a, b) => a[sortProperty] - b[sortProperty]);
        this.setState({
          Annonces: sorted,
          loading: false,
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
    } else {
      this.setState({ loading: true }, () => {
        sorted.sort(function (a, b) {
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
    console.log(this.state.conditions);
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
            Annonces: res.data
              .filter((data) => data.id_eleveur === this.state.Eleveur._id)
              .filter((f) => f.statut !== "produit avarié"),
            loading: false,
          });
          const pageNumbers = [];
          for (
            let i = 1;
            i <=
            Math.ceil(this.state.Annonces.length / this.state.annoncesPerPage);
            i++
          ) {
            pageNumbers.push(i);
          }
          this.setState({ nombrePages: pageNumbers, showSearchModal: false });
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
    const currentAnnonces = this.state.Annonces.slice(
      indexOfFirstAnnonce,
      indexOfLastAnnonce
    );
    const { selectedOptionEspece } = this.state;
    const { optionsEspece } = this.state;
    const { selectedOptionRace } = this.state;
    const { selectedOptionVille } = this.state;
    const { optionsVille } = this.state;
    const { optionsRegions} = this.state;
    const { optionsSort } = this.state;
    const { loading } = this.state;
    const { valueprice } = this.state;
    const { valuepoids } = this.state;

    const { poids_max } = this.state;
    const { poids_min } = this.state;

    const { prix_max } = this.state;
    const { prix_min } = this.state;
    var dispo = this.state.Annonces.filter(
      (Annonces) => Annonces.statut === "disponible"
    );
    var vendu = this.state.Annonces.filter(
      (Annonces) => Annonces.statut === "vendu" || Annonces.statut === "réservé"
    );

    return (
      <div style={localStorage.getItem("lg") == "ar" ? { direction: "rtl" } : {}}>
        {/**modal de recherche */}
        <section className="search-header">
          <div
            style={{
              backgroundImage:
                'url("https://i.ibb.co/88zvScY/secondsectionespece.jpg")',
              backgroundSize: "cover",
              height: "100%",
            }}
          >
            <div className="searchheader">
              {/* <div
                className="col-lg-1 col-md-3"
                style={
                  localStorage.getItem("lg") == "ar"
                    ? {
                        display: "table-cell",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }
                    : { display: "table-cell", verticalAlign: "middle" }
                }      

                  hada li kan 9bel f l classname col-lg-1 col-md-3
                ></div> */}
              <div
                className="col-lg-1 col-md-3"
                style={
                  localStorage.getItem("lg") == "ar"
                    ? {
                        display: "table-cell",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }
                    : { display: "table-cell", verticalAlign: "middle" }
                }          
                >
                <FormattedMessage id="eleveurs_espece">
                  {(espece) => (
                    <Select
                    value={selectedOptionEspece}
                    onChange={this.handleChangeEspece}
                    options={optionsEspece}
                    placeholder={espece}
                    required
                  />
                  )}
                
                </FormattedMessage>
              </div>
              

              {/* <div
                className="col-lg-1 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <Select
                  value={selectedOptionVille}
                  onChange={this.handleChangeVille}
                  options={optionsVille}
                  placeholder=" Ville"
                />
              </div> */}
              
              <div
                className="col-lg-1 col-md-3"
                style={
                  localStorage.getItem("lg") == "ar"
                    ? {
                        display: "table-cell",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }
                    : { display: "table-cell", verticalAlign: "middle" }
                }
                >
                <FormattedMessage id="eleveurs_statut">
                  {(statut) => (
                    <Select
                    isDisabled={this.state.Disabled}
                    value={this.selectedOptionStatut}
                    onChange={this.handleChangeStatut}
                    options={this.state.statut}
                    placeholder={statut}
                    required
                  />
                  )}
                
                </FormattedMessage>
              </div>
              <div
                className="col-lg-1 col-md-3"
                style={
                  localStorage.getItem("lg") == "ar"
                    ? {
                        display: "table-cell",
                        verticalAlign: "middle",
                        textAlign: "right",
                      }
                    : { display: "table-cell", verticalAlign: "middle" }
                }
                >
                <FormattedMessage id="eleveurs_race">
                  {(race) =>(
                    <Select
                    id="recherchePlace"
                    isDisabled={this.state.Disabled}
                    value={selectedOptionRace}
                    onChange={this.handleChangeRace}
                    options={this.state.race}
                    placeholder={race}
                    required
                  />
                  )}
                
                </FormattedMessage>
              </div>

              {/*             <div className="col-lg-3 col-md-3">
                <input
                  id="recherchePlace"
                  type="text"
                  className="form-control"
                  placeholder=" Reference de l'annonce"
                  name="reference"
                  onChange={this.onChange}
                />
              </div> */}
              {/*             <div className="col-lg-2 col-md-3">
                <input
                  id="recherchePlace"
                  type="text"
                  className="form-control"
                  placeholder=" Budget min"
                  name="prix_min"
                  onChange={this.onChange}
                />
              </div> */}
              <div
                className="col-lg-1 col-md-3"
                name="prix_max"
                id="recherchePlace"
                style={
                  localStorage.getItem("lg") == "ar"
                    ? { display: "table-cell", direction: "ltr" }
                    : { display: "table-cell" }
                }
                >
                <RangeSlider
                  tooltip="auto"
                  name="prix_max"
                  id="recherchePlace"
                  value={valueprice}
                  min={prix_min}
                  max={prix_max}
                  onChange={(e) =>
                    this.setState({
                      conditions: Object.assign(this.state.conditions, {
                        prix_max: e.target.value,
                      }),
                      valueprice: e.target.value,
                    })
                  }
                  /*  onAfterChange={e => this.setState({
                conditions: Object.assign(this.state.conditions, { [e.target.name]: e.target.value }),
                valueprice: e.target.value
              })} */
                />
                <div style={{ color: "white" }}>
                  {" "}
                  <FormattedMessage
                    id="tout_les_annonces_prix_max"
                    values={{ Mprix: valueprice }}
                  />
                </div>

                <RangeSlider
                  tooltip="auto"
                  name="poids_max"
                  value={valuepoids}
                  min={poids_min}
                  max={poids_max}
                  onChange={(e) =>
                    this.setState({
                      conditions: Object.assign(this.state.conditions, {
                        poids_max: e.target.value,
                      }),
                      valuepoids: e.target.value,
                    })
                  }
                />
                <div style={{ color: "white" }}>
                  {" "}
                  <FormattedMessage
                    id="tout_les_annonces_poids__max"
                    values={{ Mpoids: valuepoids }}
                  />
                  {/* <FormattedMessage id="eleveurs_poids_max"/> : {valuepoids} <FormattedMessage id="eleveurs_KG"/> */}
                </div>
                {/*   <input
                  id="recherchePlace"
                  type="text"
                  className="form-control"
                  placeholder=" Budget max"
                  name="prix_max"
                  onChange={this.onChange}
                /> */}
              </div>

              {/*             <div className="col-lg-2 col-md-3">
                <input
                  id="recherchePlace"
                  type="text"
                  className="form-control"
                  placeholder=" Poids min"
                  name="poids_min"
                  onChange={this.onChange}
                />
              </div>
              <div className="col-lg-2 col-md-3">
                <input
                  id="recherchePlace"
                  type="text"
                  className="form-control"
                  placeholder=" Poids max"
                  name="poids_max"
                  onChange={this.onChange}
                />
              </div> */}

              <div
                className="col-lg-1 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              >
                <div className="RechButton">
                  <button
                    id="roundB"
                    className="newBtn site-btn"
                    onClick={this.handelChercher}
                  >
                    <i className="fa fa-search "></i> {" "}
                    <FormattedMessage id="eleveurs_rechercher"/>{" "}
                  </button>
                </div>
                <div className="ReinButton">
                  <button
                    id="roundB"
                    className="newBtn site-btn"
                    onClick={this.handelReinitialiser}
                  >
                    <i className="fa fa-refresh"></i> {" "}
                    <FormattedMessage id="eleveurs_reinitialiser"/>{" "}
                  </button>
                </div>
              </div>
              <div
                className="col-lg-1 col-md-3"
                style={{ display: "table-cell", verticalAlign: "middle" }}
              ></div>
            </div>
          </div>
        </section>
        <Modal
          show={this.state.showSearchModal}
          onHide={this.showSearch}
          backdrop="static"
          keyboard={false}
          id="modalRecherche"
        >
          <Modal.Header closeButton>
            <h4 className="text-left mt-4"><FormattedMessage id="eleveurs_rechercher"/></h4>
          </Modal.Header>
          <Modal.Body>
            <div
              className="sidebar__item"
              style={{ backgroundColor: "#F3F6FA" }}
            >
              <div className="">
                <div className="col-lg-12">
                  <br></br>
                  <br></br>
                  <div className="sidebar__item">
                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_espece"/>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_espece">
                          {(espece) => (
                            <Select
                            value={selectedOptionEspece}
                            onChange={this.handleChangeEspece}
                            options={optionsEspece}
                            placeholder={espece}
                            required
                            // className="Select"
                          />
                          )}
                        </FormattedMessage>
                        <br></br>
                      </div>
                    </div>

                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_race"/>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_race">
                          {(race)=>(
                            <Select
                            isDisabled={this.state.Disabled}
                            value={selectedOptionRace}
                            onChange={this.handleChangeRace}
                            options={this.state.race}
                            placeholder={race}
                            required
                            // className="Select"
                            />
                          )}

                        </FormattedMessage>
                        <br></br>
                      </div>
                    </div>
                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_statut"/>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_statut">
                          {(statut)=>(
                            <Select
                            isDisabled={this.state.Disabled}
                            value={this.selectedOptionStatut}
                            onChange={this.handleChangeStatut}
                            options={this.state.statut}
                            placeholder={statut}
                            required
                            // className="Select"
                          />
                          )}
                        
                        </FormattedMessage>
                        <br></br>
                      </div>
                    </div>
                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_reference"/>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_ref_de_annonce">
                          {(ref) => (
                            <input
                            type="text"
                            className="form-control"
                            placeholder={ref}
                            name="reference"
                            onChange={this.onChange}
                          />
                          )}
                        
                        </FormattedMessage>
                      </div>
                    </div>
                    <br />
                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_prix"/>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" Budget min"
                          name="prix_min"
                          onChange={this.onChange}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_prix_max">
                        <input
                          type="text"
                          className="form-control"
                          placeholder=" Budget max"
                          name="prix_max"
                          onChange={this.onChange}
                        />
                        </FormattedMessage>
                      </div>
                    </div>
                    <br></br>

                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_poids"/>
                    </h6>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_poids_min">
                          {(poidsMin)=>(
                            <input
                            type="text"
                            className="form-control"
                            placeholder={poidsMin}
                            name="poids_min"
                            onChange={this.onChange}
                          />
                          )}
                        
                        </FormattedMessage>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <FormattedMessage id="eleveurs_poids_max">
                          {(poidsMax) => (
                            <input
                            type="text"
                            className="form-control"
                            placeholder={poidsMax}
                            name="poids_max"
                            onChange={this.onChange}
                          />
                          )}
                        </FormattedMessage>
                      </div>
                    </div>
                    <br></br>

                    <h6 id="gras" className="latest-product__item">
                      <FormattedMessage id="eleveurs_ville"/>
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
                          onClick={this.handelChercher}
                        >
                          <i className="fa fa-search "></i> <FormattedMessage id="eleveurs_rechercher"/>{" "}
                        </button>
                        <br></br>
                        <br></br>
                        <button
                          id="roundB"
                          className="newBtn site-btn"
                          onClick={this.handelReinitialiser}
                        >
                          <i className="fa fa-refresh"></i> <FormattedMessage id="eleveurs_reinitialiser"/>{" "}
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
        <section className=""
          style={localStorage.getItem("lg") == "ar" ? { direction: "rtl" } : {}}                            >
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6" id="parElvrHidden">
                <br></br>
                <a className="lienapropos" href="./Apropos">
                  <div
                    style={{ cursor: "pointer" }}
                    className="categorie_items"
                  >
                    <span></span>

                    <img
                      style={{ height: "40px" }}
                      src={require("./Images/logo-text.png")}
                      alt=""
                    />
                    <br></br>
                    <p>
                      <FormattedMessage id="eleveurs_my_anoc_message"/>
                    </p>
                  </div>
                </a>
                <hr></hr>
                <h4
                  style={{
                    fontWeight: "900",
                    marginTop: "25px",
                    textAlign: "center",
                  }}
                >
                  <FormattedMessage id="eleveurs_msg_popup"/>
                </h4>
                <a href="https://qrco.de/bcHPx6">
                  <div className="infoCards">
                    <center>
                      {" "}
                      <img
                        style={{ width: "100%" }}
                        src="http://www.anoc.ma/wp-content/uploads/2021/06/6-01.jpg"
                        alt=""
                      />
                    </center>
                  </div>
                </a>
                <br />
                <center>
                  <img
                    style={{ width: "70%" }}
                    src="./Images/my_App.png"
                    alt=""
                  />
                </center>
              </div>

              <div className="col-lg-9 col-md-12">
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
                  <div className="filter__item">
                    <div className="row">
                      <div className="col-6"> </div>
                      <div className="col-5"> </div>
                      <div
                        onClick={this.showSearch}
                        className="ModalSearch col-4"
                      >
                        <i
                          className="fa fa-search fa-lg"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>

                    <div 
                    className="row"
                    >
                      <div className="col-lg-4 col-md-5"></div>
                      <div className="col-lg-12 col-md-12">
                        <br />
                        <div className="row mb-5">
                          <div className="col-sm">
                            {" "}
                            <img
                              src={this.state.Eleveur.photo_profil}
                              className=" product__item__pic  set-bg"
                            />
                            {this.state.Eleveur.anoc ? (
                              <h1
                                style={{
                                  borderRadius: "0% 0% 0% 40%",
                                  fontSize: "14px",
                                }}
                                className=" badge badge-success  pt-1 w-100  "
                              >
                                <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                <span>
                                  <FormattedMessage id="panier_Labelise"/>
                                </span>{" "}
                              </h1>
                            ) : (
                            
                              <span className="badge pt-3 w-100 mt-1   ">
                                {"  "}
                              </span>
                            )}
                          </div>
                          <div 
                          className="product__details__text"
                          style={localStorage.getItem("lg") == "ar" ? { direction: "rtl" } : {}}
                          >
                            <div id="centrer" className="container col-md-12">
                              <br></br>
                              <h3 className="mt-1">
                                <Box
                                  component="fieldset"
                                  mb={3}
                                  borderColor="transparent"
                                  style={localStorage.getItem('lg')==="ar"?{marginLeft:"108px"}:{}}
                                >
                                  <FormattedMessage id="eleveurs_eleveur"/> :{" "}
                                  {localStorage.getItem('lg')=='ar'?
                                        typeof this.state.Eleveur.nom_ar!="undefined"&& typeof this.state.Eleveur.prenom_ar!="undefined"?
                                        " " +
                                        this.state.Eleveur.nom_ar +
                                        " " +
                                        this.state.Eleveur.prenom_ar+" ":
                                        " " +
                                        this.state.Eleveur.nom.toUpperCase() +
                                        " " +
                                        this.state.Eleveur.prenom+" ":
                                        " " +
                                        this.state.Eleveur.nom.toUpperCase() +
                                        " " +
                                        this.state.Eleveur.prenom+" "}
                                  {/* {this.state.Eleveur.nom +
                                    " " +
                                    this.state.Eleveur.prenom}{" "} */}

                                  <br></br>
        
                                  <div id="rating-eleveur">
                                    <Rating
                                      name="read-only"
                                      value={this.state.Eleveur.rating}
                                      readOnly
                                    />
                                  </div>
                                </Box>
                              </h3>{" "}
                              <ul id="data-eleveur" className="pt-4">
                                <li>
                                  <h6 className="my-2">
                                    {" "}
                                    <span className="icon">
                                      <i 
                                      style={localStorage.getItem('lg')=='ar'?{marginLeft:"333px"}:{}}
                                      className="fa fa-map"></i>
                                    </span>
                                    <span className="key">
                                      <b
                                      style={localStorage.getItem('lg')=='ar'?{
                                        textAlign:"right",
                                        marginLeft:"90px"}:{}}>
                                        <FormattedMessage id ="eleveurs_region"></FormattedMessage></b>
                                    </span>
                                    <span className="colon">
                                      <b> :</b>
                                    </span>
                                    <span 
                                    
                                    style={localStorage.getItem('lg')=='ar'?{
                                      marginLeft:"-195px"}:{}}
                                      className="value">
                                      {/* {" " + this.state.Eleveur.region}{" "} */}
                                      {localStorage.getItem("lg") === "ar"
                                        ? this.state.Eleveur.region_ar
                                          ? this.state.Eleveur.region_ar
                                          : optionsRegions.find(
                                              (element) =>
                                                element.value === this.state.Eleveur.region
                                            ) === undefined
                                          ? this.state.Eleveur.region
                                          : optionsRegions.find(
                                              (element) =>
                                                element.value === this.state.Eleveur.region
                                            ).label
                                        : this.state.Eleveur.region}

                                    </span>
                                  </h6>
                                </li>
                                <li>
                                  <h6 className="mb-2">
                                    <span className="icon">
                                      <i 
                                      style={localStorage.getItem('lg')=='ar'?{marginLeft:"333px"}:{}}
                                      className="fa fa-home"></i>
                                    </span>
                                    <span className="key">
                                      <b
                                      style={localStorage.getItem('lg')=='ar'?{
                                        textAlign:"right",
                                        marginLeft:"90px"}:{}}
                                      >
                                        <FormattedMessage id="eleveurs_ville"></FormattedMessage></b>
                                    </span>
                                    <span className="colon">
                                      <b> :</b>
                                    </span>
                                    <span 
                                    style={localStorage.getItem('lg')=='ar'?{
                                      marginLeft:"-195px"}:{}}
                                    className="value">
                                      {/* {" " + this.state.Eleveur.ville} */}
                                      {localStorage.getItem("lg") === "ar"
                                        ? this.state.Eleveur.ville_ar
                                          ? this.state.Eleveur.ville_ar
                                          : optionsVille.find(
                                              (element) =>
                                                element.value === this.state.Eleveur.ville
                                            ) === undefined
                                          ? this.state.Eleveur.ville
                                          : optionsVille.find(
                                              (element) =>
                                                element.value === this.state.Eleveur.ville
                                            ).label
                                        : this.state.Eleveur.ville}

                                    </span>
                                  </h6>
                                </li>
                                <li>
                                  <h6 className="mb-2">
                                    <span className="icon">
                                      <i
                                        style={localStorage.getItem('lg')=='ar'?{marginLeft:"333px"}:{}}
                                        className="fa fa-phone"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                    <span className="key">
                                      <b
                                      style={localStorage.getItem('lg')=='ar'?{
                                        textAlign:"right",
                                        marginLeft:"90px"}:{}}
                                      >
                                        <FormattedMessage id="eleveurs_tel"/></b>
                                    </span>
                                    <span className="colon">
                                      <b> :</b>
                                    </span>
                                    <span 
                                    style={localStorage.getItem('lg')=='ar'?{
                                      marginLeft:"-195px"}:{}}
                                    className="value">
                                      {" " + this.state.Eleveur.tel}
                                    </span>
                                  </h6>
                                </li>
                                <li>
                                  <h6 className="">
                                    {" "}
                                    <span className="icon">
                                      <img
                                      style={localStorage.getItem('lg')=='ar'
                                      ?{width: "16px",
                                        height: "18px",
                                        marginBottom: "5px",
                                        marginLeft:"333px"}:{
                                        width: "16px",
                                        height: "18px",
                                        marginBottom: "5px",
                                        }}
                                        
                                          
                            
                                        data-imgbigurl="Images/sheep-head.png"
                                        src="Images/sheep-head.png"
                                        alt=""
                                      />
                                    </span>
                                    <span  className="key">
                                      <b
                                      style={localStorage.getItem('lg')=='ar'?{
                                        textAlign:"right",
                                        marginLeft:"90px"}:{}}>
                                        <FormattedMessage id="eleveurs_total_tetes"/></b>
                                    </span>
                                    <span className="colon">
                                      <b> :</b>
                                    </span>
                                    <span 
                                    style={localStorage.getItem('lg')=='ar'?{
                                      marginLeft:"-195px"}:{}}
                                    id="nbEspece" className="value">
                                      <b>{this.state.Annonces.length}</b>
                                    </span>
                                  </h6>
                                </li>
                              </ul>
                              {this.state.Eleveur.anoc ? (
                                <span 
                                style={localStorage.getItem('lg')=='ar'?{marginLeft:"108px"}:{}}
                                className=" text-success">
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />{" "}
                                  <FormattedMessage id="eleveurs_label"
                                  values={{anoc: "ANOC"}}/>
                                   <br></br>
                                </span>
                              ) : null}
                              <br></br>
                            </div>
                          </div>
                        </div>
                        
                        

                        <div id="filtre-div"
                        style={
                          localStorage.getItem("lg") == "ar"
                            ? { textAlign: "right" }
                            : {}
                        }>
                          <h5 id="h5-ce-q" ><FormattedMessage id="eleveurs_propose"/></h5>
                          <h5 id="dispo-vendus" className="mt-3" style={{marginRight:"0px"}}>
                            <b className="ml-3" id="nbEspece">
                              {dispo.length}{" "}
                            </b>{" "}
                            <strong><FormattedMessage id="eleveurs_especes_disponibles"/></strong>
                            <b className="ml-3" id="nbEspece">
                              {vendu.length}{" "}
                            </b>
                            <strong><FormattedMessage id="eleveurs_especes_vendus"/></strong>
                          </h5>
                          <br></br>
                          <br></br>
                          <div
                            style={{zIndex: 1}}
                            id="filterPlace"
                            className="col-lg-5 col-md-5 fa "
                          >
                            <FormattedMessage id="tout_les_annonces_trier">
                              {(trie) => (
                                 <Select
                                 id="filterPlace"
                                 value={this.state.selectedOptionSort}
                                 onChange={this.sortData}
                                 options={optionsSort}
                                 placeholder={
                                   this.state.selectedOptionSort
                                     ? this.state.selectedOptionSort
                                     : trie
                                 }
                                 //f0b0
                                 // className="Select"
                               />
                              )}
                           
                            </FormattedMessage>
                          </div>
                        </div>
                        <br></br>
                      </div>
                    </div>
                  </div>
                )}
                {/*<!-- Sheeps Grid Section Begin --> */}
                <div>
                  {loading ? null : (
                    <div>
                      <div className="row">
                        {currentAnnonces.map((Annonces) => (
                          <div
                            className="col-lg-4 col-md-6 col-sm-6"
                            key={Annonces.$oid}
                          >
                            <div id="anonce" className="product__item">
                              {Annonces.statut === "disponible" ? (
                                <div className="icon-vendus">
                                  <h1
                                    style={{
                                      borderRadius: "0% 0% 0% 40%",
                                      fontSize: "14px",
                                    }}
                                    className=" badge badge-success  pt-1 w-100  "
                                  >
                                    <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                    <span><FormattedMessage id="eleveurs_especes_dispo"/></span>{" "}
                                  </h1>{" "}
                                </div>
                              ) : (
                                <div className="icon-vendus">
                                  <h1
                                    style={{
                                      borderRadius: "0% 0% 0% 40%",
                                      fontSize: "14px",
                                    }}
                                    className=" badge badge-danger  pt-1 w-100  "
                                  >
                                    <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                    <span><FormattedMessage id="eleveurs_especes_vendu"/></span>{" "}
                                  </h1>{" "}
                                </div>
                              )}
                              <div
                                className="product__item__pic set-bg"
                                data-setbg={Annonces.images}
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
                                    <Link
                                      to={`/DetailsMouton/${Annonces._id.$oid}`}
                                    >
                                      <a href="#">
                                        <i className="fa fa-eye"></i>
                                      </a>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              {Annonces.anoc ? (
                                <h1
                                  style={{
                                    borderRadius: "0% 0% 0% 40%",
                                    fontSize: "14px",
                                  }}
                                  className=" badge badge-success  pt-1 w-100  "
                                >
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span>
                                  <FormattedMessage id="panier_Labelise" />  
                                  </span>{" "}
                                </h1>
                              ) : (
                                <h1
                                  style={{
                                    borderRadius: "0% 0% 0% 40%",
                                    fontSize: "14px",
                                  }}
                                  className=" badge  pt-4 w-100  "
                                >
                                  <span> </span>{" "}
                                </h1>
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
                                          // style={localStorage.getItem('lg')=='ar'?{marginLeft:"333px"}:{ marginRight: "0.5rem" }}
                                          style={{ marginRight: "0.5rem" }}
                                        ></i>{" "}
                                        {/* {Annonces.localisation} */}
                                        {localStorage.getItem("lg") === "ar"
                                        ? this.state.Eleveur.ville_ar
                                          ? this.state.Eleveur.ville_ar
                                          : optionsVille.find(
                                              (element) =>
                                                element.value === this.state.Eleveur.ville
                                            ) === undefined
                                          ? this.state.Eleveur.ville
                                          : optionsVille.find(
                                              (element) =>
                                                element.value === this.state.Eleveur.ville
                                            ).label
                                        : this.state.Eleveur.ville}

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
                                          {Annonces.espece == "chevre"
                                            ? <FormattedMessage id="tout_les_annonces_chevre"/>
                                            : <FormattedMessage id="tout_les_annonces_mouton"/>}
                                          <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}} >
                                            <FaShapes
                                              style={{ marginRight: "5px" }}
                                            />
                                            {localStorage.getItem("lg") == "ar"
                                              ? Annonces.race_ar
                                              ?Annonces.race_ar
                                              :Annonces.race
                                              :Annonces.race}
                                            {/* {" " + Annonces.race} */}
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
                                          {/* {Annonces.sexe} */}
                                          <span style={localStorage.getItem('lg')=="ar"?{ float: "left"}:{float:"right"}}>
                                            <GiWeight
                                              className=" mr-1 fa-lg "
                                              style={{ marginRight: "5px" }}
                                            />
                                            <FormattedMessage id="panier_mouton_poids_kg"
                                            values={{ poids:Annonces.poids }} />
                                            {/* {Annonces.poids + " Kg"} */}
                                          </span>
                                        </div>
                                        <div>
                                          <span style={localStorage.getItem('lg')=="ar"?{ float: "right"}:{float:"left"}}>
                                            <MdCake
                                              className=" mr-1 fa-lg "
                                              style={{ marginRight: "5px" }}
                                            />
                                            <FormattedMessage id="panier_mouton_age_mois"
                                            values={{ age:Annonces.age }} />

                                            {/* {Annonces.age + " mois"} */}
                                          </span>
                                        </div>
                                        <div
                                          style={localStorage.getItem('lg')=="ar"?{ float: "left",color: "#fe6927",
                                          fontSize: "18px",
                                          fontWeight: "1000",
                                          textDecoration: "bold",
                                          alignContent: "center",}:{float:"right",color: "#fe6927",
                                          fontSize: "18px",
                                          fontWeight: "1000",
                                          textDecoration: "bold",
                                          alignContent: "center",}}
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
                                          <FormattedMessage id="panier_mouton_currency"
                                            values={{ prix:Annonces.prix }} />
                                          {/* {Annonces.prix + "  Dhs"} */}
                                        </div>
                                      </div>
                                    </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="center-div">
                        <Pagination
                          activePage={this.state.currentPage}
                          itemsCountPerPage={9}
                          totalItemsCount={this.state.Annonces.length}
                          pageRangeDisplayed={7}
                          onChange={this.paginate.bind(this)}
                          itemClass="page-item"
                          linkClass="page-link"
                        />
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
