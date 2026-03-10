import { refreshHide, RefreshShowAction } from "state/refresh/actions";
import { saga } from "state/saga";
import { dispatch } from "state/store-sagas";
import { delay } from "util/misc";

export default [
    saga("REFRESH_SHOW", "", refreshShowSaga)
];

async function refreshShowSaga(action: RefreshShowAction): Promise<void> {
    await delay(2000);
    dispatch(refreshHide().causedBy(action));
}
