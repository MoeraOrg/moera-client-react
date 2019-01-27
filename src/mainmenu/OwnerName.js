import React from "react";
import {connect} from "react-redux";

import "./OwnerName.css";

const OwnerName = ({name, generation}) => {
    if (name) {
        return (
            <span className="owner-name">{name}<span className="generation">{generation}</span></span>
        );
    } else {
        return null;
    }
};

const mapStateToProps = (state) => state.owner;

export default connect(mapStateToProps)(OwnerName);
