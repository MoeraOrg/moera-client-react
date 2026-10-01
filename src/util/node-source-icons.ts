import { MaterialSymbol, msTelegram } from "ui/material-symbols";
import { NodeSourceUri } from "util/node-source-uri";

export function getNodeSourceIcon(sourceUri: null | undefined): null;
export function getNodeSourceIcon(sourceUri: string | null | undefined): MaterialSymbol | null;
export function getNodeSourceIcon(sourceUri: string | null | undefined): MaterialSymbol | null {
    if (!sourceUri) {
        return null;
    }

    const uri = NodeSourceUri.parse(sourceUri);
    switch (uri.getService()) {
        case "telegram":
            return msTelegram;
        default:
            return null;
    }
}
