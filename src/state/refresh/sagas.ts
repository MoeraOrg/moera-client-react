import { delay, put } from 'typed-redux-saga';

import { refreshHide, RefreshShowAction } from "state/refresh/actions";
import { executor } from "state/executor";

export default [
    executor("REFRESH_SHOW", "", refreshShowSaga)
];

function* refreshShowSaga(action: RefreshShowAction) {
    yield* delay(2000);
    yield* put(refreshHide().causedBy(action));
}
