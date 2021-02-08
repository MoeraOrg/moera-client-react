import React from 'react';
import PropType from 'prop-types';

import { mentionName } from "util/misc";
import "./NodeNameCard.css";

const NodeNameCard = ({nodeName, fullName}) => (
    <div className="node-name-card">
        {fullName && <div className="full-name">{fullName}</div>}
        <div className="name">{mentionName(nodeName)}</div>
    </div>
);

NodeNameCard.propTypes = {
    nodeName: PropType.string,
    fullName: PropType.string
};

export default NodeNameCard;
