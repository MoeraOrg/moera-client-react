import React from 'react';
import PropType from 'prop-types';

import { NodeName as NodeNameParser } from "api";

const NodeNameText = ({name, fullName}) => {
    if (fullName != null) {
        return fullName;
    } else {
        const parts = NodeNameParser.parse(name);
        return (
            <>
                {parts.name}
                {parts.generation ? <span className="generation">{parts.generation}</span> : ""}
            </>
        );
    }
}

NodeNameText.propTypes = {
    name: PropType.string,
    fullName: PropType.string
};

export default NodeNameText;
