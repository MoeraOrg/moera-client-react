import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { AvatarImage } from "api/node/api-types";
import { getNamingNameDetails } from "state/naming/selectors";
import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import Jump from "ui/navigation/Jump";
import NodeNameText from "ui/nodename/NodeNameText";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { NameDisplayMode } from "ui/types";
import "./NodeName.css";

interface OwnProps {
    name?: string | null;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: string;
    verified?: boolean;
    correct?: boolean;
    linked?: boolean;
    popup?: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function NodeName({name, fullName, avatar, avatarNodeName, verified = false, correct = false, linked = true,
                   popup = true, details, mode}: Props) {
    if (!name) {
        return null;
    }

    const klass = cx(
        "node-name", {
            "correct": verified && correct,
            "incorrect": verified && !correct
        }
    );
    linked = linked && (!details.loaded || details.nodeUri != null);
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

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        details: getNamingNameDetails(state, ownProps.name),
        mode: getSetting(state, "full-name.display") as NameDisplayMode
    })
);

export default connector(NodeName);
