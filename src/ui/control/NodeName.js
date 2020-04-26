import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import { NodeName as NodeNameParser } from "api";
import { getNamingNameDetails } from "state/naming/selectors";
import Jump from "ui/navigation/Jump";
import "./NodeName.css";

const NameGeneration = ({generation, latest}) => (
    latest || <span className="generation">{generation}</span>
);

NameGeneration.propTypes = {
    generation: PropType.number,
    latest: PropType.bool
};

const NodeNameImpl = ({ name, verified = false, correct = false, linked = true, details }) => {
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
    const parts = NodeNameParser.parse(name);
    return linked ?
        (
            <Jump className={klass} nodeName={name} href="/">
                {parts.name}
                <NameGeneration generation={parts.generation} latest={details.latest} />
            </Jump>
        )
        :
        (
            <span className={klass}>
                {parts.name}
                <NameGeneration generation={parts.generation} latest={details.latest} />
            </span>
        );
};

NodeNameImpl.propTypes = {
    name: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool
};

export const NodeName = connect(
    (state, ownProps) => ({
        details: getNamingNameDetails(state, ownProps.name)
    })
)(NodeNameImpl);
