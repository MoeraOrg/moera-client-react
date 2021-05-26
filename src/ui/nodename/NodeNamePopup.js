import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import NodeCard from "ui/nodename/NodeCard";
import { nodeCardPrepare } from "state/nodecards/actions";

function NodeNamePopup({nodeName, fullName, avatar, avatarNodeName, disabled, children, nodeCardPrepare}) {
    const onPreparePopper = () => {
        nodeCardPrepare(nodeName);
    }

    return (
        <Manager onPreparePopper={onPreparePopper} disabled={disabled} clickable={true}>
            <Reference>
                {(ref, mainEnter, mainLeave, mainTouch) => children(ref, mainEnter, mainLeave, mainTouch)}
            </Reference>
            <DelayedPopper placement="top" className="node-name-popover">
                <NodeCard nodeName={nodeName} fullName={fullName} avatar={avatar} avatarNodeName={avatarNodeName}/>
            </DelayedPopper>
        </Manager>
    );
}

NodeNamePopup.propTypes = {
    nodeName: PropType.string,
    fullName: PropType.string,
    avatar: PropType.shape({
        path: PropType.string,
        shape: PropType.string
    }),
    avatarNodeName: PropType.string,
    disabled: PropType.bool
};

export default connect(
    null,
    { nodeCardPrepare }
)(NodeNamePopup);
