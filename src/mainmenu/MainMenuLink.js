import React from "react";
import {Nav} from "react-bootstrap";
import {connect} from "react-redux";

const MainMenuLink = ({rootLocation, href, children}) => (
    <Nav.Link href={rootLocation + href}>{children}</Nav.Link>
);

const mapStateToProps = (state) => ({rootLocation: state.root.location});

export default connect(mapStateToProps)(MainMenuLink);
