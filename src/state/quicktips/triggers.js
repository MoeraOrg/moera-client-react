import { trigger } from "state/trigger";
import { SETTINGS_CLIENT_VALUES_LOADED } from "state/settings/actions";
import { isQuickTipsToBeShown } from "state/quicktips/selectors";
import { openQuickTips } from "state/quicktips/actions";

export default [
    trigger(SETTINGS_CLIENT_VALUES_LOADED, isQuickTipsToBeShown, openQuickTips)
];
