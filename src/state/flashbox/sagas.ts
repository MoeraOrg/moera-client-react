import { delay, put } from 'typed-redux-saga';

import { FlashBoxAction, flashBoxClose, flashBoxDismiss } from "state/flashbox/actions";
import { executor } from "state/executor";

export default [
    executor("FLASH_BOX", null, flashBoxSaga)
];

function* flashBoxSaga(action: FlashBoxAction) {
    const {short} = action.payload;

    yield* delay(!short ? 1000 : 0);
    yield* put(flashBoxDismiss().causedBy(action));
    yield* delay(1000);
    yield* put(flashBoxClose().causedBy(action));
}
