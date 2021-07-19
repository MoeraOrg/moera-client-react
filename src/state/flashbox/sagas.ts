import { delay, put } from 'typed-redux-saga/macro';

import { FLASH_BOX, flashBoxClose, flashBoxDismiss } from "state/flashbox/actions";
import { executor } from "state/executor";

export default [
    executor(FLASH_BOX, null, flashBoxSaga)
];

function* flashBoxSaga() {
    yield* delay(1000);
    yield* put(flashBoxDismiss());
    yield* delay(1000);
    yield* put(flashBoxClose());
}
