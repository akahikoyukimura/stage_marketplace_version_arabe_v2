import React, { Component } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import { FormattedMessage } from "react-intl";

class Apropos extends Component {
  render() {
    const opts = {
      height: "390",
      width: "500",
    };
    return (
      <section className="product spad">
        <div id="apropos" className="container">
          <div class="col-lg-12 col-md-6">
            <h2 id="aproposh"><FormattedMessage id="Apropos_nous"></FormattedMessage></h2> <br></br>
            <h5 id="apropo1">
                <FormattedMessage id="Apropos_text"></FormattedMessage>
            </h5>
            <br></br>
            <br></br>
            <h2 id="aproposh"><FormattedMessage id="Apropos_objectifs"></FormattedMessage></h2> <br></br>
            <main>
              <ol class="gradient-list">
                <li>
                  Développer l’élevage ovin caprin et préserver le patrimoine
                  animal national ;
                </li>
                <li>
                  Améliorer les revenus des éleveurs de petits ruminants ;
                </li>
                <li>
                  Défendre l’intérêt des éleveurs et du secteur notamment dans
                  les politiques publiques.
                </li>
                <li>Organiser et améliorer la technicité des éleveurs;</li>
                <li>
                  Améliorer la productivité des races ovines et caprines au
                  Maroc;
                </li>
                <li>
                  Contribuer à la valorisation marchande des produits et
                  sous-produits de l’élevage;
                </li>
                <li>
                  Diffuser les bonnes pratiques en matière de conduite de
                  troupeau (santé animale, alimentation, reproduction, hygiène
                  des bâtiments,…);
                </li>
              </ol>
            </main>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="WlKkq-p2oJE" opts={opts} />
              </div>
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="spT3_hLoGVA" opts={opts} />
              </div>
            </div>
            <p></p>
            <p></p>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="8nw9TuE3vWw" opts={opts} />
              </div>
              <div className="col-lg-6 col-md-6">
                <YouTube videoId="Heq0JIjj8Po" opts={opts} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default Apropos;
