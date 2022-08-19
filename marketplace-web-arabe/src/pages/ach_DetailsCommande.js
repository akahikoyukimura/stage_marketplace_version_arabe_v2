import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaClipboardCheck } from "react-icons/fa";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { BiTrash } from "react-icons/bi";
import { Prompt } from "react-router";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { Modal } from "react-bootstrap";
import { Redirect } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";
import { FormattedMessage } from "react-intl";

const intl=JSON.parse(localStorage.getItem('intl'))
class DetailsCommande extends Component {
  constructor(props) {
    super(props);
    // let redirect = false;
    this.state = {
      show: [
        "collapse show",
        "collapse show",
        "collapse",
        "collapse",
        "collapse",
        "collapse",
      ],
      cloture: false,
      connectedUserEmail: "",
      espece_changement: "",
      etat: "",
      nom_prenom: "",
      nom_prenom_valide: "",
      commandes: this.props.location.state.id,
      rib: "",
      rib_valide: "",
      cooperative: null,
      cooperative_rib: "",
      tech: "",
      payer: "",
      Especes: [],
      showAvance: false,
      showSolution: false,
      showRemb: false,
      showChoix: false,
      prixRemb: 0,
      prix_transport: 0,
      prix_total: JSON.parse(window.sessionStorage.getItem("prix_total")),
      prix_avance: JSON.parse(window.sessionStorage.getItem("avance")),
      prix_reste: JSON.parse(window.sessionStorage.getItem("reste")),
      prix_complement: JSON.parse(window.sessionStorage.getItem("complement")),

      especeAv: {},
      especeChoisi: {},
      redirect: false,
      image: "",
      errors: {},
      date: Date,
      mode_paiement_choisi: this.props.location.state.id.mode_paiement_choisi,
      dataUrl: "",
      ids: window.sessionStorage.getItem("ids")
        ? JSON.parse(window.sessionStorage.getItem("ids"))
        : [],
      reponses: window.sessionStorage.getItem("reponses")
        ? JSON.parse(window.sessionStorage.getItem("reponses"))
        : [],
    };

    this.onChange = this.onChange.bind(this);
    this.Modal = this.Modal.bind(this);
    this.ModalS = this.ModalS.bind(this);
    this.Hide = this.Hide.bind(this);
    this.terminer = this.terminer.bind(this);
    this.RefuseTSoutions = this.RefuseTSoutions.bind(this);
    this.AccepteSoution = this.AccepteSoution.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.handelDeleteEspece = this.handelDeleteEspece.bind(this);
    this.handelDelete = this.handelDelete.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handlePut = this.handlePut.bind(this);
    this.handlPost = this.handlPost.bind(this);
    this.showCard = this.showCard.bind(this);
  }
  verification(id) {
    let found = false;
    if (this.state.ids.filter((e) => e.id == id).length > 0) {
      found = true;
    }
    return found;
  }
  showCard(num) {
    this.state.show[num] =
      this.state.show[num] === "collapse show" ? "collapse" : "collapse show";

    this.setState({
      show: this.state.show,
    });
  }
  Hide() {
    this.setState(
      { showChoix: false, showRemb: false, showSolution: false },
      () => {}
    );
  }
  terminer() {
    if (this.state.cloture == false) {
      if (
        (window.sessionStorage.getItem("ids") &&
          JSON.parse(window.sessionStorage.getItem("ids")).length === 0) ||
        (window.sessionStorage.getItem("ids") &&
          JSON.parse(window.sessionStorage.getItem("ids")).length ===
            this.state.commandes.espece.filter(
              (e) => e.statut === "produit avarié"
            ).length) ||
        this.state.commandes.espece.filter((e) => e.statut === "produit avarié")
          .length === 0
      ) {
        window.onbeforeunload = undefined;
      } else {
        window.onbeforeunload = function (e) {
          e.preventDefault();
          e.returnValue = "";
          return "stop";
        };
      }

      if (
        window.sessionStorage.getItem("ids") &&
        JSON.parse(window.sessionStorage.getItem("ids")).length !== 0 &&
        JSON.parse(window.sessionStorage.getItem("ids")).length ===
          this.state.commandes.espece.filter(
            (e) => e.statut === "produit avarié"
          ).length &&
        this.state.commandes.espece.filter((e) => e.statut === "produit avarié")
          .length !== 0
      ) {
        const myToken = `Bearer ` + localStorage.getItem("myToken");

        JSON.parse(window.sessionStorage.getItem("ids")).map((i, nbr) => {
          if (i.etat == "accepter") {
            axios
              .put(
                "http://127.0.0.1:8000/api/commande/" +
                  this.state.commandes._id +
                  "/" +
                  i.id +
                  "/" +
                  i.id_changement,
                {
                  nom: this.state.nom_prenom,
                  rib: this.state.rib,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: myToken,
                  },
                }
              )
              .then((res) => {
                this.state.reponses.push(res.data);
                window.sessionStorage.setItem(
                  "reponses",
                  JSON.stringify(this.state.reponses)
                );
                this.setState(
                  { showChoix: false, showRemb: false, showSolution: false },
                  () => {}
                );
                if (
                  nbr ===
                  JSON.parse(window.sessionStorage.getItem("ids")).length - 1
                ) {
                  axios
                    .put(
                      "http://127.0.0.1:8000/api/commandeStatut/" +
                        this.state.commandes._id,
                      this.state.reponses,
                      {
                        all: this.state.reponses,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: myToken,
                        },
                      }
                    )
                    .then((res) => {
                      this.setState(
                        {
                          cloture: true,
                          ids: [],
                          showChoix: false,
                          showSolution: false,
                          showRemb: false,
                        },
                        () => {
                          window.sessionStorage.setItem("ids", []);

                          Swal.fire({
                            title: intl.messages.details_cmd_change_success_popup,
                            icon: "success",
                            width: 400,
                            heightAuto: false,
                            timer: 1500,
                            showConfirmButton: false,
                          });
                          this.props.history.push("./commandesParStatut");
                        }
                      );
                    });
                }
              });
          } else {
            axios
              .put(
                "http://127.0.0.1:8000/api/commande/" +
                  this.state.commandes._id +
                  "/" +
                  i.id,
                {
                  nom: this.state.nom_prenom,
                  rib: this.state.rib,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: myToken,
                  },
                }
              )
              .then((res) => {
                this.state.reponses.push(res.data);
                window.sessionStorage.setItem(
                  "reponses",
                  JSON.stringify(this.state.reponses)
                );

                this.setState(
                  { showChoix: true, showRemb: false, showSolution: false },
                  () => {}
                );
                if (
                  nbr ===
                  JSON.parse(window.sessionStorage.getItem("ids")).length - 1
                ) {
                  axios
                    .put(
                      "http://127.0.0.1:8000/api/commandeStatut/" +
                        this.state.commandes._id,
                      this.state.reponses,
                      {},
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: myToken,
                        },
                      }
                    )
                    .then((res) => {
                      this.setState({ cloture: true, ids: [] }, () => {
                        window.sessionStorage.setItem("ids", []);
                        Swal.fire({
                          title: intl.messages.details_cmd_change_success,
                          icon: "success",
                          width: 400,
                          heightAuto: false,
                          timer: 1500,
                          showConfirmButton: false,
                        });
                      });
                      this.props.history.push("./commandesParStatut");
                    });
                }
              });
          }
        });
      }
    }
  }
  componentDidUpdate = () => {
    if (window.sessionStorage.getItem("ids")) {
      if (
        this.state.ids.length > 0 &&
        JSON.parse(window.sessionStorage.getItem("ids")).length == 0
      ) {
        this.setState({ ids: [] }, () => {
          Swal.fire({
            title: intl.messages.cmd_changement_annuler,
            icon: "error",
            width: 400,
            heightAuto: false,
            timer: 1500,
            showConfirmButton: false,
          });
        });
      }
    } else {
      {
        if (this.state.ids.length > 0) {
          this.setState({ ids: [] }, () => {
            Swal.fire({
              title: intl.messages.cmd_changement_annuler,
              icon: "error",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
          });
        }
      }
    }
  };
  handleValidation() {
    let errors = {};
    let valide = true;

    if (this.state.nom_prenom.length === 0 || this.state.nom_prenom === " ") {
      errors["nom_prenom"] = intl.messages.details_cmd_champs_obligatoire;
      valide = false;
    }
    if (this.state.rib.length === 0) {
      errors["rib"] = intl.messages.details_cmd_champs_obligatoire;
      valide = false;
    }
    if (this.state.rib.length !== 0 && this.state.rib.length !== 24) {
      errors["rib"] = intl.messages.details_cmd_champs_rib;
      valide = false;
    }
    this.setState({ errors: errors });
    return valide;
  }
  handlPost(e) {
    e.preventDefault();
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (this.handleValidation()) {
      //rembourssement

      if (this.state.etat === "refuser") {
        this.state.ids.push({
          id: this.state.especeAv._id,
          etat: this.state.etat,
        });
        window.sessionStorage.setItem("ids", JSON.stringify(this.state.ids));

        this.setState(
          {
            nom_prenom_valide:
              this.state.nom_prenom.length > 0 &&
              this.state.nom_prenom.length !== " "
                ? this.state.nom_prenom
                : this.state.nom_prenom_valide,
            rib_valide:
              this.state.rib.length === 24
                ? this.state.rib
                : this.state.rib_valide,
            showRemb: false,
            showSolution: false,
          },
          () => {
            Swal.fire({
              title: intl.messages.details_cmd_change_success,
              icon: "success",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
            this.terminer();
          }
        );
      }
      //rembourssement pour changement (old.prix>new.prix)
      if (this.state.etat === "accepter") {
        this.state.ids.push({
          id: this.state.especeAv._id,
          id_changement: this.state.espece_changement._id,
          etat: this.state.etat,
        });
        // this.state.reponses.push(res.data)
        window.sessionStorage.setItem("ids", JSON.stringify(this.state.ids));
        //  window.sessionStorage.setItem("reponses", JSON.stringify(this.state.reponses))

        this.setState(
          {
            nom_prenom_valide:
              this.state.nom_prenom.length > 0 &&
              this.state.nom_prenom.length !== " "
                ? this.state.nom_prenom
                : this.state.nom_prenom_valide,
            rib_valide:
              this.state.rib.length === 24
                ? this.state.rib
                : this.state.rib_valide,
            showRemb: false,
            showSolution: false,
          },
          () => {
            Swal.fire({
              title: intl.messages.details_cmd_change_success,
              icon: "success",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
            this.terminer();
          }
        );
      }
    }
  }
  getChoix(espece) {
    console.log(this.state.commandes);
    if (this.state.showChoix) {
      let especeChoisi = this.state.commandes.espece_avariee.filter(
        (av) =>
          av._id ==
          espece.produits_changement.filter((p) => p.feedback === "validé")[0]
            .id_espece
      )[0];
      return especeChoisi;
    }
  }
  getEspece(espece) {
    let esp = this.state.commandes.especes.filter(
      (e) => e.id_espece === espece._id
    )[0];
    let motif = "";
    switch (esp.motif_annulation) {
      case "Apparition d'un abcès":
        motif = intl.messages.details_cmd_motif_abces;
        break;
      case "Jetage du nez":
        motif = intl.messages.details_cmd_motif_nasales;
        break;
      case "Conjonctivite":
        motif = intl.messages.details_cmd_motif_oeil;
        break;
      case "Ictère":
        motif =
          intl.messages.details_cmd_motif_peau;
        break;
      case "Fracture":
        motif = intl.messages.details_cmd_fracture;
        break;
      case "Boitréé":
        motif = intl.messages.details_cmd_boitree;
        break;
      default:
        motif = esp.motif_annulation;
    }

    esp.motif_annulation = motif;
    return esp;
  }
  handelDeleteEspece(espece) {
    const myToken = `Bearer ` + localStorage.getItem("myToken");
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
        text: intl.messages.details_cmd_annuler_espece,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: intl.messages.panier_delete_oui,
        cancelButtonText: intl.messages.panier_delete_non,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (this.state.commandes.especes.length === 1) {
            axios
              .delete(
                "http://127.0.0.1:8000/api/commande/" +
                  this.state.commandes._id,
                {
                  headers: {
                    Authorization: myToken,
                  },
                }
              )
              .then((res) => {
                axios
                  .put(
                    "http://127.0.0.1:8000/api/Espece/" + espece._id,
                    {
                      statut: "disponible",
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: myToken,
                      },
                    }
                  )
                  .then((res) => {
                    this.props.history.push("./commandesParStatut");
                    swalWithBootstrapButtons.fire(
                      intl.messages.alerte_cmd_annulation_success_title,
                      intl.messages.details_cmd_annuler_espece_success,
                      "success"
                    );
                    window.location.reload();
                  });
              });
          } else if (this.state.commandes.especes.length > 1) {
            axios
              .put(
                "http://127.0.0.1:8000/api/commande/" +
                  this.state.commandes._id +
                  "/espece/" +
                  espece._id,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: myToken,
                  },
                }
              )
              .then((res) => {
                let all = this.state.commandes;
                all.espece = this.state.commandes.espece.filter(
                  (f) => f._id !== espece._id
                );
                all.especes = this.state.commandes.especes.filter(
                  (f) => f.id_espece !== espece._id
                );

                if (all.reçu_avance === null) {
                  all.avance = all.avance - espece.avance;
                  all.prix_total = all.prix_total - espece.prix;
                  all.reste = all.prix_total - all.avance;
                }

                if (all.reçu_avance !== null) {
                  all.prix_total =
                    all.prix_total - espece.prix - -espece.avance;
                  all.reste = all.prix_total - all.avance;
                }

                this.setState(
                  {
                    commandes: all,
                  },
                  () => {
                    swalWithBootstrapButtons.fire(
                      intl.messages.alerte_cmd_annulation_success_title,
                      intl.messages.details_cmd_annuler_espece_success,
                      "success"
                    );
                  }
                );
              });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            intl.messages.alerte_cmd_annulation_failed_title,
            intl.messages.details_cmd_annuler_espece_failed,
            "error"
          );
        }
      });
  }
  handelDelete = (e) => {
    e.preventDefault();
    // const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    let espece = this.state.commandes.espece;
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
          //debut
          axios
            .delete(
              "http://127.0.0.1:8000/api/commande/" + this.state.commandes._id,
              {
                headers: {
                  Authorization: myToken,
                },
              }
            )
            .then((res) => {
              espece.map((esp) => {
                axios
                  .put(
                    "http://127.0.0.1:8000/api/Espece/" + esp._id,
                    {
                      statut: "disponible",
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: myToken,
                      },
                    }
                  )
                  .then((res) => {});
              });

              swalWithBootstrapButtons.fire(
                intl.messages.alerte_cmd_annulation_success_title,
                intl.messages.alerte_cmd_annulation_success_body,
                "success"
              );
              this.props.history.push("./commandesParStatut");
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            intl.messages.alerte_cmd_annulation_failed_title,
            intl.messages.alerte_cmd_annulation_failed_body,
            "error"
          );
        }
      });
  };

  handlePut = (e) => {
    e.preventDefault();
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    if (this.state.dataUrl.length > 0) {
      if (this.state.payer === "avance") {
        //paiement
        axios
          .put(
            "http://127.0.0.1:8000/api/commande/" + this.state.commandes._id,
            {
              statut: "en attente de validation avance",
              reçu_avance: this.state.dataUrl,
              avance_transmis_le: new Date(),
              mode_paiement_choisi: this.state.mode_paiement_choisi,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: myToken,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              text:
                intl.messages.details_cmd_email_validation +
                this.state.commandes.consommateur.email,
              icon: "success",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok!",
            });
            this.props.history.push("/commandesParStatut");
          });
      } else if (this.state.payer === "reste") {
        axios
          .put(
            "http://127.0.0.1:8000/api/commande/" + this.state.commandes._id,
            {
              statut: "en attente de validation reste",
              reçu_montant_restant: this.state.dataUrl,
              reste_transmis_le: new Date(),
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: myToken,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              text:
              intl.messages.details_cmd_email_validation +
                this.state.commandes.consommateur.email,
              icon: "success",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok!",
            });
            this.props.history.push("/commandesParStatut");
          });
      } else if (this.state.payer === "complement") {
        axios
          .put(
            "http://127.0.0.1:8000/api/commande/" + this.state.commandes._id,
            {
              statut: "en attente de validation complément",
              reçu_montant_complement: this.state.dataUrl,
              complement_transmis_le: new Date(),
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: myToken,
              },
            }
          )
          .then((res) => {
            Swal.fire({
              text:
              intl.messages.details_cmd_email_validation +
                this.state.commandes.consommateur.email,
              icon: "success",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok!",
            });
            this.props.history.push("/commandesParStatut");
          });
      }
      const to = this.state.connectedUserEmail;
      const content = "Votre reçu a bien ete receptionne";
      const subject = "Reçu de paiement ( " + this.state.payer + " )";
      axios.post(
        "http://127.0.0.1:8000/api/sendmail/" +
          to +
          "/" +
          content +
          "/" +
          subject,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            // "Access-Control-Allow-Origin": "*",
          },
        }
      );
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
        intl.messages.details_cmd_image_recu,
        "error"
      );
    }
  };

  handleChangeImage(evt) {
    var dataURL = "";
    var reader = new FileReader();
    var file = evt.target.files[0];
    const scope = this;
    reader.onload = function () {
      dataURL = reader.result;
      scope.setState({ dataUrl: dataURL });
    };
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.log(error);
    }
  }

  Modal(payer) {
    this.setState(
      {
        showAvance: !this.state.showAvance,
        payer: payer,
        mode_paiement_choisi: this.state.mode_paiement_choisi,
      },
      () => {}
    );
  }
  AccepteSoution(espece) {
    const myToken = `Bearer ` + localStorage.getItem("myToken");
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
        text: intl.messages.details_cmd_changer_annonce,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: intl.messages.panier_delete_oui,
        cancelButtonText: intl.messages.panier_delete_non,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.setState(
            { etat: "accepter", espece_changement: espece },
            () => {}
          );

          //ancien_statut validé =>Montant du produit avarié a remboursé par l'ANOC
          if (
            this.state.commandes.ancien_statut === "validé" &&
            espece.prix < this.state.especeAv.prix
          ) {
            this.setState(
              {
                prix_reste:
                  this.state.prix_reste -
                  (this.state.especeAv.prix -
                    this.state.especeAv.avance -
                    (this.state.espece_changement.prix -
                      this.state.espece_changement.avance)),
                prix_avance:
                  this.state.prix_avance -
                  (this.state.especeAv.avance -
                    this.state.espece_changement.avance),
                prix_total:
                  this.state.prix_total -
                  (this.state.especeAv.prix -
                    this.state.espece_changement.prix),
                prixRemb: this.state.especeAv.prix - espece.prix,
                showRemb: !this.state.showRemb,
              },
              () => {}
            );
          } else {
            this.state.ids.push({
              id: this.state.especeAv._id,
              id_changement: this.state.espece_changement._id,
              etat: this.state.etat,
            });
            window.sessionStorage.setItem(
              "ids",
              JSON.stringify(this.state.ids)
            );

            this.setState(
              {
                prix_reste:
                  this.state.prix_reste -
                  (this.state.especeAv.prix -
                    this.state.especeAv.avance -
                    (this.state.espece_changement.prix -
                      this.state.espece_changement.avance)),
                prix_avance:
                  this.state.prix_avance -
                  (this.state.especeAv.avance -
                    this.state.espece_changement.avance),
                showSolution: false,
                showRemb: false,
                prix_total:
                  this.state.prix_total -
                  (this.state.especeAv.prix -
                    this.state.espece_changement.prix),
              },
              () => {}
            );

            Swal.fire({
              title: intl.messages.details_cmd_change_success,
              icon: "success",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
            this.terminer();
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: intl.messages.details_cmd_pas_changer_annonce,
            icon: "error",
            width: 400,
            heightAuto: false,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
  }
  RefuseTSoutions() {
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
        text: intl.messages.details_cmd_refuser_produit,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: intl.messages.panier_delete_oui,
        cancelButtonText: intl.messages.panier_delete_non,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          //code
          //fin code
          this.setState({ etat: "refuser" }, () => {
            //ancien_statut en attente de paiement avance=>soustraire le montant du produit initial
            const myToken = `Bearer ` + localStorage.getItem("myToken");

            if (
              this.state.commandes.ancien_statut ===
              "en attente de paiement avance"
            ) {
              this.setState({ showRemb: false }, () => {
                this.state.ids.push({
                  id: this.state.especeAv._id,
                  etat: this.state.etat,
                });
                //  this.state.reponses.push(res.data)
                window.sessionStorage.setItem(
                  "ids",
                  JSON.stringify(this.state.ids)
                );
                //   window.sessionStorage.setItem("reponses", JSON.stringify(this.state.reponses))

                Swal.fire({
                  title: intl.messages.details_cmd_annuler_success,
                  icon: "success",
                  width: 400,
                  heightAuto: false,
                  timer: 1500,
                  showConfirmButton: false,
                });
                this.terminer();
              });
            }

            //ancien_statut en attente de paiement du reste =>
            //Montant reste à payer = Montant reste initial - prix total produit avarié  | avance a remboursé par l'ANOC
            if (
              this.state.commandes.ancien_statut ===
              "en attente de paiement du reste"
            ) {
              this.setState(
                {
                  prixRemb: this.state.especeAv.avance,
                  showRemb: !this.state.showRemb,
                },
                () => {}
              );
            }

            //ancien_statut validé =>Montant du produit avarié a remboursé par l'ANOC
            if (this.state.commandes.ancien_statut === "validé") {
              this.setState(
                {
                  prixRemb: this.state.especeAv.prix,
                  showRemb: !this.state.showRemb,
                },
                () => {}
              );
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: intl.messages.details_cmd_non_refuser,
            icon: "error",
            width: 400,
            heightAuto: false,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
  }
  ModalS(espece) {
    let pdchangement = this.state.commandes.especes.filter(
      (f) => f.id_espece === espece._id
    )[0].produits_changement;
    if (
      pdchangement.filter((p) => p.feedback !== null && p.feedback !== "")
        .length === pdchangement.length
    ) {
      this.setState(
        { showChoix: true, showSolution: false, especeAv: espece },
        () => {}
      );
    } else {
      this.setState({ showChoix: false }, () => {
        if (
          this.state.commandes.especes.filter(
            (f) => f.id_espece === espece._id
          )[0].produits_changement.length === 0
        ) {
          this.setState({ etat: "refuser", especeAv: espece }, () => {
            //ancien_statut en attente de paiement avance=>soustraire le montant du produit initial

            if (
              this.state.commandes.ancien_statut ===
              "en attente de paiement avance"
            ) {
              this.setState(
                {
                  showRemb: !this.state.showRemb,
                  showSolution: !this.state.showSolution,
                },
                () => {}
              );
            }

            //ancien_statut en attente de paiement du reste =>
            //Montant reste à payer = Montant reste initial - prix total produit avarié  | avance a remboursé par l'ANOC
            if (
              this.state.commandes.ancien_statut ===
              "en attente de paiement du reste"
            ) {
              this.setState(
                {
                  prixRemb: this.state.especeAv.avance,
                  showRemb: !this.state.showRemb,
                },
                () => {}
              );
            }

            //ancien_statut validé =>Montant du produit avarié a remboursé par l'ANOC
            if (this.state.commandes.ancien_statut === "validé") {
              this.setState(
                {
                  prixRemb: this.state.especeAv.prix,
                  showRemb: !this.state.showRemb,
                },
                () => {}
              );
            }
          });
        } else {
          let tab = [];
          this.setState(
            {
              showRemb: false,
              showSolution: !this.state.showSolution,
              especeAv: espece,
            },
            () => {
              if (
                espece !== undefined &&
                espece !== {} &&
                espece !== null &&
                Object.keys(espece).length > 0
              ) {
                tab[0] = espece;
                tab[1] = this.state.commandes.especes.filter(
                  (e) => e.id_espece === espece._id
                )[0];
                tab[2] = [];
                tab[1].produits_changement.map((e) => {
                  tab[2].push(
                    this.state.commandes.espece_avariee.filter(
                      (esp) => esp._id === e.id_espece
                    )[0]
                  );
                });
              }
              this.setState({ Especes: tab }, () => {});
            }
          );
        }
      });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {});
  }
  componentWillUnmount() {
    if (
      (window.sessionStorage.getItem("ids") &&
        JSON.parse(window.sessionStorage.getItem("ids")).length === 0) ||
      (window.sessionStorage.getItem("ids") &&
        JSON.parse(window.sessionStorage.getItem("ids")).length ===
          this.state.commandes.espece.filter(
            (e) => e.statut === "produit avarié"
          ).length) ||
      this.state.commandes.espece.filter((e) => e.statut === "produit avarié")
        .length === 0
    ) {
    }
  }

  componentDidMount() {
    window.addEventListener("load", (ev) => {
      ev.preventDefault();

      if (
        window.sessionStorage.getItem("ids") &&
        !(
          JSON.parse(window.sessionStorage.getItem("ids")).length === 0 ||
          JSON.parse(window.sessionStorage.getItem("ids")).length ===
            this.state.commandes.espece.filter(
              (e) => e.statut === "produit avarié"
            ).length ||
          this.state.commandes.espece.filter(
            (e) => e.statut === "produit avarié"
          ).length === 0
        )
      ) {
        window.sessionStorage.setItem("ids", []);
        window.sessionStorage.setItem("reponses", []);
        this.setState(
          {
            commandes: this.props.location.state.id,
            ids: [],
            reponses: [],
          },
          () => {
            Swal.fire({
              title: intl.messages.cmd_changement_annuler,
              icon: "error",
              width: 400,
              heightAuto: false,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        );
      }
    });

    const myToken = `Bearer ` + localStorage.getItem("myToken");
    const token = localStorage.getItem("usertoken");
    const expiredTimeToken = localStorage.getItem("expiredTimeToken");
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
    const cmd = this.props.location.state.id;
    var currentdate = new Date(cmd.date_creation);
    //  currentdate = Date.parse(cmd.date_creation);
    var day = currentdate.getDate();
    var month = currentdate.getMonth() + 1;
    var year = currentdate.getFullYear();
    var hours = currentdate.getHours();

    if (hours > 8 && hours < 16) {
      var day = day;
      var month = month;
      var year = year;
      var hours = 16;
    }
    if ((hours > 16 && hours < 24) || hours === "00") {
      var day = day + 1;
      var month = month;
      var year = year;
      var hours = 12;
    }
    if (hours > 1 && hours < 8) {
      var day = day;
      var month = month;
      var year = year;
      var hours = 12;
    }

    var datetime = day + "/" + month + "/" + year + " à " + hours + ":00:00";
    // this.setState({ date: datetime });
    let espsAv = [];
    this.props.location.state.id.espece
      .filter((e) => e.statut === "produit avarié")
      .map((esp) => {
        espsAv.push({ id: esp._id, etat: null, choix: null });
      });

    if (!token || expiredTimeToken < formatted_date) {
      this.props.history.push("/login");
    } else {
      axios
        .get(
          "http://127.0.0.1:8000/api/cooperative/" +
            this.props.location.state.id.id_cooperative,
          {
            headers: {
              // "x-access-token": token, // the token is a variable which holds the token
              "Content-Type": "application/json",
              Authorization: myToken,
            },
          }
        )

        .then((res) => {
          let prixT = 0;
          if (
            this.props.location.state.id.ville_livraison !==
            "Récupérer à la coopérative"
          ) {
            let villeL = res.data.livraison.filter(
              (v) =>
                v.ville_livraison ===
                this.props.location.state.id.ville_livraison
            )[0];
            if (this.props.location.state.id.type_livraison === "vip") {
              prixT = villeL.prix_VIP;
            } else {
              prixT = this.props.location.state.id.adresse_domicile
                ? (villeL.prix_transport_domicile - -villeL.marge_risque) *
                  this.props.location.state.id.especes.length
                : (villeL.prix_transport_relais - -villeL.marge_risque) *
                  this.props.location.state.id.especes.length;
            }
          }

          this.setState(
            {
              cooperative: res.data,
              prix_transport:
                this.props.location.state.id.ville_livraison ===
                "Récupérer à la coopérative"
                  ? 0
                  : prixT,
            },
            () => {
              console.log(this.state.cooperative)
              this.setState({
                cooperative_rib: this.state.cooperative.rib,
                tech:
                  localStorage.getItem('lg')=='ar'
                  ?typeof this.state.cooperative.tech[0].prenom_ar!='undefined'&&
                  typeof this.state.cooperative.tech[0].nom_ar!='undefined'
                  ?this.state.cooperative.tech[0].prenom_ar +
                  " " +
                  this.state.cooperative.tech[0].nom_ar
                  :this.state.cooperative.tech[0].prenom +
                  " " +
                  this.state.cooperative.tech[0].nom
                  :this.state.cooperative.tech[0].prenom +
                  " " +
                  this.state.cooperative.tech[0].nom,
              });
              axios
                .get("http://127.0.0.1:8000/api/consommateur/" + token, {
                  headers: {
                    "Content-Type": "application/json",
                    // "Authorization": Mytoken,
                  },
                })

                .then((res) => {
                  this.setState({ connectedUserEmail: res.data.email });
                });
            }
          );
        });
    }
  }

  handelDelete() {
    // const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    // if (!token) {
    //   this.props.history.push("/login");
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
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
          //debut
          axios
            .delete(
              "http://127.0.0.1:8000/api/commande/" + this.state.commandes._id,
              {
                headers: {
                  // "x-access-token": token, // the token is a variable which holds the token
                  Authorization: myToken,
                },
              }
            )
            .then((res) => {
              axios
                .put(
                  "http://127.0.0.1:8000/api/Espece/" +
                    this.state.commandes.id_espece,
                  {
                    statut: "disponible",
                    //   msg_refus_avance: this.state.dataUrl,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: myToken,
                    },
                  }
                )
                .then((res) => {
                  // this.props.history.replace("/commandesParStatut");
                  this.setState({ redirect: true });
                });
              swalWithBootstrapButtons.fire(
                intl.messages.alerte_cmd_annulation_success_title,
                intl.messages.alerte_cmd_annulation_success_body,
                "success"
              );
            });

          //fin
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            intl.messages.alerte_cmd_annulation_failed_title,
            intl.messages.alerte_cmd_annulation_failed_body,
            "error"
          );
        }
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="./commandesParStatut" />;
    }
    let ids = window.sessionStorage.getItem("ids")
      ? JSON.parse(window.sessionStorage.getItem("ids"))
      : [];

    const commandes = this.state.commandes;
    console.log(this.state.commandes)
    let prix = this.state.commandes.espece.reduce(function (prev, cur) {
      return prev - -cur.prix;
    }, 0);
    let prix_transport = this.state.prix_transport;
    return (
      <React.Fragment>
        <Prompt
          when={
            !(
              ids.length === 0 ||
              ids.length ===
                this.state.commandes.espece.filter(
                  (e) => e.statut === "produit avarié"
                ).length ||
              this.state.commandes.espece.filter(
                (e) => e.statut === "produit avarié"
              ).length === 0
            )
          }
          message="Voulez-vous vraiment quitter cette page ? Les modifications que vous avez apportées ne seront pas enregistrées"
        />
        <div>
          <style>{`.btn-link {  color:white} .btn-link:hover {color:white;} .card { background-color: #fafafa !important } .container {max-width: 90%;}  `}</style>
          <div style={localStorage.getItem('lg')=='ar'?{direction:"rtl",textAlign:"right"}:{}} className="container">
            <h3 style={{ marginTop: "1em" }}><FormattedMessage id="details_cmd_title"/> </h3>
            <br></br>
            <div>
              <div id="accordion">
                {commandes.espece.filter((e) => e.statut === "produit avarié")
                  .length > 0 ? (
                  <div className="card">
                    <div
                      className="card-header p-0"
                      style={{ backgroundColor: "#bb2124" }}
                      id="headingfour"
                    >
                      <h5 className="mb-0">
                        <button
                          onClick={this.showCard.bind(this, 0)}
                          className="btn btn-link collapsed"
                        >
                          <h5 style={{ color: "white" }}>
                            <FaClipboardCheck className="mb-2" />
                            <FormattedMessage id="details_cmd_motif_annulation"/>
                          </h5>{" "}
                        </button>
                      </h5>
                    </div>
                    <div id="collapsefour" className={this.state.show[0]}>
                      <div className="card-body">
                        <br></br>

                        <ul>
                          <div className="row">
                            {commandes.espece
                              .filter(
                                (e) =>
                                  e.statut === "produit avarié" &&
                                  !this.verification(e._id)
                              )
                              .map((Annonces) => (
                                <div className="col-lg-3  col-sm-6">
                                  <span className="text-danger">
                                    <i
                                      className="fa fa-long-arrow-right"
                                      aria-hidden="true"
                                    >
                                      {" "}
                                    </i>
                                    <b>
                                      {
                                        this.getEspece(Annonces)
                                          .motif_annulation
                                      }
                                    </b>{" "}
                                  </span>
                                  <div
                                    id="anonce"
                                    className="product__item"
                                    style={{
                                      backgroundRepeat: "no-repeat",
                                      backgroundImage:
                                        "linear-gradient(rgb(255,153,153), rgb(255,204,204))",
                                      backgroundSize: "cover",
                                    }}
                                  >
                                    <div
                                      className="product__item__pic set-bg"
                                      data-setbg={Annonces.images}
                                    >
                                      <img
                                        src={Annonces.image_face}
                                        className="product__item__pic set-bg"
                                      />
                                    </div>
                                    {Annonces.anoc ? (
                                      <h1
                                        style={{
                                          borderRadius: "0% 0% 0% 40%",
                                          fontSize: "14px",
                                        }}
                                        className=" badge badge-success py-1 w-100  "
                                      >
                                        <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                        <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                                      </h1>
                                    ) : (
                                      <span className="badge pt-3 w-100  mt-1  ">
                                        {"  "}
                                      </span>
                                    )}
                                    <div className="product__item__text p-2 text-justify">
                                      <h6 className="">
                                        <b><FormattedMessage id="details_mouton_numero_boucle"/></b> : {Annonces.boucle}
                                      </h6>
                                      <h6 className="">
                                        <b><FormattedMessage id="details_mouton_espece"/></b> :{" "}
                                        {Annonces.espece == "chevre"
                                          ? <FormattedMessage id="tout_les_annonces_chevre"/>
                                          : <FormattedMessage id="tout_les_annonces_mouton"/>}
                                      </h6>
                                      <h6 className="">
                                        <b><FormattedMessage id="home_item_race"/> :</b>
                                        {localStorage.getItem("lg") == "ar"
                                              ? Annonces.race_ar
                                              ?Annonces.race_ar
                                              :Annonces.race
                                              :Annonces.race}
                                      </h6>
                                      <h6 className="">
                                        <b><FormattedMessage id="home_item_poids"/> : </b>
                                        {Annonces.poids} <FormattedMessage id="cmd_kg"/>
                                      </h6>
                                      <h6 className="">
                                        <b><FormattedMessage id="cmd_age"/> :</b> {Annonces.age}{" "} <FormattedMessage id="cmd_mois"/>
                                      </h6>
                                      <h6 className="">
                                        <b><FormattedMessage id="add_mouton_localisation"/> :</b>{" "}
                                        {Annonces.localisation}
                                      </h6>
                                      <h5 className=" text-danger  ">
                                        <i
                                          className="fa fa-usd"
                                          aria-hidden="true"
                                        ></i>{" "}
                                        {Annonces.prix + " "+intl.messages.panier_currency}
                                      </h5>
                                      <div className="row mt-3">
                                        <div className="col-2"> </div>
                                        <button
                                          type="button"
                                          onClick={this.ModalS.bind(
                                            this,
                                            Annonces
                                          )}
                                          className="col-8 py-1 btn btn-success"
                                        >
                                          {this.getEspece(
                                            Annonces
                                          ).produits_changement.filter(
                                            (p) =>
                                              p.feedback !== null &&
                                              p.feedback !== ""
                                          ).length > 0
                                            ? "Solution choisi"
                                            : " Solutions proposées"}
                                        </button>
                                        <div className="col-2"> </div>
                                      </div>
                                    </div>{" "}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="card">
                  <div
                    className="card-header p-0"
                    style={{ backgroundColor: "#009141" }}
                    id="headingOne"
                  >
                    <button
                      onClick={this.showCard.bind(this, 1)}
                      className="btn btn-link"
                      style={{ width: "100%", textDecoration: "none" }}
                    >
                      <h5
                        style={{
                          color: "white",
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          width: "100%",
                        }}
                      >
                        <div
                          className="item"
                          style={localStorage.getItem('lg')=='ar'?{ flexBasis: "95%", textAlign: "right" }:{ flexBasis: "95%", textAlign: "left" }}
                        >
                          {" "}
                          <FaClipboardCheck className="mb-2" /> <FormattedMessage id="details_cmd_details_produit"/>{" "}
                        </div>{" "}
                        <div className="item" style={{ flexBasis: "5%" }}>
                          {" "}
                          <i className="fa fa-angle-down fa-lg arrowicon"></i>
                        </div>
                      </h5>{" "}
                    </button>
                  </div>

                  <div id="collapseOne" className={this.state.show[1]}>
                    <div className="card-body">
                      <div className="row">
                        {commandes.espece.map((esp) => (
                          <div className="col-lg-6  col-sm-6 mb-4">
                            <div className="row">
                              <div
                                className="col-lg-6  col-sm-6 pr-0 border-0"
                                style={{ height: "250px" }}
                              >
                                <div className="product__item">
                                  <div
                                    className="product__item__pic set-bg"
                                    style={
                                      esp.anoc !== null
                                        ? { height: "223px" }
                                        : { height: 250 }
                                    }
                                    data-setbg={esp.images}
                                  >
                                    <img
                                      src={esp.image_face}
                                      style={
                                        esp.anoc !== null
                                          ? { height: "223px" }
                                          : { height: "250px" }
                                      }
                                      className="product__item__pic set-bg"
                                    />

                                    <ul className="product__item__pic__hover">
                                      <li>
                                        <Link to={`/DetailsMouton/${esp._id}`}>
                                          <a href="#">
                                            <i className="fa fa-eye"></i>
                                          </a>
                                        </Link>
                                      </li>
                                      {commandes.statut ===
                                        "en attente de paiement avance" ||
                                      commandes.statut ===
                                        "en attente de validation avance" ||
                                      commandes.statut ===
                                        "en attente de paiement du reste" ? (
                                        <li>
                                          <a
                                            type="button"
                                            onClick={this.handelDeleteEspece.bind(
                                              this,
                                              esp
                                            )}
                                          >
                                            <i className="fa fa-trash"></i>
                                          </a>
                                        </li>
                                      ) : null}
                                    </ul>
                                  </div>
                                  {esp.anoc ? (
                                    <h1
                                      style={{
                                        borderRadius: "0% 0% 0% 40%",
                                        fontSize: "14px",
                                      }}
                                      className=" badge badge-success py-1 w-100  "
                                    >
                                      <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                      <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                                    </h1>
                                  ) : (
                                    <span className="badge pt-3 w-100  mt-1  ">
                                      {"  "}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div
                                className="col-lg-6  col-sm-6 border"
                                style={{
                                  height: "250px",
                                  backgroundRepeat: "no-repeat",
                                  backgroundImage:
                                    esp.statut === "produit avarié"
                                      ? "linear-gradient(rgb(255,153,153), rgb(255,204,204))"
                                      : null,
                                  backgroundSize: "cover",
                                }}
                              >
                                <div className="product__item__text p-2 text-justify">
                                  <h6 className="">
                                    <b><FormattedMessage id="details_mouton_numero_boucle"/></b> : {esp.boucle}
                                  </h6>
                                  <h6 className="">
                                    <b><FormattedMessage id="details_mouton_espece"/></b> :{" "}
                                    {esp.espece == "chevre"
                                      ? <FormattedMessage id="tout_les_annonces_chevre"/>
                                      : <FormattedMessage id="tout_les_annonces_mouton"/>}
                                  </h6>
                                  <h6 className="">
                                    <b><FormattedMessage id="home_item_race"/> :</b>{" "}
                                    {localStorage.getItem("lg") == "ar"
                                              ? esp.race_ar
                                              ?esp.race_ar
                                              :esp.race
                                              :esp.race}
                                  </h6>
                                  <h6 className="">
                                    <b><FormattedMessage id="home_item_poids"/> : </b>
                                    {esp.poids} {" "}<FormattedMessage id="cmd_kg"/>
                                  </h6>
                                  <h6 className="">
                                    <b><FormattedMessage id="cmd_age"/> :</b> {esp.age} {" "}<FormattedMessage id="cmd_mois"/>
                                  </h6>
                                  <h6 className="">
                                    <b><FormattedMessage id="add_mouton_localisation"/> :</b>{" "}
                                    {localStorage.getItem("lg") == "ar"
                                              ? esp.localisation_ar
                                              ?esp.localisation_ar
                                              :esp.localisation
                                              :esp.localisation}
                                  </h6>

                                  <h5 className=" text-danger mt-4">
                                    <img
                                      style={{ height: "30px" }}
                                      src={require("./Images/cash-payment.png")}
                                      alt=""
                                    />{" "}
                                    {esp.prix + " "+intl.messages.panier_currency}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="card-header p-0"
                    style={{ backgroundColor: "#009141" }}
                    id="headingTwo"
                  >
                    <button
                      onClick={this.showCard.bind(this, 2)}
                      className="btn btn-link collapsed"
                      style={{ width: "100%", textDecoration: "none" }}
                    >
                      <h5
                        style={{
                          color: "white",
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          width: "100%",
                        }}
                      >
                        <div
                          className="item"
                          style={localStorage.getItem('lg')=='ar'?{ flexBasis: "95%", textAlign: "right" }:{ flexBasis: "95%", textAlign: "left" }}
                        >
                          {" "}
                          <FaClipboardCheck className="mb-2" />
                          <FormattedMessage id="details_cmd_details_livraison"/>{" "}
                        </div>
                        <div className="item" style={{ flexBasis: "5%" }}>
                          {" "}
                          <i className="fa fa-angle-down fa-lg arrowicon"></i>
                        </div>{" "}
                      </h5>{" "}
                    </button>
                  </div>
                  <div className="">
                    <div id="collapseTwo" className={this.state.show[2]}>
                      <div className="card-body">
                        <div id="centrer" className="col-lg-12 col-md-6">
                          <div className="shoping__checkout mt-2 pb-0">
                            <ul>
                              {commandes.date_de_livraison ? (
                                <li>
                                  <i
                                    className="fa fa-calendar-o"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <FormattedMessage id="cmd_statut_date_livraison"/>
                                  <b style={{ fontWeight: "normal" }}>
                                    {" "}
                                    {commandes.date_de_livraison.replace(
                                      /-/g,
                                      " / "
                                    )}{" "}
                                  </b>
                                </li>
                              ) : null}
                              <li>
                                <i
                                  className="fa fa-map-o"
                                  aria-hidden="true"
                                ></i>{" "}
                                <FormattedMessage id="step1_ville_de_livraison"/> :{" "}
                                <b>{" "}
                                  {localStorage.getItem('lg')=='ar'
                                  ?commandes.ville_livraison=="Récupérer à la coopérative"
                                  ?"اخذه من التعاونية"
                                  :commandes.ville_livraison_ar
                                  :commandes.ville_livraison}
                                  {/* {commandes.ville_livraison} */}
                                  </b>{" "}
                              </li>
                              <li>
                                <i
                                  className="fa fa-map-marker"
                                  aria-hidden="true"
                                ></i>{" "}
                                <FormattedMessage id="details_cmd_adresse_livraison"/> :{" "}
                                <b>
                                  {commandes.adresse_domicile
                                    ? commandes.adresse_domicile
                                    :localStorage.getItem('lg')=='ar'
                                    ? commandes.point_relais=="entrée de la ville"
                                    ?"مدخل المدينة"
                                    :commandes.point_relais=="Récupérer à la coopérative"
                                    ?"اخذه من التعاونية"
                                    :commandes.point_relais
                                    :commandes.point_relais}
                                </b>{" "}
                              </li>
                              {commandes.date_de_livraison ? null : (
                                <h6
                                  style={{
                                    color: "#bb2124",
                                    marginBottom: "10px",
                                  }}
                                >
                                  <i
                                    className="fa fa-exclamation-circle"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <FormattedMessage id="step1_message_livraison"/>
                                  {" "}
                                </h6>
                              )}
                            </ul>
                          </div>
                          <br></br>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div
                    className="card-header p-0"
                    style={{ backgroundColor: "#009141" }}
                    id="headingThree"
                  >
                    <button
                      onClick={this.showCard.bind(this, 3)}
                      className="btn btn-link collapsed"
                      style={{ width: "100%", textDecoration: "none" }}
                    >
                      <h5
                        style={{
                          color: "white",
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          width: "100%",
                        }}
                      >
                        <div
                          className="item"
                          style={localStorage.getItem('lg')=='ar'?{ flexBasis: "95%", textAlign: "right" }:{ flexBasis: "95%", textAlign: "left" }}
                        >
                          {" "}
                          <FaClipboardCheck className="mb-2" /> <FormattedMessage id="details_cmd_details_prix"/>{" "}
                        </div>{" "}
                        <div className="item" style={{ flexBasis: "5%" }}>
                          <i className="fa fa-angle-down fa-lg arrowicon"></i>
                        </div>
                      </h5>{" "}
                    </button>
                  </div>
                  <div id="collapseThree" className={this.state.show[3]}>
                    <div className="card-body">
                      <div id="centrer" className="col-lg-12 col-md-6">
                        <div className="shoping__checkout mt-2 pb-0">
                          <div className="shoping__checkout mt-2 pb-0">
                            <ul>
                              <li>
                                <FormattedMessage
                                id="step2_prix_net"
                                values={{ prix:this.state.prix_total - this.state.prix_transport,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                              </li>
                              {
                                <li
                                  style={{
                                    borderBottomStyle: "dashed",
                                    borderColor: "black",
                                  }}
                                >
                                  <FormattedMessage
                                id="step2_prix_transport"
                                values={{ prix:this.state.prix_transport,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                </li>
                              }

                              <li>
                              <FormattedMessage
                                id="step2_prix_totale"
                                values={{ prix:this.state.prix_total,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                              </li>

                              {commandes.statut ===
                                "en attente de paiement avance" ||
                              (commandes.statut === "avarié" &&
                                commandes.ancien_statut ===
                                  "en attente de paiement avance") ? (
                                <li className="text-danger">
                                  <i
                                    className="fa fa-exclamation-circle"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <FormattedMessage id="cmd_avance"/>{" "}
                                  <span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}> {this.state.prix_avance}{" "}<FormattedMessage id="panier_currency"/></span>
                                </li>
                              ) : null}
                              {commandes.statut ===
                              "en attente de validation avance" ? (
                                <li>
                                  <FormattedMessage
                                id="details_cmd_avance_deja_payee"
                                values={{ prix:this.state.prix_avance,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                  {/* Avance deja payee{" "}
                                  <span> {this.state.prix_avance}Dhs</span> */}
                                </li>
                              ) : null}
                              {commandes.statut ===
                                "en attente de paiement du reste" ||
                              (commandes.statut === "avarié" &&
                                commandes.ancien_statut ===
                                  "en attente de paiement du reste") ? (
                                <>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_avance_deja_payee"
                                values={{ prix:this.state.prix_avance,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                    {/* Avance deja payee{" "}
                                    <span> {this.state.prix_avance}Dhs</span> */}
                                  </li>
                                  <li className="text-danger">
                                    <i
                                      className="fa fa-exclamation-circle"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    <FormattedMessage
                                id="details_cmd_reste_a_payee"
                                values={{ prix:this.state.prix_reste,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                    {/* Reste à payer{" "}
                                    <span> {this.state.prix_reste}Dhs</span> */}
                                  </li>
                                </>
                              ) : null}

                              {commandes.statut ===
                                "en attente de validation reste" ||
                              commandes.statut === "validé" ? (
                                <>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_avance_deja_payee"
                                values={{ prix:this.state.prix_avance,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                    {/* Avance deja payee{" "}
                                    <span> {this.state.prix_avance}Dhs</span> */}
                                  </li>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_reste_deja_payee"
                                values={{ prix:this.state.prix_reste,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                    {/* Reste deja payee{" "}
                                    <span> {this.state.prix_reste}Dhs</span> */}
                                  </li>
                                </>
                              ) : null}
                              {commandes.statut ===
                                "en attente de paiement du complément" ||
                              (commandes.statut === "avarié" &&
                                commandes.ancien_statut ===
                                  "en attente de paiement du complément") ? (
                                <>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_avance_deja_payee"
                                values={{ prix:this.state.prix_avance,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                  </li>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_reste_deja_payee"
                                values={{ prix:this.state.prix_reste,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                  </li>
                                  <li className="text-danger">
                                    <i
                                      className="fa fa-exclamation-circle"
                                      aria-hidden="true"
                                    ></i>{" "}
                                    <FormattedMessage
                                id="details_cmd_complement_a_payee"
                                values={{ prix:commandes.complement,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                    {/* Complement à payer{" "}
                                    <span> {commandes.complement}Dhs</span> */}
                                  </li>
                                </>
                              ) : null}
                              {commandes.statut ===
                              "en attente de validation du complément" ? (
                                <>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_avance_deja_payee"
                                values={{ prix:this.state.prix_avance,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                  </li>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_reste_deja_payee"
                                values={{ prix:this.state.prix_reste,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                  </li>
                                  <li>
                                  <FormattedMessage
                                id="details_cmd_complement_deja_payee"
                                values={{ prix:this.state.prix_complement,span:(word)=><span style={localStorage.getItem('lg')=='ar'?{"float":"left"}:{}}>{word}</span> }}
                                />
                                    {/* Complement deja payee{" "}
                                    <span>
                                      {" "}
                                      {this.state.prix_complement}Dhs
                                    </span> */}
                                  </li>
                                </>
                              ) : null}
                              {commandes.statut === "validé" ? (
                                <li className=" text-success">
                                  <i
                                    className="fa fa-exclamation-circle"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <FormattedMessage id="details_cmd_cmd_validee"/>
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {commandes.statut === "en attente de paiement avance" ||
                commandes.statut === "en attente de validation avance" ||
                commandes.statut === "en attente de paiement du reste" ||
                commandes.statut === "en attente de validation reste" ||
                commandes.statut === "validé" ||
                commandes.statut === "en attente de paiement du complément" ||
                commandes.statut ===
                  "en attente de validation du complément" ? (
                  <div className="card">
                    <div
                      className="card-header p-0"
                      style={{ backgroundColor: "#009141" }}
                      id="headingfive"
                    >
                      <button
                        onClick={this.showCard.bind(this, 5)}
                        className="btn btn-link collapsed"
                        style={{ width: "100%", textDecoration: "none" }}
                      >
                        <h5
                          style={{
                            color: "white",
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "nowrap",
                            width: "100%",
                          }}
                        >
                          <div
                            className="item"
                            style={localStorage.getItem('lg')=='ar'?{ flexBasis: "95%", textAlign: "right" }:{ flexBasis: "95%", textAlign: "left" }}
                          >
                            {" "}
                            <FaClipboardCheck className="mb-2" />{" "}
                            {commandes.statut ===
                              "en attente de paiement avance" ||
                            commandes.statut ===
                              "en attente de validation avance"
                              ? <FormattedMessage id="details_cmd_frais_reservation_title"/>
                              : null}
                            {commandes.statut ===
                              "en attente de paiement du reste" ||
                            commandes.statut ===
                              "en attente de validation reste" ||
                            commandes.statut === "validé"
                              ? <FormattedMessage id="details_cmd_reste_du_montant"/>
                              : null}
                            {commandes.statut ===
                              "en attente de paiement du complément" ||
                            commandes.statut ===
                              "en attente de validation du complément"
                              ? <FormattedMessage id="details_cmd_complement_du_montant"/>
                              : null}
                          </div>
                          <div className="item" style={{ flexBasis: "5%" }}>
                            {" "}
                            <i className="fa fa-angle-down fa-lg arrowicon"></i>
                          </div>
                        </h5>{" "}
                      </button>
                    </div>
                    <div id="collapsefive" className={this.state.show[5]}>
                      <div className="card-body">
                        <br></br>

                        <ul>
                          {commandes.statut ===
                            "en attente de paiement avance" ||
                          commandes.statut === "reçu avance refusé" ? (
                            <div>
                              <h5>
                                {" "}
                                <b><FormattedMessage id="details_cmd_frais_reservation_message"/> </b>
                                <small>
                                  {commandes.avance} {" "}<FormattedMessage id="panier_currency"/>
                                </small>
                              </h5>
                              <br></br>
                              <div className="form-check">
                                <input
                                  checked={
                                    this.state.mode_paiement_choisi ===
                                    "virement"
                                  }
                                  onChange={this.onChange}
                                  className="form-check-input"
                                  type="radio"
                                  name="mode_paiement_choisi"
                                  id="virement"
                                  value="virement"
                                />
                                <label
                                style={localStorage.getItem('lg')=='ar'?{paddingRight:"1.25rem"}:{}}
                                  className="form-check-label"
                                  htmlFor="virement"
                                >
                                  <b> <FormattedMessage id="step2_virement_bancaire"/></b>
                                </label>
                              </div>
                              <p>
                                <FormattedMessage id="details_cmd_frais_reservation_message1"/>
                                <span className="text-danger">
                                  {" " + this.state.cooperative_rib}
                                </span>
                              </p>
                              <div className="form-check mt-2">
                                <input
                                  checked={
                                    this.state.mode_paiement_choisi ===
                                    "transfert"
                                  }
                                  onChange={this.onChange}
                                  className="form-check-input"
                                  type="radio"
                                  name="mode_paiement_choisi"
                                  id="transfert"
                                  value="transfert"
                                />
                                <label
                                style={localStorage.getItem('lg')=='ar'?{paddingRight:"1.25rem"}:{}}
                                  className="form-check-label"
                                  htmlFor="transfert"
                                >
                                  <b><FormattedMessage id="step3_par_agence"/></b>
                                </label>
                              </div>

                              <span>
                                <small>
                                  <FormattedMessage id="step3_frais_transport"/>
                                </small>
                              </span>
                              <p>
                                <FormattedMessage id="details_cmd_frais_reservation_message1_eleveur"/>
                                {
                                  <span className="text-danger">
                                    {" " + this.state.tech}
                                  </span>
                                }
                              </p>
                              <br></br>
                              <p className="text-danger">
                              <FormattedMessage
                                id="details_cmd_attention_messages"
                                values={{ deadline:commandes.deadline
                                  ,b:(word)=><b>{word}</b>
                                  ,br:()=><br></br> }}
                                />
                                {/* <b>Attention :</b>
                                <br></br>
                                Vous avez jusqu'au{" "}
                                {" " + commandes.deadline + " "} pour nous
                                transmettre la copie (scan / photo) de l'ordre
                                de virement ou de transfert .Au-delà de ce
                                delai, votre commande sera annulee. */}
                              </p>
                            </div>
                          ) : null}
                          {commandes.statut ===
                          "en attente de validation avance" ? (
                            <div>
                              <b><FormattedMessage id="cmd_validation_en_cours"/></b>{" "}
                              {commandes.avance + " "}<FormattedMessage id="panier_currency"/>
                              <p className="text-danger">
                                <FormattedMessage id="details_cmd_recu_bien_recu"/>
                              </p>
                              <br></br>
                              <br></br>
                              <br></br>
                              <div className="row ">
                                <div className="col"> </div>
                                <div className="col">
                                  {" "}
                                  <div className="product__details__pic">
                                    <div className="product__details__pic__item">
                                      <img
                                        className="product__details__pic__item--large"
                                        src={commandes.reçu_avance}
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col"> </div>
                              </div>
                            </div>
                          ) : null}
                          {commandes.statut ===
                            "en attente de paiement du reste" ||
                          commandes.statut === "reçu reste refusé" ? (
                            <div>
                              <b>
                                <FormattedMessage id="details_cmd_reste_montant"/> : 
                                {" "+commandes.reste + " "}<FormattedMessage id="panier_currency"/>
                              </b>
                            </div>
                          ) : null}

                          {commandes.statut ===
                          "en attente de validation reste" ? (
                            <div>
                              <b><FormattedMessage id="cmd_validation_en_cours"/></b>{" "}
                              {commandes.reste + " "}<FormattedMessage id="panier_currency"/>
                              <p className="text-danger">
                                <FormattedMessage id="details_cmd_livraison_message"/>
                              </p>
                              <br></br>
                              <br></br>
                              <br></br>
                              <div className="row ">
                                <div className="col"> </div>
                                <div className="col">
                                  {" "}
                                  <div className="product__details__pic">
                                    <div className="product__details__pic__item">
                                      <img
                                        className="product__details__pic__item--large"
                                        src={commandes.reçu_montant_restant}
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col"> </div>
                              </div>
                            </div>
                          ) : null}
                          {commandes.statut ===
                          "en attente de paiement du complément" ? (
                            <div>
                              <b>
                                <FormattedMessage id="details_cmd_complement_montant"/> :{" "}
                                {" "+commandes.complement + " "}<FormattedMessage id="panier_currency"/>
                              </b>
                            </div>
                          ) : null}
                          {commandes.statut ===
                          "en attente de validation du complément" ? (
                            <div>
                              <b><FormattedMessage id="cmd_validation_en_cours"/></b>{" "}
                              {commandes.complement + " "}<FormattedMessage id="panier_currency"/>
                              <p className="text-danger">
                                <FormattedMessage id="details_cmd_livraison_message"/>
                              </p>
                              <br></br>
                              <br></br>
                              <br></br>
                              <div className="row ">
                                <div className="col"> </div>
                                <div className="col">
                                  {" "}
                                  <div className="product__details__pic">
                                    <div className="product__details__pic__item">
                                      <img
                                        className="product__details__pic__item--large"
                                        src={commandes.reçu_montant_complement}
                                        alt="reçu_montant_complement"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col"> </div>
                              </div>
                            </div>
                          ) : null}
                          {commandes.statut === "validé" ? (
                            <div>
                              <p className="text-danger">
                              <FormattedMessage
                                id="details_cmd_virement_valide_message"
                                values={{ date_de_livraison:commandes.date_de_livraison}}
                                />
                              </p>
                              <br></br>
                              <br></br>
                              <br></br>
                              <div className="row ">
                                <div className="col"> </div>
                                <div className="col">
                                  {" "}
                                  <div className="product__details__pic">
                                    <div className="product__details__pic__item">
                                      {commandes.reçu_montant_complement ===
                                        null ||
                                      commandes.reçu_montant_complement ===
                                        undefined ? (
                                        <img
                                          className="product__details__pic__item--large"
                                          src={commandes.reçu_montant_restant}
                                          alt="reçu_montant_restant"
                                        />
                                      ) : (
                                        <img
                                          className="product__details__pic__item--large"
                                          src={
                                            commandes.reçu_montant_complement
                                          }
                                          alt="reçu_montant_complement"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col"> </div>
                              </div>
                            </div>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
                {commandes.statut !== "avarié" &&
                commandes.statut !== "en attente de paiement avance" &&
                commandes.statut !== "en attente de validation avance" &&
                commandes.statut !== "en attente de paiement du reste" &&
                commandes.statut !== "en attente de validation reste" &&
                commandes.statut !== "validé" &&
                commandes.statut !== "en attente de paiement du complément" &&
                commandes.statut !==
                  "en attente de validation du complément" ? (
                  <div className="card">
                    <div
                      className="card-header p-0"
                      style={{ backgroundColor: "#009141" }}
                    >
                      <h5 className="mb-0">
                        <button
                          onClick={this.showCard.bind(this, 4)}
                          className="btn btn-link collapsed"
                        >
                          <h5 style={{ color: "white" }}>
                            <FaClipboardCheck className="mb-2" /> 
                            <FormattedMessage id="details_cmd_motif_annulation"/>
                          </h5>{" "}
                        </button>
                      </h5>
                    </div>
                    <div id="collapsefour" className={this.state.show[4]}>
                      <div className="card-body">
                        <br></br>

                        <ul>
                          {" "}
                          <div>
                            <p className="text-danger">{commandes.statut}</p>
                            <p>
                              <b>
                                <FormattedMessage id="details_cmd_reclamation"/>
                                {" "}
                              </b>
                            </p>
                          </div>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="my-5">
              <div style={localStorage.getItem('lg')=='ar'?{justifyContent:"left"}:{}} className="row">
                <div className="col-md-4 offset-md-4">
                  {commandes.statut === "en attente de paiement avance" ||
                  commandes.statut === "reçu avance refusé" ? (
                    <button
                      style={{ fontSize: "18px" }}
                      id="centre"
                      onClick={this.Modal.bind(this, "avance")}
                      className="btn-success py-1 px-4 mb-3 w-75"
                    >
                      <BsFileEarmarkPlus className="fa-lg" /> <FormattedMessage id="details_cmd_payer_avance"/>{" "}
                    </button>
                  ) : null}
                  {commandes.statut === "en attente de paiement du reste" ||
                  commandes.statut === "reçu reste refusé" ? (
                    <button
                      style={{ fontSize: "18px" }}
                      id="centre"
                      onClick={this.Modal.bind(this, "reste")}
                      className="btn-success py-1 px-4 mb-3 w-75"
                    >
                      <BsFileEarmarkPlus className="fa-lg" /> <FormattedMessage id="details_cmd_payer_reste"/>{" "}
                    </button>
                  ) : null}
                  {commandes.statut ===
                  "en attente de paiement du complément" ? (
                    <button
                      style={{ fontSize: "18px" }}
                      id="centre"
                      onClick={this.Modal.bind(this, "complement")}
                      className="btn-success py-1 px-4 mb-3 w-75"
                    >
                      {" "}
                      <BsFileEarmarkPlus className="fa-lg" /> <FormattedMessage id="details_cmd_payer_complement"/>{" "}
                    </button>
                  ) : null}
                </div>
                <div className="col-md-3 offset-md-3"> </div>
              </div>
              <div style={localStorage.getItem('lg')=='ar'?{justifyContent:"left"}:{}} className="row mb-5">
                {console.log(commandes.statut)}
                {commandes.statut !== "commande annulée (deadline dépassé)" ? (
                  <>
                    <div className="col-md-4 offset-md-4 ">
                      <button
                        style={{ fontSize: "18px" }}
                        id="centre"
                        className="btn-danger py-1 px-4 mb-3 w-75"
                        onClick={this.handelDelete}
                      >
                        {" "}
                        <BiTrash className="fa-lg" /> <FormattedMessage id="alerte_cmd_annuler"/>{" "}
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="col-md-3 offset-md-3"> </div>
                <div className="col-md-3 offset-md-3"> </div>
              </div>
            </div>
          </div>
          {/**modal de changement*/}
          <Modal
            size={
              this.state.Especes[2] !== undefined &&
              this.state.Especes[2].length === 1 &&
              !this.state.showRemb
                ? null
                : "xl"
            }
            show={this.state.showSolution}
            onHide={this.Hide}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h4><FormattedMessage id="details_cmd_solution_propose"/></h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              className="overflow-auto"
              style={
                this.state.showRemb === false
                  ? this.state.Especes[2] !== undefined &&
                    this.state.Especes[2].length === 1 &&
                    !this.state.showRemb
                    ? { maxHeight: "max-content", margin: "auto" }
                    : { height: "620px" }
                  : { maxHeight: "max-content", minWidth: "600px" }
              }
            >
              {this.state.Especes[2] !== undefined &&
              this.state.showRemb === false &&
              this.state.showChoix === false ? (
                <>
                  {" "}
                  <div
                    className={this.state.Especes[2].length == 1 ? null : "row"}
                  >
                    {this.state.Especes[2].map((Annonces) => (
                      <div
                        style={
                          this.state.Especes[2].length === 1
                            ? { maxWidth: "max-content" }
                            : null
                        }
                        className={
                          this.state.Especes[2].length === 1
                            ? null
                            : "col-lg-3  col-sm-6"
                        }
                      >
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
                                <Link to={`/DetailsMouton/${Annonces._id}`}>
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
                              className=" badge badge-success py-1 w-100  "
                            >
                              <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                              <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                            </h1>
                          ) : (
                            <span className="badge pt-3 w-100  mt-1  ">
                              {"  "}
                            </span>
                          )}
                          <div style={localStorage.getItem('lg')=='ar'?{ direction:"rtl" }:{}} className="product__item__text p-2 text-justify">
                            <h6 className="">
                              <b><FormattedMessage id="details_mouton_espece"/></b> :{" "}
                              {Annonces.espece == "chevre"
                                ? <FormattedMessage id="tout_les_annonces_chevre"/>
                                : <FormattedMessage id="tout_les_annonces_mouton"/>}
                            </h6>
                            <h6 className="">
                              <b><FormattedMessage id="home_item_race"/> :</b> {Annonces.race}
                            </h6>
                            <h6 className="">
                              <b><FormattedMessage id="home_item_poids"/> : </b>
                              {Annonces.poids} <FormattedMessage id="cmd_kg"/>
                            </h6>
                            <h6 className="">
                              <b><FormattedMessage id="cmd_age"/> :</b> {Annonces.age} <FormattedMessage id="cmd_mois"/>
                            </h6>
                            {this.state.Especes[0].prix - Annonces.prix > 0 ? (
                              <h5 className=" text-success text-center mt-4  ">
                                -{" "}
                                {this.state.Especes[0].prix -
                                  Annonces.prix +
                                  " "}<FormattedMessage id="panier_currency"/>
                              </h5>
                            ) : (
                              <h5 className=" text-danger text-center mt-4 ">
                                +{" "}
                                {Annonces.prix -
                                  this.state.Especes[0].prix +
                                  " "}<FormattedMessage id="panier_currency"/>
                              </h5>
                            )}

                            {this.state.Especes[2].length > 1 ? (
                              <div className="row mt-3">
                                <div className="col-3"> </div>
                                <button
                                  type="button"
                                  onClick={this.AccepteSoution.bind(
                                    this,
                                    Annonces
                                  )}
                                  className="col-6 py-1 btn btn-success"
                                >
                                  <FormattedMessage id="details_cmd_accepter"/>
                                </button>
                                <div className="col-3"> </div>
                              </div>
                            ) : null}
                            {this.state.Especes[2].length === 1 ? (
                              <div className="row mt-3">
                                <div className="col-1"> </div>
                                <button
                                  type="button"
                                  onClick={this.AccepteSoution.bind(
                                    this,
                                    Annonces
                                  )}
                                  className="col-4 py-1 btn btn-success"
                                >
                                  <FormattedMessage id="details_cmd_accepter"/>
                                </button>
                                <div className="col-1"> </div>
                                <button
                                  onClick={this.RefuseTSoutions}
                                  type="button"
                                  className="col-4 py-1 btn btn-danger"
                                >
                                  <FormattedMessage id="details_cmd_refuser"/>
                                </button>
                                <div className="col-2"> </div>
                              </div>
                            ) : null}
                          </div>{" "}
                        </div>
                      </div>
                    ))}
                  </div>
                  {this.state.Especes[2].length > 1 ? (
                    <div className="row mt-1">
                      <div className="col-4"> </div>
                      <button
                        type="button"
                        onClick={this.RefuseTSoutions}
                        className="col-4 py-1 btn btn-danger"
                      >
                        <FormattedMessage id="details_cmd_refuser_solution"/>
                      </button>
                      <div className="col-4"> </div>
                    </div>
                  ) : null}
                </>
              ) : this.state.showRemb === true ? (
                <div>
                  {this.state.commandes.especes.filter(
                    (f) => f.id_espece === this.state.especeAv._id
                  )[0].produits_changement.length === 0 ? (
                    <h4 className="text-danger mb-5 mt-2">
                      {" "}
                      <FormattedMessage id="details_cmd_pas_de_produit_de_changement"/>
                    </h4>
                  ) : (
                    <h4 className="text-danger mb-5 mt-2">
                      {" "}
                      <FormattedMessage id="details_cmd_pas_de_produit_de_changement_refuser"/>
                    </h4>
                  )}
                  {this.state.commandes.ancien_statut !==
                  "en attente de paiement avance" ? (
                    <>
                      <h5>
                      <FormattedMessage id="details_cmd_proceder_au_remboursement"/>:{" "}
                        <span className="text-danger">
                          {this.state.prixRemb}{" "} <FormattedMessage id="panier_currency"/>
                        </span>
                      </h5>
                      <form className="my-5 ">
                        <div className="form-group">
                          <label htmlFor="nom_prenom">
                            <FormattedMessage id="details_cmd_nom_prenom"/>
                          </label>
                          {this.state.nom_prenom_valide === "" ? (
                            <FormattedMessage id="details_cmd_nom_prenom">
                            {(placeholder) => (
                              <input
                              onChange={this.onChange}
                              type="text"
                              className="form-control"
                              id="nom_prenom"
                              name="nom_prenom"
                              placeholder={placeholder}
                            />
                            )}
                          </FormattedMessage>
                            
                          ) : (
                            <FormattedMessage id="details_cmd_nom_prenom">
                            {(placeholder) => (
                              <input
                              disabled
                              value={this.state.nom_prenom_valide}
                              onChange={this.onChange}
                              type="text"
                              className="form-control"
                              id="nom_prenom"
                              name="nom_prenom"
                              placeholder={placeholder}
                            />
                            )}
                          </FormattedMessage>
                            
                          )}
                          <span className="text-danger">
                            {this.state.errors["nom_prenom"]}
                          </span>
                        </div>
                        <div className="form-group">
                          <label htmlFor="rib"><FormattedMessage id="details_cmd_numero_rib"/></label>
                          {this.state.rib_valide === "" ? (
                            <input
                              onChange={this.onChange}
                              type="text"
                              className="form-control"
                              id="rib"
                              name="rib"
                              placeholder="RIB"
                            />
                          ) : (
                            <input
                              disabled
                              onChange={this.onChange}
                              value={this.state.rib_valide}
                              type="text"
                              className="form-control"
                              id="rib"
                              name="rib"
                              placeholder="RIB"
                            />
                          )}
                          <span className="text-danger">
                            {this.state.errors["rib"]}
                          </span>
                        </div>
                      </form>
                      <br></br>
                      <br></br>
                      <div className="row mt-2">
                        <div className="col-3"> </div>
                        <button
                          type="button"
                          onClick={this.ModalS.bind(this, this.state.especeAv)}
                          className="btn btn-danger col-2"
                        >
                          <FormattedMessage id="details_cmd_annuler"/>{" "}
                        </button>
                        <div className="col-2"> </div>
                        <button
                          type="button"
                          onClick={this.handlPost}
                          className="btn btn-success col-2"
                        >
                          <FormattedMessage id="step3_valider"/>
                        </button>
                        <div className="col-3"> </div>
                      </div>
                    </>
                  ) : (
                    <h5><FormattedMessage id="details_cmd_annuler_annonce"/> </h5>
                  )}
                </div>
              ) : null}
            </Modal.Body>
          </Modal>

          {/**modal de changement*/}
          {/**modal choix*/}
          <Modal
            size="lg"
            show={this.state.showChoix && !this.state.cloture}
            onHide={this.Hide}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h4><FormattedMessage id="details_cmd_solution_choisi"/></h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              className="overflow-auto"
              style={{ maxHeight: "max-content" }}
            >
              {this.state.showChoix === true ? (
                <div>
                  {this.getEspece(
                    this.state.especeAv
                  ).produits_changement.filter((p) => p.feedback === "validé")
                    .length > 0 ? (
                    <>
                      {" "}
                      <h4 className="text-danger mb-5 mt-2">
                        {" "}
                        <FormattedMessage id="details_cmd_solution_choisi_espece"/>
                      </h4>
                      <div className="  mb-4">
                        <div className="row m-auto">
                          <div
                            className="col-lg-6  col-sm-6 pr-0 border-0"
                            style={{ height: "250px" }}
                          >
                            <div className="product__item">
                              {console.log(
                                this.getChoix(
                                  this.getEspece(this.state.especeAv)
                                )
                              )}
                              <div
                                className="product__item__pic set-bg"
                                style={
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).anoc !== null
                                    ? { height: "223px" }
                                    : { height: 250 }
                                }
                                data-setbg={
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).images
                                }
                              >
                                <img
                                  src={
                                    this.getChoix(
                                      this.getEspece(this.state.especeAv)
                                    ).image_face
                                  }
                                  style={
                                    this.getChoix(
                                      this.getEspece(this.state.especeAv)
                                    ).anoc !== null
                                      ? { height: "223px" }
                                      : { height: "250px" }
                                  }
                                  className="product__item__pic set-bg"
                                />

                                <ul className="product__item__pic__hover">
                                  <li>
                                    <Link
                                      to={`/DetailsMouton/${
                                        this.getChoix(
                                          this.getEspece(this.state.especeAv)
                                        )._id
                                      }`}
                                    >
                                      <a href="#">
                                        <i className="fa fa-eye"></i>
                                      </a>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              {this.getChoix(
                                this.getEspece(this.state.especeAv)
                              ).anoc ? (
                                <h1
                                  style={{
                                    borderRadius: "0% 0% 0% 40%",
                                    fontSize: "14px",
                                  }}
                                  className=" badge badge-success py-1 w-100  "
                                >
                                  <HiOutlineBadgeCheck className=" mr-1 fa-lg " />
                                  <span><FormattedMessage id="panier_Labelise"/></span>{" "}
                                </h1>
                              ) : (
                                <span className="badge pt-3 w-100  mt-1  ">
                                  {"  "}
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className="col-lg-6  col-sm-6 border"
                            style={{
                              height: "250px",
                              backgroundRepeat: "no-repeat",
                              backgroundImage:
                                this.getChoix(
                                  this.getEspece(this.state.especeAv)
                                ).statut === "produit avarié"
                                  ? "linear-gradient(rgb(255,153,153), rgb(255,204,204))"
                                  : null,
                              backgroundSize: "cover",
                            }}
                          >
                            <div style={localStorage.getItem('lg')=='ar'?{ direction:"rtl" }:{}} className="product__item__text p-2 text-justify">
                              <h6 className="">
                                <b><FormattedMessage id="details_mouton_numero_boucle"/></b> :{" "}
                                {
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).boucle
                                }
                              </h6>
                              <h6 className="">
                                <b><FormattedMessage id="details_mouton_espece"/></b> :{" "}
                                {
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).espece
                                }
                              </h6>
                              <h6 className="">
                                <b><FormattedMessage id="home_item_race"/> :</b>{" "}
                                {
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).race
                                }
                              </h6>
                              <h6 className="">
                                <b><FormattedMessage id="home_item_poids"/> : </b>
                                {
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).poids
                                }{" "}
                                <FormattedMessage id="cmd_kg"/>
                              </h6>
                              <h6 className="">
                                <b><FormattedMessage id="cmd_age"/> :</b>{" "}
                                {
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).age
                                }{" "}
                                <FormattedMessage id="cmd_mois"/>
                              </h6>
                              <h6 className="">
                                <b><FormattedMessage id="add_mouton_localisation"/> :</b>{" "}
                                {
                                  this.getChoix(
                                    this.getEspece(this.state.especeAv)
                                  ).localisation
                                }
                              </h6>

                              <h5 className=" text-danger mt-4">
                                <i className="fa fa-usd" aria-hidden="true"></i>{" "}
                                {this.getChoix(
                                  this.getEspece(this.state.especeAv)
                                ).prix + " "}<FormattedMessage id="panier_currency"/>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <h4 className="text-danger mb-5 mt-2">
                      {" "}
                      <FormattedMessage id="details_cmd_pas_de_produit_de_changement_refuser"/>
                    </h4>
                  )}
                </div>
              ) : null}
            </Modal.Body>
          </Modal>

          {/**modal choix*/}
          {/**modal de paiement*/}
          <Modal
            size="lg"
            show={this.state.showAvance}
            onHide={this.Modal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {this.state.payer === "avance" ? (
                  <h4><FormattedMessage id="details_cmd_recu_avance"/></h4>
                ) : null}
                {this.state.payer === "reste" ? (
                  <h4><FormattedMessage id="details_cmd_recu_reste"/></h4>
                ) : null}
                {this.state.payer === "complement" ? (
                  <h4><FormattedMessage id="details_cmd_recu_complement"/></h4>
                ) : null}{" "}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="col-lg-12 col-md-12">
                <div id="centreT" style={{ display: "none" }}>
                  <input
                    id="selectedFile"
                    type="file"
                    name="recuAvance"
                    onChange={this.handleChangeImage}
                    encType="multipart/form-data"
                    required
                  />
                </div>

                <label
                  htmlFor="selectedFile"
                  className=" w-100"
                  style={{ textAlign: "center" }}
                >
                  {this.state.dataUrl ? (
                    <img
                      id="img-background"
                      src={this.state.dataUrl}
                      width="50%"
                      height="auto"
                    />
                  ) : (
                    <img
                      id="img-background"
                      src="Images/upload.png"
                      width="50%"
                      height="auto"
                    />
                  )}
                </label>

                <br />
                <br />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={this.Modal}
                className="btn btn-danger"
              >
                <FormattedMessage id="details_cmd_annuler"/>{" "}
              </button>
              <button
                type="button"
                onClick={this.handlePut}
                className="btn btn-success"
              >
                <FormattedMessage id="step3_valider"/>
              </button>
            </Modal.Footer>
          </Modal>

          {/**modal  de paiement*/}
        </div>
      </React.Fragment>
    );
  }
}

export default DetailsCommande;
