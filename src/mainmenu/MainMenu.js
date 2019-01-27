import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import OwnerName from "./OwnerName";
import MainMenuLink from "./MainMenuLink";

const MainMenu = () => (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-3">
      <Navbar.Text><OwnerName /></Navbar.Text>
      <Navbar.Collapse>
        <Nav>
          <MainMenuLink href="/">HOME</MainMenuLink>
          <MainMenuLink href="/profile">PROFILE</MainMenuLink>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
);

export default MainMenu;
