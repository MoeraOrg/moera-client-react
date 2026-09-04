import { Icon, MaterialSymbol, msTelegram } from "ui/material-symbols";
import { NodeSourceUri } from "util/node-source-uri";
import "./NodeSourceIcon.css";

interface Props {
    sourceUri: string | null | undefined;
}

export default function NodeSourceIcon({sourceUri}: Props) {
    if (!sourceUri) {
        return null;
    }

    const uri = NodeSourceUri.parse(sourceUri);
    let icon: MaterialSymbol | null = null;
    if (uri.uri.startsWith("https://t.me/")) {
        icon = msTelegram;
    }

    if (icon == null) {
        return null;
    }

    return <span className="node-source-icon"><Icon icon={icon} size="1.1em"/></span>;
}
