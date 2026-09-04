import React from 'react';

import { NodeName } from "api";
import { NameDisplayMode } from "ui/types";

interface Props {
    nodeName?: string | null;
    fullName?: string | null;
    mode?: NameDisplayMode;
}

export default function NodeNameText({nodeName, fullName, mode = "full-name"}: Props) {
    const name = NodeName.shorten(nodeName) || "?";
    switch (mode) {
        case "name":
            return <>{name}</>;
        case "full-name":
            return <>{fullName || name}</>;
        case "both":
            return <>{(fullName || name) + " "}<span className="mention">@{name}</span></>;
        default:
            return <>?</>;
    }
}
