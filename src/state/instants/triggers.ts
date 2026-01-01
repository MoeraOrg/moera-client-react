import { trigger } from "state/trigger";
import { isConnectedToHome } from "state/home/selectors";
import { isAtInstantsPage } from "state/navigation/selectors";
import { FeedStatusSetAction } from "state/feeds/actions";
import { instantsComponentLoaded, instantsMarkViewed } from "state/instants/actions";

export default [
    trigger("OPEN_INSTANTS_POPOVER", true, instantsMarkViewed),
    trigger("GO_TO_PAGE", isAtInstantsPage, instantsMarkViewed),
    trigger(["POST_INIT", "POST_INIT_DELAYED"], isConnectedToHome, instantsComponentLoaded),
    trigger(
        "FEED_STATUS_SET",
        (_, signal: FeedStatusSetAction) =>
            signal.payload.feedName === "instant" && (signal.payload.status.notViewed ?? 0) > 0,
        instantsComponentLoaded
    ),
];
