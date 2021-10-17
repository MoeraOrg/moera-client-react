import { trigger } from "state/trigger";
import {
    CLOSE_LIGHT_BOX,
    closeLightBox,
    LIGHT_BOX_MEDIA_SET,
    OPEN_LIGHT_BOX,
    OpenLightBoxAction
} from "state/lightbox/actions";
import { postingLoad } from "state/postings/actions";
import { dialogClosed, dialogOpened, updateLocation } from "state/navigation/actions";
import { isLightBoxToBeLoaded } from "state/lightbox/selectors";

export default [
    trigger(
        OPEN_LIGHT_BOX,
        isLightBoxToBeLoaded,
        (signal: OpenLightBoxAction) => postingLoad(signal.payload.postingId)
    ),
    trigger(OPEN_LIGHT_BOX, true, dialogOpened(closeLightBox())),
    trigger(CLOSE_LIGHT_BOX, true, dialogClosed()),
    trigger([OPEN_LIGHT_BOX, CLOSE_LIGHT_BOX, LIGHT_BOX_MEDIA_SET], true, updateLocation)
];
