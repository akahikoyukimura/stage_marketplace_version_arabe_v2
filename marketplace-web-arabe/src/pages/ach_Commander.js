import React, { Component } from "react";
//import ReactDOM from "react-dom";
import MultiStep from "../react-multistep";
import Commander1 from "./step1";
import Commander2 from "./step2";
import Commander3 from "./step3";

import axios from "axios";
//import Select from "react-select";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'))

//import { Link } from "react-router-dom";
class Commander extends Component {
  constructor(props) {
    super(props);
    // let redirect = false;
    this.state = {
      date_min: null,
      check1: false,
      check2: false,
      check3: false,
      check4: false,
      check5: false,
      entrée_ville: false,
      adresse: "",
      date: null,
      id_cooperative: null,
      prix: null,
      avance: 0,
      reste: 0,
      prix_total: 0,
      prix_transport: 0,
      Commande: {},
      standard: "domicile",
      cooperative: this.props.location.state.cooperative,
      Espece: {},
      eleveur: {},
      Especes: [],
      eleveurs: [],
      occasion: "",
      deadline: new Date(),
      checked: false,
      vide: true,
      image: "",
      paiement: null,
      livraison: [],
      selectedOptionVille: "",
      optionsVille: [],
      selectedOptionPoint: "",
      optionsPoint: [],
      redirect: false,
      technicien: {},
    };
    this.onPaiementChanged = this.onPaiementChanged.bind(this);
    this.onChangecheck = this.onChangecheck.bind(this);
    this.handleChangeVille = this.handleChangeVille.bind(this);
    this.handleChangePoint = this.handleChangePoint.bind(this);

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChange5 = this.handleChange5.bind(this);
    this.validation = this.validation.bind(this);
    this.valide = this.valide.bind(this);
  }
  valide() {
    if (this.validation()[0]) {
      return this.validation()[0];
    } else {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "ml-2 btn btn-success",
          cancelButton: " btn btn-danger",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons.fire(
        intl.messages.commander_error_message_title,
        intl.messages.commander_error_message_body,
        "error"
      );
      return false;
    }
  }
  validation() {
    let ids = [];
    if (!Array.isArray(this.props.location.state.id)) {
      ids.push(this.props.location.state.id);
    } else {
      ids = this.props.location.state.id;
    }
    let valide = [];
    valide[0] = false;
    let transport = 0;
    if (this.state.check1) {
      if (
        (this.state.date === null && this.state.occasion === "aid") ||
        (this.state.date !== null && this.state.occasion !== "aid")
      ) {
        valide[0] = true;
        transport = 0;
      }
    }
    if (this.state.check2) {
    }
    if (this.state.check3) {
      if (
        this.state.date !== null &&
        this.state.selectedOptionVille !== "" &&
        this.state.adresse !== ""
      ) {
        valide[0] = true;
        transport = this.state.livraison.find(
          (f) => f.ville_livraison === this.state.selectedOptionVille.value
        ).prix_VIP;
      }
    }
    if (this.state.check4) {
      if (this.state.selectedOptionVille !== "" && this.state.adresse !== "") {
        valide[0] = true;
        transport = this.state.livraison.find(
          (f) => f.ville_livraison === this.state.selectedOptionVille.value
        ).prix_VIP;
      }
    }
    if (this.state.check5) {
      if (
        this.state.standard === "point_relais" &&
        this.state.selectedOptionVille !== "" &&
        this.state.selectedOptionPoint !== ""
      ) {
        valide[0] = true;
        transport =
          (this.state.livraison.find(
            (f) => f.ville_livraison === this.state.selectedOptionVille.value
          ).prix_transport_relais -
            -this.state.livraison.find(
              (f) => f.ville_livraison === this.state.selectedOptionVille.value
            ).marge_risque) *
          ids.length;
      }
      if (
        this.state.standard === "domicile" &&
        this.state.selectedOptionVille !== "" &&
        this.state.adresse !== ""
      ) {
        valide[0] = true;
        transport =
          (this.state.livraison.find(
            (f) => f.ville_livraison === this.state.selectedOptionVille.value
          ).prix_transport_domicile -
            -this.state.livraison.find(
              (f) => f.ville_livraison === this.state.selectedOptionVille.value
            ).marge_risque) *
          ids.length;
      }
    }

    valide[1] = transport;
    return valide;
  }
  handleChange1(e) {
    this.setState({
      checked: false,
      check1: !this.state.check1,
      check2: false,
      check3: false,
      check4: false,
      check5: false,
      selectedOptionPoint: "",
      selectedOptionVille: "",
    });
  }
  handleChange2(e) {
    this.setState({
      checked: false,
      check1: false,
      check2: !this.state.check2,
      check3: false,
      check4: false,
      check5: false,
      adresse: "",
      selectedOptionVille: "",
    });
  }
  handleChange3(e) {
    this.setState({
      checked: false,
      check1: false,
      check2: false,
      check3: !this.state.check3,
      check4: false,
      check5: false,
      selectedOptionPoint: "",
      selectedOptionVille: "",
    });
  }
  handleChange4(e) {
    this.setState({
      checked: false,
      check1: false,
      check2: false,
      check3: false,
      check4: !this.state.check4,
      check5: false,
      selectedOptionPoint: "",
      selectedOptionVille: "",
    });
  }
  handleChange5(e) {
    this.setState({
      checked: false,
      check1: false,
      check2: false,
      check3: false,
      check4: false,
      check5: !this.state.check5,
      selectedOptionPoint: "",
      selectedOptionVille: "",
    });
  }

  handleChangeVille = (selectedOptionVille) => {
    this.setState({ selectedOptionVille }, () =>
      this.setState({
        checked: false,
        vide: false,
        adresse: "",
      })
    );

    this.setState({
      entrée_ville: this.state.livraison.find(
        (f) => f.ville_livraison === selectedOptionVille.value
      ).entrée_ville,
      optionsPoint: [
        {
          value: this.state.livraison.find(
            (f) => f.ville_livraison === selectedOptionVille.value
          ).point_relais,
          label: this.state.livraison.find(
            (f) => f.ville_livraison === selectedOptionVille.value
          ).point_relais,
        },
      ],
    });
    if (
      this.state.livraison.find(
        (f) => f.ville_livraison === selectedOptionVille.value
      ).entrée_ville
    ) {
      this.setState(
        {
          selectedOptionPoint: {
            value: "L'entrée de la ville",
            label: "L'entrée de la ville",
          },
        },
        () => {}
      );
    } else {
      this.setState({ selectedOptionPoint: "" }, () => {});
    }
  };

  handleChangePoint = (selectedOptionPoint) => {
    this.setState({ selectedOptionPoint }, () =>
      this.setState({
        checked: false,
      })
    );
  };
  onChangecheck(e) {
    let type = "standard";
    if (this.state.checked === true) {
      this.setState({ checked: false });
    } else {
      this.setState({ checked: true });
    }
    if (this.state.check4 || this.state.check3) {
      type = "vip";
    }

    this.setState({
      Commande: {
        // localisation: e.target.value,
        point_relais: this.state.check1
          ? "Récupérer à la coopérative"
          : this.state.check5 === true && this.state.standard === "point_relais"
          ? this.state.entrée_ville === true
            ? "entrée de la ville"
            : this.state.selectedOptionPoint.value
          : "",
        ville_livraison: this.state.check1
          ? "Récupérer à la coopérative"
          : this.state.selectedOptionVille.value,
        especes: this.state.especes,

        id_cooperative: this.state.id_cooperative,
        reference: null,
        id_consommateur: localStorage.getItem("usertoken"),
        statut:
          this.state.paiement == "cash"
            ? "en attente de paiement cash"
            : "en attente de paiement avance",
        ancien_statut: "",
        deadline: this.state.deadline,
        avance: this.state.avance,
        prix_total: this.state.prix - -this.validation()[1],
        reste: this.state.prix - -this.validation()[1] - this.state.avance,

        reçu_avance: "",
        feedback_avance: "",
        msg_refus_avance: null,

        reçu_montant_restant: null,
        feedback_reçu_montant_restant: null,
        msg_refus_reste: null,

        reçu_montant_complement: null,
        feedback_reçu_montant_complement: null,
        msg_refus_complement: null,

        date_creation: new Date(),
        date_de_livraison: this.state.date,
        type_livraison: type,

        mode_paiement_choisi: this.state.paiement,
        date_annulation: null,
        date_suppression_max: null,
        isDelivered: false,
        rating_livraison: null,
        justification_rating_livraison: null,
        rating_produit: null,
        justification_rating_produit: null,

        avance_transmis_le: null,
        reste_transmis_le: null,
        complement_transmis_le: null,
        motif_rejet: null,
        justification_rejet: null,

        rating: null,
        isDeliveredTo_Home:
          this.state.check3 ||
          this.state.check4 ||
          (this.state.check5 && this.state.standard === "domicile"),
        adresse_domicile: this.state.adresse,
        isDeliveredTo_PointRelais:
          this.state.check2 ||
          (this.state.check5 && this.state.standard === "point_relais"),
        isTakenFrom_Cooperative: this.state.check1,
        id_animateur: this.props.location.state.cooperative.id_animateur,
      },
      vide: false,
    });
  }
  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  onPaiementChanged(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.setState({ loading: false, checked: false });
    });
  }

  componentDidMount() {
    const idm = this.props.location.state.id;
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

    // console.log(formatted_date);

    const expiredTimeToken = localStorage.getItem("expiredTimeToken");
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    //  console.log(expiredTimeToken);

    if (!token || expiredTimeToken < formatted_date) {
      this.props.history.push("/login");
    } else {
      let p = [];
      let ids = [];
      if (!Array.isArray(idm)) {
        ids.push(idm);
      } else {
        ids = idm;
      }

      let d = "";
      if (this.state.cooperative.occasion !== "aid") {
        d = new Date(
          new Date().getTime() -
            -3600 *
              (this.state.cooperative.parametres.delais_paiement.delai_reste -
                -this.state.cooperative.parametres.delais_paiement
                  .delai_avance -
                -this.state.cooperative.parametres.delais_paiement.bonus) *
              1000 -
            new Date().getTimezoneOffset() * 60 * 1000
        ).toISOString();
        this.setState({ date_min: d.substr(0, 10) }, () => {});
      }
      this.setState(
        {
          livraison: this.state.cooperative.livraison,
          occasion: this.state.cooperative.occasion,

          deadline: new Date(
            new Date().getTime() -
              -3600 *
                this.state.cooperative.parametres.delais_paiement.delai_avance *
                1000 -
              new Date().getTimezoneOffset() * 60 * 1000
          ).toLocaleString(),
        },
        () => {
          this.state.cooperative.livraison.map((l) =>
            this.state.optionsVille.splice(0, 0, {
              value: l.ville_livraison,
              label: localStorage.getItem('lg')=='ar'?l.ville_livraison_ar:l.ville_livraison,
            })
          );
          console.log(this.state.optionsVille)

          ids.map((i) =>
            axios
              .get("http://127.0.0.1:8000/api/Espece/" + i, {
                headers: {
                  // "x-access-token": token, // the token is a variable which holds the token
                  Authorization: myToken,
                },
              })
              .then((res) => {
                this.setState(
                  {
                    Espece: res.data.objet,
                    eleveur: res.data.Eleveur,
                    id_cooperative: res.data.objet.id_cooperative,
                    prix: this.state.prix - -res.data.objet.prix,
                    avance: this.state.avance - -res.data.objet.avance,

                    // image: res.data.objet.image_profile,
                  },
                  () => {
                    p.splice(0, 0, {
                      id_espece: res.data.objet._id,
                      id_eleveur: res.data.Eleveur[0]._id,
                      motif_annulation: null,
                      produits_changement: [],
                      choix_client: "",
                    });
                    this.setState({ especes: p }, () => {});
                  }
                );
                /* get id cooperative and use it to get technicien data*/
                axios
                  .get(
                    "http://127.0.0.1:8000/api/cooperative/" +
                      this.state.id_cooperative,
                    {
                      headers: {
                        // "x-access-token": token, // the token is a variable which holds the token
                        Authorization: myToken,
                      },
                    }
                  )
                  .then((res) => {
                    axios
                      .get(
                        "http://127.0.0.1:8000/api/technicien/" +
                          res.data.techniciens[0].id_technicien,
                        {
                          headers: {
                            // "x-access-token": token, // the token is a variable which holds the token
                            Authorization: myToken,
                          },
                        }
                      )
                      .then((res) => {
                        this.setState({
                          technicien: res.data,
                        });
                      });
                  });
              })
          );
        }
      );
    }
  }

  render() {
    console.log(this.state);
    const steps = [
      {
        name: "Etape",
        component: (
          <Commander1
            location={this.props.location}
            data={this.state}
            handleChange1={this.handleChange1}
            handleChange2={this.handleChange2}
            handleChange3={this.handleChange3}
            handleChange4={this.handleChange4}
            handleChange5={this.handleChange5}
            onPaiementChanged={this.onPaiementChanged}
            handleChangeVille={this.handleChangeVille}
            handleChangePoint={this.handleChangePoint}
          />
        ),
      },
      {
        name: "Etape",
        component: (
          <Commander2
            location={this.props.location}
            data={this.state}
            validation={this.validation}
          />
        ),
      },
      {
        name: "Etape",
        component: (
          <Commander3
            location={this.props.location}
            data={this.state}
            onChangecheck={this.onChangecheck}
            onPaiementChanged={this.onPaiementChanged}
            validation={this.validation}
            techBank={this.state.technicien.agence_bancaire}
            occasion={this.state.cooperative.occasion}
            payementRapide={this.state.cooperative.paiement_rapide}
          />
        ),
      },
    ];
    const prevStyle = {
      background: "#4cb050",
      "border-width": "0px",
      display: "inline-block",
      "font-size": "14px",
      size: "25px 54px",
      padding: "10px 28px 10px",
      color: "#ffffff",
      "text-transform": "uppercase",
      "font-weight": "700",
      "letter-spacing": "2px",
      "border-radius": "5px",
    };

    const nextStyle = {
      position: "absolute",
      left:localStorage.getItem('lg')=="ar"?"7.3%":"",
      right:localStorage.getItem('lg')!="ar"?"7.3%":"",
      background: "#4cb050",
      "border-width": "0px",
      display: "inline-block",
      "font-size": "14px",
      size: "250px 54px",
      padding: "10px 28px 10px",
      color: "#ffffff",
      "text-transform": "uppercase",
      "font-weight": "700",
      "letter-spacing": "2px",
      "border-radius": "5px",
    };

    return (
      <div>
        <div
        style={localStorage.getItem("lg")=="ar"?{"direction":"rtl","textAlign":"right",display: "block", marginLeft: "auto", marginRight: "auto"}:{display: "block", marginLeft: "auto", marginRight: "auto"}}
          className="container"
        >
          <br></br>
          <h3><FormattedMessage id="commander_title"/> </h3>

          <MultiStep
            showNavigation={true}
            steps={steps}
            prevStyle={prevStyle}
            nextStyle={nextStyle}
            data={this.state}
            valide={this.valide}
          />
        </div>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  }
}

export default Commander;
