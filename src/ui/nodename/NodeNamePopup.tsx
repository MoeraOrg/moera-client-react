import React from 'react';
import ReactDOM from 'react-dom';
import { connect, ConnectedProps } from 'react-redux';

import { DelayedPopper, DelayedPopperChildren, Manager, Reference } from "ui/control/DelayedPopper";
import NodeCard from "ui/nodename/NodeCard";
import { nodeCardPrepare } from "state/nodecards/actions";
import { AvatarImage } from "api/node/api-types";

type Props = {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: string;
    disabled?: boolean;
    children: DelayedPopperChildren;
} & ConnectedProps<typeof connector>;

function NodeNamePopup({nodeName, fullName, avatar, avatarNodeName, disabled, children, nodeCardPrepare}: Props) {
    const onPreparePopper = () => {
        nodeCardPrepare(nodeName);
    }

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

const connector = connect(
    null,
    { nodeCardPrepare }
);

export default connector(NodeNamePopup);
