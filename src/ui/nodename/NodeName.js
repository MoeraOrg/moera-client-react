import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import { getNamingNameDetails } from "state/naming/selectors";
import Jump from "ui/navigation/Jump";
import NodeNameText from "ui/nodename/NodeNameText";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import "./NodeName.css";

const NodeName = ({name, fullName, verified = false, correct = false, linked = true, popup = true, details}) => {
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
            <NodeNamePopup nodeName={name} fullName={fullName} disabled={!popup}>
                {(ref, mainEnter, mainLeave, mainTouch) =>
                    <span ref={ref} onMouseEnter={mainEnter} onMouseLeave={mainLeave} onTouchStart={mainTouch}>
                        <Jump className={klass} nodeName={name} href="/">
                            <NodeNameText name={name} fullName={fullName}/>
                        </Jump>
                    </span>
                }
            </NodeNamePopup>
        )
    :
        (
            <NodeNamePopup nodeName={name} fullName={fullName} disabled={!popup}>
                {(ref, mainEnter, mainLeave, mainTouch) =>
                    <span className={klass} ref={ref} onMouseEnter={mainEnter} onMouseLeave={mainLeave}
                          onTouchStart={mainTouch}>
                        <NodeNameText name={name} fullName={fullName}/>
                    </span>
                }
            </NodeNamePopup>
        );
};

NodeName.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool,
    linked: PropType.bool,
    popup: PropType.bool
};

export default connect(
    (state, ownProps) => ({
        details: getNamingNameDetails(state, ownProps.name)
    })
)(NodeName);
