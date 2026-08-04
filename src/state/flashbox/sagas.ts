import { FlashBoxAction, flashBoxClose, flashBoxDismiss } from "state/flashbox/actions";
import { saga } from "state/saga";
import { dispatch } from "state/store-sagas";
import { delay } from "util/misc";

const READING_TIME_PER_CHARACTER = 50;

export default [
    saga("FLASH_BOX", null, flashBoxSaga)
];

async function flashBoxSaga(action: FlashBoxAction): Promise<void> {
    const {message, short} = action.payload;

    const minDelay = !short ? 2000 : 1000;
    await delay(Math.max(minDelay, message.length * READING_TIME_PER_CHARACTER));
    dispatch(flashBoxDismiss().causedBy(action));
    await delay(1000);
    dispatch(flashBoxClose().causedBy(action));
}
