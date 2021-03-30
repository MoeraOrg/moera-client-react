import React from 'react';
import PropType from 'prop-types';

import { NodeName as NodeNameParser } from "api";
import { mentionName } from "util/misc";

const NodeNameText = ({name, fullName, mode}) => {
    let namePart = null;
    let generationPart = null;
    if (mode !== "name") {
        namePart = fullName;
    }
    const parts = NodeNameParser.parse(name);
    if (!namePart) {
        namePart = parts.name;
        generationPart = parts.generation;
    }
    return (
        <>
            {namePart}
            {generationPart ? <span className="generation">{generationPart}</span> : ""}
            {mode === "both" &&
                <>
                    {" "}
                    <span className="mention">{mentionName(name)}</span>
                </>
            }
        </>
    );
}

NodeNameText.propTypes = {
    name: PropType.string,
    fullName: PropType.string,
    mode: PropType.string
};

export default NodeNameText;
