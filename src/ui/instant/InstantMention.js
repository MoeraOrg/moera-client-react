import React from 'react';
import PropType from 'prop-types';

import NodeNameText from "ui/nodename/NodeNameText";

const InstantMention = ({name, fullName, mode}) => (
    <span className="node-name">
        <NodeNameText name={name || fullName} fullName={fullName} mode={mode}/>
    </span>
);

InstantMention.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    mode: PropType.string
};

export default InstantMention;
