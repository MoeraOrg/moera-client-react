import { conj, trigger } from "state/trigger";
import { lightboxMediaPostingLoad, OpenLightboxAction } from "state/lightbox/actions";
import { postingLoad } from "state/postings/actions";
import { updateLocation } from "state/navigation/actions";
import { isLightboxMediaPostingToBeLoaded, isLightboxShown, isLightboxToBeLoaded } from "state/lightbox/selectors";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    trigger(
        "OPEN_LIGHTBOX",
        conj(isLightboxShown, isLightboxToBeLoaded),
        (signal: OpenLightboxAction) => postingLoad(signal.payload.postingId, REL_CURRENT)
    ),
    trigger(["OPEN_LIGHTBOX", "CLOSE_LIGHTBOX", "LIGHTBOX_MEDIA_SET"], true, updateLocation),
    trigger(
        ["OPEN_LIGHTBOX", "LIGHTBOX_MEDIA_SET", "POSTING_SET", "COMMENT_SET", "COMMENTS_PAST_SLICE_SET",
         "COMMENTS_FUTURE_SLICE_SET", "FOCUSED_COMMENT_LOADED"],
        conj(isLightboxShown, isLightboxMediaPostingToBeLoaded),
        lightboxMediaPostingLoad
    )
];
