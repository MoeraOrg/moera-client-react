import { trigger } from "state/trigger";
import { openQuickTips } from "state/quicktips/actions";
import { isQuickTipsToBeShown } from "state/quicktips/selectors";

export default [
    trigger(["SETTINGS_CLIENT_VALUES_LOADED", "MNEMONIC_CLOSE"], isQuickTipsToBeShown, openQuickTips)
];
