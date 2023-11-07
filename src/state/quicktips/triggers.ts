import { trigger } from "state/trigger";
import { dialogClosed, dialogOpened } from "state/navigation/actions";
import { closeQuickTips, openQuickTips } from "state/quicktips/actions";
import { isQuickTipsToBeShown } from "state/quicktips/selectors";

export default [
    trigger(["SETTINGS_CLIENT_VALUES_LOADED", "MNEMONIC_CLOSE"], isQuickTipsToBeShown, openQuickTips),
    trigger("OPEN_QUICK_TIPS", true, dialogOpened(closeQuickTips())),
    trigger("CLOSE_QUICK_TIPS", true, dialogClosed)
];
