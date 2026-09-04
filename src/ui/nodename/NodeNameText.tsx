import React from 'react';

import { NodeName } from "api";
import { NameDisplayMode } from "ui/types";
import NodeSourceIcon from "ui/nodename/NodeSourceIcon";

interface Props {
    nodeName?: string | null;
    fullName?: string | null;
    sourceUri?: string | null;
    mode?: NameDisplayMode;
}

export default function NodeNameText({nodeName, fullName, sourceUri, mode = "full-name"}: Props) {
    const name = NodeName.shorten(nodeName) || "?";
    let nameElement;
    switch (mode) {
        case "name":
            nameElement = <>{name}</>;
            break;
        case "full-name":
            nameElement = <>{fullName || name}</>;
            break;
        case "both":
            nameElement = <>{(fullName || name) + " "}<span className="mention">@{name}</span></>;
            break;
        default:
            nameElement = <>?</>;
            break;
    }

    return <><NodeSourceIcon sourceUri={sourceUri}/>{nameElement}</>;
}
