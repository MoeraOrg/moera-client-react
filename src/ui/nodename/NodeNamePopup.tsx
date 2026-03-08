import React from 'react';

import { ANONYMOUS_NODE_NAME, AvatarImage } from "api";
import { nodeCardPrepare } from "state/nodecards/actions";
import { useDispatcher } from "ui/hook";
import { DelayedPopover, DelayedPopoverElement } from "ui/control";
import NodeCard from "ui/nodename/NodeCard";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: RelNodeName | string;
    disabled?: boolean;
    children: DelayedPopoverElement;
}

export default function NodeNamePopup({nodeName, fullName, avatar, avatarNodeName, disabled, children}: Props) {
    const anonymous = nodeName === ANONYMOUS_NODE_NAME;
    const dispatch = useDispatcher();

    const onPreparePopper = () => dispatch(nodeCardPrepare(nodeName));

    return (
        <DelayedPopover placement="top" className="node-name-popover" onPreparePopper={onPreparePopper}
                        disabled={disabled || anonymous} clickable element={children}
                        popoverContainer={document.getElementById("hovercard-root")}>
            <NodeCard nodeName={nodeName} fullName={fullName} avatar={avatar} avatarNodeName={avatarNodeName}/>
        </DelayedPopover>
    );
}
