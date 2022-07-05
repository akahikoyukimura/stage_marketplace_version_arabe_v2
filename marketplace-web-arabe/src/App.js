import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Header from "./pages/ach_Header";
import Footer from "./pages/ach_Footer";
import Container from "./containers/Container"
import login from './pages/auth/Login' 
import register from './pages/auth/SignUp'
import { BrowserRouter, Route } from "react-router-dom";
function App() {
  return (
    <div>
      {/* <Header /> */}
      {/* <Test />*/}
      {/* <Home />  */}
      {/* <AddMouton/> */}
      {/* <HomeCommande /> */}
      {/* <DetailsCommande /> */}
      {/* <HomeEleveur /> */}
      {/* <AddEleveur /> */}
      {/* <DetailsEleveur /> */}
      {/* <Container /> */}
      <BrowserRouter>
        {/* <Route exact path="/login" component={login} />
              <Route exact path="/regester" component={register} /> */}
        <Route
          path={[
            "/commandesParStatut",
            "/login",
            "/register",
            "/changePassword",
            "/changePasswordLink",
            "/",
            "/HomeSheepsParEleveur",
            "/importRecuReste",
            "/importRecuAvance",
            "/Favoris",
            "/DetailsCommande",
            "/ToutesLesAnnonces",
            "/Panier",
            "/AnnoncesParEleveurs",
            "/Commandes",
            "/Commander",
            "/AlerteCommande",
          ]}
          component={Container}
        />
      </BrowserRouter>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
