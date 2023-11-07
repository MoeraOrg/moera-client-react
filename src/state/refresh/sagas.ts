import { delay, put } from 'typed-redux-saga';

import { refreshHide } from "state/refresh/actions";
import { executor } from "state/executor";

export default [
    executor("REFRESH_SHOW", "", refreshShowSaga)
];

function* refreshShowSaga() {
    yield* delay(2000);
    yield* put(refreshHide());
}
