import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import "mainmenu/OwnerName.css";
import { ownerNameLoad } from "mainmenu/ownerActions";

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
            const klass = cx([
                "owner-name", {
                    "correct": verified && correct,
                    "incorrect": verified && !correct
                }
            ]);
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
