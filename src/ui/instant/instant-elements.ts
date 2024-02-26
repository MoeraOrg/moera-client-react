import { NodeName, StorySummaryEntry, StorySummaryNode, StorySummaryReaction } from "api";
import { htmlEntities } from "util/html";

function spanNodeName(nodeName: string, text: string): string {
    return `<span class="node-name" data-nodename="${htmlEntities(nodeName)}">${text}</span>`;
}

export function formatNodeName(
    node: StorySummaryNode | StorySummaryEntry | StorySummaryReaction | null | undefined
): string {
    const {ownerName, ownerFullName} = node ?? {};
    if (ownerName == null) {
        return "&lt;unknown&gt;";
    }
    return spanNodeName(ownerName, ownerFullName != null ? ownerFullName : NodeName.shorten(ownerName));
}

export function formatHeading(entry: StorySummaryEntry | null | undefined): string {
    return "\"" + (htmlEntities(entry?.heading) ?? "") + "\"";
}
