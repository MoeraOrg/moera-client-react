import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import "./App.css";

const App = () => {
    return (
      <>
        <div className="logobar"><img src="/pics/logo-w-64.png" alt="Moera" /></div>
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-3">
          <Navbar.Collapse>
            <Nav>
              <Nav.Link href="/">HOME</Nav.Link>
              <Nav.Link href="/profile">PROFILE</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
}

export default App;
