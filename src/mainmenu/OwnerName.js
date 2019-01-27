import React from "react";
import {connect} from "react-redux";

import "./OwnerName.css";
import { ownerNameLoad } from "./ownerActions";

class OwnerName extends React.Component {

    componentDidMount() {
        this.props.ownerNameLoad();
    }

    render() {
        const {name, generation} = this.props;
        if (name) {
            return (
                <span className="owner-name">{name}<span className="generation">{generation}</span></span>
            );
        } else {
            return null;
        }
    }

};

export default connect(
    (state) => state.owner,
    { ownerNameLoad }
)(OwnerName);
