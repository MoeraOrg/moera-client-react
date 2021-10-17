import { trigger } from "state/trigger";
import { OPEN_LIGHT_BOX, OpenLightBoxAction } from "state/lightbox/actions";
import { postingLoad } from "state/postings/actions";
import { isLightBoxToBeLoaded } from "state/lightbox/selectors";

export default [
    trigger(
        OPEN_LIGHT_BOX,
        isLightBoxToBeLoaded,
        (signal: OpenLightBoxAction) => postingLoad(signal.payload.postingId)
    )
];
