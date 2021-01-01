import selectn from 'selectn';

import { trigger } from "state/trigger";
import { FEED_STATUS_SET } from "state/feeds/actions";
import { isWebPushInvitationToBeShown } from "state/webpush/selectors";
import { webPushInvite } from "state/webpush/actions";

export default [
    trigger(
        FEED_STATUS_SET,
        (state, signal) => selectn("payload.status.notViewed", signal) > 0 && isWebPushInvitationToBeShown(state),
        webPushInvite
    )
];
