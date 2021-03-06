import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import cx from 'classnames';

import { getNamingNameDetails } from "state/naming/selectors";
import { getSetting } from "state/settings/selectors";
import Jump from "ui/navigation/Jump";
import NodeNameText from "ui/nodename/NodeNameText";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import "./NodeName.css";

function NodeName({name, fullName, avatar, avatarNodeName, verified, correct, linked, popup, details, mode}) {
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
    return (
        <NodeNamePopup nodeName={name} fullName={fullName} avatar={avatar} avatarNodeName={avatarNodeName}
                       disabled={!popup}>
            {(ref, mainEnter, mainLeave, mainTouch) =>
                linked ? (
                    <Jump className={klass} nodeName={name} href="/" anchorRef={ref} onMouseEnter={mainEnter}
                          onMouseLeave={mainLeave} onTouchStart={mainTouch}>
                        <NodeNameText name={name} fullName={fullName} mode={mode}/>
                    </Jump>
                ) : (
                    <span className={klass} ref={ref} onMouseEnter={mainEnter} onMouseLeave={mainLeave}
                          onTouchStart={mainTouch}>
                        <NodeNameText name={name} fullName={fullName} mode={mode}/>
                    </span>
                )
            }
        </NodeNamePopup>

    );
}

NodeName.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    avatar: PropType.shape({
        path: PropType.string,
        shape: PropType.string
    }),
    avatarNodeName: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool,
    linked: PropType.bool,
    popup: PropType.bool
};

NodeName.defaultProps = {
    verified: false,
    correct: false,
    linked: true,
    popup: true
}

export default connect(
    (state, ownProps) => ({
        details: getNamingNameDetails(state, ownProps.name),
        mode: getSetting(state, "full-name.display")
    })
)(NodeName);
