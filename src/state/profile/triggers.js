import { conj, inv, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import {
    PROFILE_EDIT,
    PROFILE_EDIT_CANCEL,
    PROFILE_UPDATE_SUCCEEDED,
    profileEditConflict,
    profileLoad,
    profileUnset
} from "state/profile/actions";
import { isProfileEditing, isProfileToBeLoaded } from "state/profile/selectors";
import { GO_TO_PAGE, INIT_FROM_LOCATION, newLocation } from "state/navigation/actions";
import { isAtProfilePage } from "state/navigation/selectors";
import { EVENT_NODE_PROFILE_UPDATED } from "api/events/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtProfilePage, isProfileToBeLoaded), profileLoad),
    trigger(INIT_FROM_LOCATION, inv(isAtProfilePage), profileUnset),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], isAtProfilePage, profileLoad),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME], inv(isAtProfilePage), profileUnset),
    trigger([PROFILE_EDIT, PROFILE_EDIT_CANCEL, PROFILE_UPDATE_SUCCEEDED], isAtProfilePage, newLocation),
    trigger(EVENT_NODE_PROFILE_UPDATED, isAtProfilePage, profileLoad),
    trigger(EVENT_NODE_PROFILE_UPDATED, conj(isAtProfilePage, isProfileEditing), profileEditConflict),
    trigger(EVENT_NODE_PROFILE_UPDATED, inv(isAtProfilePage), profileUnset)
];
