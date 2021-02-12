import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Browser } from "ui/browser";
import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import NodeCard from "ui/nodename/NodeCard";
import { nodeCardPrepare } from "state/nodecards/actions";

class NodeNamePopup extends React.PureComponent {

    static propTypes = {
        nodeName: PropType.string,
        fullName: PropType.string,
        disabled: PropType.bool
    };

    onPreparePopper = () => {
        const {nodeName, nodeCardPrepare} = this.props;

        nodeCardPrepare(nodeName);
    }

    render() {
        const {nodeName, fullName, disabled, children} = this.props;

        return (
            <Manager onPreparePopper={this.onPreparePopper} disabled={disabled || Browser.isTouchScreen()}
                     clickable={true}>
                <Reference>
                    {(ref, mainEnter, mainLeave, mainTouch) => children(ref, mainEnter, mainLeave, mainTouch)}
                </Reference>
                <DelayedPopper placement="top" className="node-name-popover">
                    <NodeCard nodeName={nodeName} fullName={fullName}/>
                </DelayedPopper>
            </Manager>
        );
    }

}

export default connect(
    null,
    { nodeCardPrepare }
)(NodeNamePopup);
