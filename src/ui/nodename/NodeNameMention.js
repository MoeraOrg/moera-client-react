import React from 'react';
import PropType from 'prop-types';

import NodeNamePopup from "ui/nodename/NodeNamePopup";
import Jump from "ui/navigation/Jump";

const NodeNameMention = ({name, fullName, text}) => {
    if (!name) {
        return null;
    }

    return (
        <NodeNamePopup nodeName={name} fullName={fullName}>
            {(ref, mainEnter, mainLeave, mainTouch) =>
                <Jump nodeName={name} href="/" anchorRef={ref} onMouseEnter={mainEnter} onMouseLeave={mainLeave}
                      onTouchStart={mainTouch}>
                    {text}
                </Jump>
            }
        </NodeNamePopup>
    );
};

NodeNameMention.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    text: PropType.string
};

export default NodeNameMention;
