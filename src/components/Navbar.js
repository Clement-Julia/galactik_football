import React from "react";
import UserController from "../controller/userController";
let controller = new UserController();
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: controller.isLoggedIn(), // Par défaut, l'utilisateur n'est pas connecté
      isAdmin : controller.isAdmin()
    };
    console.log('test isConnected', controller.isLoggedIn())
    console.log('test isAdmin', controller.isAdmin())
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Navbar
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button> 
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              { this.state.isAdmin ?
              (<React.Fragment>
                <li className="nav-item">
                  <a className="nav-link" href="/rule">
                    Rule
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/player">
                    Player
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/team">
                    Team
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/league">
                    League
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/tournament">
                    Tournament
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/match">
                    Planning
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/administrationuser">
                    Administration User
                  </a>
                </li>
              </React.Fragment>):(<React.Fragment></React.Fragment>)}
              {!this.state.isLoggedIn ? (
                <React.Fragment>
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a className="nav-link" href="/connexion">
                        Connexion
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/inscription">
                        Inscription
                      </a>
                    </li>
                  </ul>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <a className="nav-link" href="/">
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/dashboard">
                        Dashboard
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/budget">
                        Market
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" onClick={() => { controller.logout() }} href="/deconnexion">
                        Déconnexion
                      </a>
                    </li>
                  </ul>
                </React.Fragment>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
