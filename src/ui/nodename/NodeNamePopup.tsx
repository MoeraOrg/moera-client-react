import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { AvatarImage } from "api";
import { nodeCardPrepare } from "state/nodecards/actions";
import { DelayedPopover, DelayedPopoverElement } from "ui/control";
import NodeCard from "ui/nodename/NodeCard";

interface Props {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: string;
    disabled?: boolean;
    children: DelayedPopoverElement;
}

export default function NodeNamePopup({nodeName, fullName, avatar, avatarNodeName, disabled, children}: Props) {
    const dispatch = useDispatch();

    const onPreparePopper = () => dispatch(nodeCardPrepare(nodeName));

    return (
        <DelayedPopover placement="top" className="node-name-popover" onPreparePopper={onPreparePopper}
                        disabled={disabled} clickable element={children}>
            {ReactDOM.createPortal(
                <NodeCard nodeName={nodeName} fullName={fullName} avatar={avatar} avatarNodeName={avatarNodeName}/>,
                document.getElementById("hovercard-root")!
            )}
        </DelayedPopover>
    );
}
