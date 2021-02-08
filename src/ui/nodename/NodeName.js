import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import { getNamingNameDetails } from "state/naming/selectors";
import Jump from "ui/navigation/Jump";
import NodeNameText from "ui/nodename/NodeNameText";
import "./NodeName.css";

const NodeName = ({name, fullName, verified = false, correct = false, linked = true, details}) => {
    if (!name) {
        return null;
    }

    const klass = cx(
        "node-name", {
            "correct": verified && correct,
            "incorrect": verified && !correct
        }
    );
    linked = linked && (!details.loaded || details.nodeUri);
    return linked ?
        (
            <Jump className={klass} nodeName={name} href="/">
                <NodeNameText name={name} fullName={fullName}/>
            </Jump>
        )
    :
        (
            <span className={klass}>
                <NodeNameText name={name} fullName={fullName}/>
            </span>
        );
};

NodeName.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool
};

export default connect(
    (state, ownProps) => ({
        details: getNamingNameDetails(state, ownProps.name)
    })
)(NodeName);
