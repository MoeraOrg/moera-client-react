import React from 'react';

import { NodeName as NodeNameParser } from "api";
import { NameDisplayMode } from "ui/types";
import { mentionName } from "util/names";

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
