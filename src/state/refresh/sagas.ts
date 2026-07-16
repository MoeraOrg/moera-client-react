import i18n from 'i18next';

import {
    RefreshCheckBuildAction,
    refreshConfirmingReload,
    refreshHide,
    refreshReloadCancelled,
    RefreshShowAction
} from "state/refresh/actions";
import { BUILD_NUMBER } from "build-number";
import { confirmBox } from "state/confirmbox/actions";
import { saga } from "state/saga";
import { dispatch } from "state/store-sagas";
import { delay } from "util/misc";

export default [
    saga("REFRESH_SHOW", "", refreshShowSaga),
    saga("REFRESH_CHECK_BUILD", "", refreshCheckBuildSaga),
];

async function refreshShowSaga(action: RefreshShowAction): Promise<void> {
    await delay(2000);
    dispatch(refreshHide().causedBy(action));
}

async function refreshCheckBuildSaga(action: RefreshCheckBuildAction): Promise<void> {
    const signal = AbortSignal.timeout(10000);
    try {
        const response = await fetch("/BUILD.txt", {signal, cache: "no-store"});
        if (!response.ok) {
            return;
        }
        const buildNumber = (await response.text()).trim();
        if (!buildNumber.match(/^[0-9a-f+]+$/)) {
            return;
        }
        if (buildNumber !== BUILD_NUMBER) {
            dispatch(refreshConfirmingReload().causedBy(action));
            dispatch(confirmBox({
                message: i18n.t("moera-update-released"),
                yes: i18n.t("reload"),
                no: i18n.t("remind-later"),
                onYes: () => window.location.reload(),
                onNo: refreshReloadCancelled().causedBy(action),
                variant: "primary"
            }).causedBy(action));
        }
    } catch (e) {
        // ignore
    }
}
