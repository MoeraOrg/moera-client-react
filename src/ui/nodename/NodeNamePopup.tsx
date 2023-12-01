import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { AvatarImage } from "api";
import { nodeCardPrepare } from "state/nodecards/actions";
import { DelayedPopper, DelayedPopperChildren, Manager, Reference } from "ui/control/DelayedPopper";
import NodeCard from "ui/nodename/NodeCard";

interface Props {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: string;
    disabled?: boolean;
    children: DelayedPopperChildren;
}

export default function NodeNamePopup({nodeName, fullName, avatar, avatarNodeName, disabled, children}: Props) {
    const dispatch = useDispatch();

    const onPreparePopper = () => dispatch(nodeCardPrepare(nodeName));

    return (
        <Manager onPreparePopper={onPreparePopper} disabled={disabled} clickable>
            <Reference>
                {(ref, mainEnter, mainLeave, mainTouch) => children(ref, mainEnter, mainLeave, mainTouch)}
            </Reference>
            {ReactDOM.createPortal(
                <DelayedPopper placement="top" className="node-name-popover">
                    {(hide) =>
                        <NodeCard nodeName={nodeName} fullName={fullName} avatar={avatar}
                                  avatarNodeName={avatarNodeName} hide={hide}/>
                    }
                </DelayedPopper>,
                document.getElementById("hovercard-root")!
            )}
        </Manager>
    );
}
