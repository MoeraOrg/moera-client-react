import { goToPeople } from "state/navigation/actions";
import { peopleGoToTab } from "state/people/actions";
import { atOwner } from "util/misc";

export function transform(srcInfo, dstInfo) {
    let actions = [];
    if (srcInfo.directories[0] !== "people") {
        actions.push(goToPeople());
    }
    const srcTab = srcInfo.directories.length > 1
        && (srcInfo.directories[1] === "subscriptions" || srcInfo.directories[1] === "subscribers")
        ? srcInfo.directories[1] : "";
    const dstTab = dstInfo.directories.length > 1 && dstInfo.directories[1] === "subscriptions"
        ? "subscriptions" : "subscribers";
    if (srcTab !== dstTab) {
        actions.push(peopleGoToTab(dstTab));
    }
    return actions;
}

export function build(state, info) {
    info = info.sub("people");
    if (state.people.tab === "subscribers") {
        info = info.sub("subscribers").withTitle("Subscribers" + atOwner(state));
    } else if (state.people.tab === "subscriptions") {
        info = info.sub("subscriptions").withTitle("Subscriptions" + atOwner(state));;
    }
    return info;
}
