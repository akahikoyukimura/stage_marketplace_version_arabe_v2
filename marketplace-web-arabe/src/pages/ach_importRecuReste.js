import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";
class ach_importRecuReste extends Component {
  constructor() {
    super();
    // let redirect = false;
    this.state = {
      dataUrl: "",

      redirect: false,
    };
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handlePut = this.handlePut.bind(this);
  }

  handleChangeImage(evt) {
    var dataURL = "";
    var reader = new FileReader();
    var file = evt.target.files[0];
    const scope = this;
    reader.onload = function () {
      dataURL = reader.result;
      console.log(dataURL);
      scope.setState({ dataUrl: dataURL });
    };
    reader.readAsDataURL(file);
    // console.log(this.props.location.state.id)
  }

  handlePut = (e) => {
    e.preventDefault();

    const id = this.props.location.state.id;
    const myToken = `Bearer ` + localStorage.getItem("myToken");

    // const idm = this.props.location.state.idm;
    axios
      .put(
        "http://127.0.0.1:8000/api/commande/" + id.idc,
        {
          statut: "en attente de validation reste",
          reçu_montant_restant: this.state.dataUrl,
          id_consommateur: id.idc,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: myToken,
          },
        }
      )
      .then((res) => {
        axios
          .put(
            "http://127.0.0.1:8000/api/Espece/" + id.idm,
            {
              statut: "réservé",
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
            Swal.fire({
              text:
                "Vous allez recevoir un email de validation de votre reçu sur votre email : " +
                id.email,
              icon: "success",
              width: 400,
              heightAuto: false,
              confirmButtonColor: "#7fad39",

              confirmButtonText: "Ok!",
            });
            this.props.history.push("/commandesParStatut");
          });
      });
  };

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

    console.log(formatted_date);

    const expiredTimeToken = localStorage.getItem("expiredTimeToken");
    const token = localStorage.getItem("usertoken");
    const myToken = `Bearer ` + localStorage.getItem("myToken");
    console.log(expiredTimeToken);

    if (!token || expiredTimeToken < formatted_date) {
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <center>
        <div className="col-lg-6 col-md-6">
          <form onSubmit={this.handlePut}>
            <h2>
              importer le :{" "}
              <span className="vert">reçu reçu_montant_restant </span>
            </h2>{" "}
            <br />
            <div>
              <input
                type="file"
                name="recuAvance"
                onChange={this.handleChangeImage}
                encType="multipart/form-data"
                required
              />
              <br />
            </div>
            <br />
            <div class="product__details__pic__item">
              <br />
              <img
                id="img-background"
                class="product__details__pic__item--large"
                src={this.state.dataUrl}
              />
            </div>
            <button id="roundB" className="site-btn" type="submit">
              Valider
            </button>
            <br />
            <br />
          </form>
        </div>
      </center>
    );
  }
}

export default ach_importRecuReste;
