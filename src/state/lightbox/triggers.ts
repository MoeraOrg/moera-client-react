import { conj, trigger } from "state/trigger";
import { closeLightBox, lightBoxMediaPostingLoad, OpenLightBoxAction } from "state/lightbox/actions";
import { postingLoad } from "state/postings/actions";
import {
    bodyScrollUpdate,
    dialogClosed,
    dialogOpened,
    swipeRefreshUpdate,
    updateLocation
} from "state/navigation/actions";
import { isLightBoxMediaPostingToBeLoaded, isLightBoxShown, isLightBoxToBeLoaded } from "state/lightbox/selectors";
import { Browser } from "ui/browser";

export default [
    trigger(
        "OPEN_LIGHT_BOX",
        conj(isLightBoxShown, isLightBoxToBeLoaded),
        (signal: OpenLightBoxAction) => postingLoad(signal.payload.postingId, "")
    ),
    trigger("OPEN_LIGHT_BOX", true, dialogOpened(closeLightBox())),
    trigger("CLOSE_LIGHT_BOX", true, dialogClosed),
    trigger(["OPEN_LIGHT_BOX", "CLOSE_LIGHT_BOX", "LIGHT_BOX_MEDIA_SET"], true, updateLocation),
    trigger(
        ["OPEN_LIGHT_BOX", "LIGHT_BOX_MEDIA_SET", "POSTING_SET", "COMMENT_SET", "COMMENTS_PAST_SLICE_SET",
         "COMMENTS_FUTURE_SLICE_SET", "FOCUSED_COMMENT_LOADED"],
        conj(isLightBoxShown, isLightBoxMediaPostingToBeLoaded),
        lightBoxMediaPostingLoad
    ),
    trigger(["OPEN_LIGHT_BOX", "CLOSE_LIGHT_BOX"], Browser.isAndroidApp(), swipeRefreshUpdate),
    trigger(["OPEN_LIGHT_BOX", "CLOSE_LIGHT_BOX"], true, bodyScrollUpdate)
];
