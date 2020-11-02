import { inv, trigger } from "state/trigger";
import { goHome } from "state/navigation/actions";
import { MNEMONIC_CLOSE } from "state/nodename/actions";
import { isAtNode } from "state/node/selectors";

export default [
    trigger(MNEMONIC_CLOSE, inv(isAtNode), goHome)
];
