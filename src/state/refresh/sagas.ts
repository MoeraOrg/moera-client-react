import { refreshHide, RefreshShowAction } from "state/refresh/actions";
import { executor } from "state/executor";
import { dispatch } from "state/store-sagas";
import { delay } from "util/misc";

export default [
    executor("REFRESH_SHOW", "", refreshShowSaga)
];

async function refreshShowSaga(action: RefreshShowAction): Promise<void> {
    await delay(2000);
    dispatch(refreshHide().causedBy(action));
}
