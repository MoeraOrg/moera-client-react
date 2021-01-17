import { conj, inv, trigger } from "state/trigger";
import { GO_TO_PAGE, goHomeNews, newLocation } from "state/navigation/actions";
import { CONNECTED_TO_HOME } from "state/home/actions";
import { isAtNode } from "state/node/selectors";
import { isStandaloneMode } from "state/navigation/selectors";

export default [
    trigger(GO_TO_PAGE, true, newLocation),
    trigger(CONNECTED_TO_HOME, conj(inv(isAtNode), isStandaloneMode), goHomeNews)
];
