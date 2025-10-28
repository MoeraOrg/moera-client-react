import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { AvatarImage } from "api";
import { getNamingNameDetails } from "state/naming/selectors";
import { getSetting } from "state/settings/selectors";
import { ClientState } from "state/state";
import Jump, { JumpCallback } from "ui/navigation/Jump";
import NodeNameText from "ui/nodename/NodeNameText";
import NodeNamePopup from "ui/nodename/NodeNamePopup";
import { NameDisplayMode } from "ui/types";
import { RelNodeName } from "util/rel-node-name";
import "./NodeName.css";

interface Props {
    name?: string | null;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: RelNodeName | string;
    className?: string;
    verified?: boolean;
    correct?: boolean;
    linked?: boolean;
    popup?: boolean;
    display?: NameDisplayMode;
    onJump?: JumpCallback;
}

export default function NodeName({
    name, fullName, avatar, avatarNodeName, className, verified = false, correct = false, linked = true, popup = true,
    display, onJump
}: Props) {
    const details = useSelector((state: ClientState) => getNamingNameDetails(state, name));
    const mode = useSelector((state: ClientState) => getSetting(state, "full-name.display") as NameDisplayMode);

    if (!name) {
        return null;
    }

    const klass = cx(
        "node-name", {
            "correct": verified && correct,
            "incorrect": verified && !correct,
            linked,
        },
        className
    );
    linked = linked && (!details.loaded || details.nodeUri != null);
    return (
        <NodeNamePopup nodeName={name} fullName={fullName} avatar={avatar} avatarNodeName={avatarNodeName}
                       disabled={!popup}>
            {ref =>
                linked ?
                    <Jump className={klass} nodeName={name} href="/" onNear={onJump} onFar={onJump} ref={ref}>
                        <NodeNameText name={name} fullName={fullName} mode={display ?? mode}/>
                    </Jump>
                :
                    <span className={klass} ref={ref}>
                        <NodeNameText name={name} fullName={fullName} mode={display ?? mode}/>
                    </span>
            }
        </NodeNamePopup>

    );
}
