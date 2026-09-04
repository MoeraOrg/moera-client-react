import { StorySummaryEntry, StorySummaryNode, StorySummaryReaction } from "api";
import { htmlEntities } from "util/html";
import { formatFullName } from "util/names";

function spanNodeName(nodeName: string, sourceUri: string | null | undefined, text: string): string {
    const source = sourceUri != null ? ` data-source-uri="${htmlEntities(sourceUri)}"` : "";
    return `<span class="node-name" data-nodename="${htmlEntities(nodeName)}"${source}>${text}</span>`;
}

export function formatNodeName(
    node: StorySummaryNode | StorySummaryEntry | StorySummaryReaction | null | undefined
): string {
    const {ownerName, ownerFullName, ownerSourceUri} = node ?? {};
    if (ownerName == null) {
        return "&lt;unknown&gt;";
    }
    return spanNodeName(ownerName, ownerSourceUri, formatFullName(ownerName, ownerFullName));
}

export function formatHeading(entry: StorySummaryEntry | null | undefined): string {
    return "\"" + (htmlEntities(entry?.heading) ?? "") + "\"";
}
