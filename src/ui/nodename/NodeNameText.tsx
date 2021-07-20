import React from 'react';
import PropType from 'prop-types';

import { NodeName as NodeNameParser } from "api";
import { NameDisplayMode } from "ui/types";
import { mentionName } from "util/misc";

interface Props {
    name?: string | null;
    fullName?: string | null;
    mode?: NameDisplayMode | null;
}

export default function NodeNameText({name = null, fullName, mode}: Props) {
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
