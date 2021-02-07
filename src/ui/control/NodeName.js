import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import { NodeName as NodeNameParser } from "api";
import { getNamingNameDetails } from "state/naming/selectors";
import Jump from "ui/navigation/Jump";
import "./NodeName.css";

const NodeNameText = ({name, fullName}) => {
    if (fullName != null) {
        return fullName;
    } else {
        const parts = NodeNameParser.parse(name);
        return (
            <>
                {parts.name}
                {parts.generation ? <span className="generation">{parts.generation}</span> : ""}
            </>
        );
    }
}

const NodeNameImpl = ({name, fullName, verified = false, correct = false, linked = true, details}) => {
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

export const NodeName = connect(
    (state, ownProps) => ({
        details: getNamingNameDetails(state, ownProps.name)
    })
)(NodeNameImpl);

NodeName.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool
};
