import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import OwnerName from "./OwnerName";

const MainMenu = () => (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-3">
      <Navbar.Text><OwnerName name="unknown" generation={0} /></Navbar.Text>
      <Navbar.Collapse>
        <Nav>
          <Nav.Link href="/">HOME</Nav.Link>
          <Nav.Link href="/profile">PROFILE</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
);

export default MainMenu;
