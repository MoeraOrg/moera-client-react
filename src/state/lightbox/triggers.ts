import { conj, trigger } from "state/trigger";
import {
    CLOSE_LIGHT_BOX,
    closeLightBox,
    LIGHT_BOX_MEDIA_SET,
    lightBoxMediaPostingLoad,
    OPEN_LIGHT_BOX,
    OpenLightBoxAction
} from "state/lightbox/actions";
import { POSTING_SET, postingLoad } from "state/postings/actions";
import {
    bodyScrollUpdate,
    dialogClosed,
    dialogOpened,
    swipeRefreshUpdate,
    updateLocation
} from "state/navigation/actions";
import { isLightBoxMediaPostingToBeLoaded, isLightBoxShown, isLightBoxToBeLoaded } from "state/lightbox/selectors";
import {
    COMMENT_SET,
    COMMENTS_FUTURE_SLICE_SET,
    COMMENTS_PAST_SLICE_SET,
    FOCUSED_COMMENT_LOADED
} from "state/detailedposting/actions";
import { Browser } from "ui/browser";

export default [
    trigger(
        OPEN_LIGHT_BOX,
        conj(isLightBoxShown, isLightBoxToBeLoaded),
        (signal: OpenLightBoxAction) => postingLoad(signal.payload.postingId)
    ),
    trigger(OPEN_LIGHT_BOX, true, dialogOpened(closeLightBox())),
    trigger(CLOSE_LIGHT_BOX, true, dialogClosed),
    trigger([OPEN_LIGHT_BOX, CLOSE_LIGHT_BOX, LIGHT_BOX_MEDIA_SET], true, updateLocation),
    trigger(
        [OPEN_LIGHT_BOX, LIGHT_BOX_MEDIA_SET, POSTING_SET, COMMENT_SET, COMMENTS_PAST_SLICE_SET,
         COMMENTS_FUTURE_SLICE_SET, FOCUSED_COMMENT_LOADED],
        conj(isLightBoxShown, isLightBoxMediaPostingToBeLoaded),
        lightBoxMediaPostingLoad
    ),
    trigger([OPEN_LIGHT_BOX, CLOSE_LIGHT_BOX], Browser.isAndroidApp(), swipeRefreshUpdate),
    trigger([OPEN_LIGHT_BOX, CLOSE_LIGHT_BOX], true, bodyScrollUpdate)
];
