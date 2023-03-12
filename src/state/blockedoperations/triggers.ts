import { trigger } from "state/trigger";
import { EVENT_HOME_BLOCKED_USER_ADDED, EVENT_HOME_BLOCKED_USER_DELETED, EventAction } from "api/events/actions";
import { BlockedUserAddedEvent, BlockedUserDeletedEvent } from "api/events/api-types";
import { blockedUsersAdded, blockedUsersDeleted } from "state/blockedoperations/actions";

export default [
    trigger(
        EVENT_HOME_BLOCKED_USER_ADDED,
        true,
        (signal: EventAction<BlockedUserAddedEvent>) => blockedUsersAdded([signal.payload.blockedUser])
    ),
    trigger(
        EVENT_HOME_BLOCKED_USER_DELETED,
        true,
        (signal: EventAction<BlockedUserDeletedEvent>) => blockedUsersDeleted([signal.payload.blockedUser])
    )
];
