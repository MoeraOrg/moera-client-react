import { conj, inv, trigger } from "state/trigger";
import {
    DIALOG_CLOSED,
    DIALOG_OPENED,
    GO_TO_PAGE,
    goHomeNews,
    newLocation,
    swipeRefreshUpdate, updateLocation
} from "state/navigation/actions";
import { CONNECTED_TO_HOME } from "state/home/actions";
import { isAtNode } from "state/node/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { SETTINGS_LANGUAGE_CHANGED } from "state/settings/actions";

export default [
    trigger(GO_TO_PAGE, true, newLocation),
    trigger(CONNECTED_TO_HOME, conj(inv(isAtNode), isStandaloneMode), goHomeNews),
    trigger([DIALOG_OPENED, DIALOG_CLOSED], !!window.Android, swipeRefreshUpdate),
    trigger(SETTINGS_LANGUAGE_CHANGED, true, updateLocation)
];
