import { Icon, MaterialSymbol } from "ui/material-symbols";
import { getNodeSourceIcon } from "util/node-source-icons";
import "./NodeSourceIcon.css";

interface Props {
    sourceUri: string | null | undefined;
}

export default function NodeSourceIcon({sourceUri}: Props) {
    const icon: MaterialSymbol | null = getNodeSourceIcon(sourceUri);

    if (icon == null) {
        return null;
    }

    return <span className="node-source-icon"><Icon icon={icon} size="1.1em"/></span>;
}
