import { delay, put } from 'typed-redux-saga/macro';

import { FLASH_BOX, FlashBoxAction, flashBoxClose, flashBoxDismiss } from "state/flashbox/actions";
import { executor } from "state/executor";

export default [
    executor(FLASH_BOX, null, flashBoxSaga)
];

function* flashBoxSaga(action: FlashBoxAction) {
    if (window.Android && window.Android.toast) {
        window.Android.toast(action.payload.message);
        return;
    }

    yield* delay(1000);
    yield* put(flashBoxDismiss());
    yield* delay(1000);
    yield* put(flashBoxClose());
}
