import { trigger } from "state/trigger";
import { NODE_CARD_PREPARE, nodeCardLoad } from "state/nodecards/actions";
import { isNodeCardToBeLoaded } from "state/nodecards/selectors";

export default [
    trigger(
        NODE_CARD_PREPARE,
        (state, signal) => isNodeCardToBeLoaded(state, signal.payload.nodeName),
        signal => nodeCardLoad(signal.payload.nodeName)
    )
];
