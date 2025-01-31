import { FlashBoxAction, flashBoxClose, flashBoxDismiss } from "state/flashbox/actions";
import { executor } from "state/executor";
import { dispatch } from "state/store-sagas";
import { delay } from "util/misc";

export default [
    executor("FLASH_BOX", null, flashBoxSaga)
];

async function flashBoxSaga(action: FlashBoxAction): Promise<void> {
    const {short} = action.payload;

    await delay(!short ? 1500 : 1000);
    dispatch(flashBoxDismiss().causedBy(action));
    await delay(1000);
    dispatch(flashBoxClose().causedBy(action));
}
