import React from 'react';
import PropType from 'prop-types';

import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import NodeNameCard from "ui/nodename/NodeNameCard";

class NodeNamePopup extends React.PureComponent {

    static propTypes = {
        nodeName: PropType.string,
        fullName: PropType.string,
        disabled: PropType.bool
    };

    onPreparePopper = () => {
        const {disabled} = this.props;

        if (disabled) {
            return;
        }
    }

    render() {
        const {nodeName, fullName, disabled, children} = this.props;

        return (
            <Manager onPreparePopper={this.onPreparePopper} disabled={disabled}>
                <Reference>
                    {(ref, mainEnter, mainLeave, mainTouch) => children(ref, mainEnter, mainLeave, mainTouch)}
                </Reference>
                <DelayedPopper placement="top" className="node-name-popover">
                    <NodeNameCard nodeName={nodeName} fullName={fullName}/>
                </DelayedPopper>
            </Manager>
        );
    }

}

export default NodeNamePopup;
