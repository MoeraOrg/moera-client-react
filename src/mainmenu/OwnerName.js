import React from "react";
import { connect } from "react-redux";

import "./OwnerName.css";
import { ownerNameLoad } from "./ownerActions";

function OwnerNameGeneration({generation, latest}) {
    if (!latest) {
        return (<span className="generation">{generation}</span>);
    } else {
        return null;
    }
}

class OwnerName extends React.Component {

    componentDidMount() {
        this.props.ownerNameLoad();
    }

    render() {
        const { name, generation, latest, verified, correct } = this.props;
        if (name) {
            let klass = "owner-name";
            if (verified) {
                klass += correct ? " correct" : " incorrect";
            }
            return (
                <span className={klass}>
                    {name}
                    <OwnerNameGeneration generation={generation} latest={latest} />
                </span>
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
