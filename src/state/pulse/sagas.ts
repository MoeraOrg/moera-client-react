import { postInit, postInitDelayed, pulse10Min, pulse1Min, pulse6H } from "state/pulse/actions";
import { barrier, dispatch } from "state/store-sagas";
import { delay } from "util/misc";

export async function signalPostInitSaga(): Promise<void> {
    while (true) {
        await barrier("BOOT", true);
        await delay(1000);
        while (true) {
            if (!await barrier("*", true, 1000)) {
                dispatch(postInit());
                await delay(5000);
                dispatch(postInitDelayed());
                break;
            }
        }
    }
}

export async function pulseSaga(): Promise<void> {
    let count = 0;
    while (true) {
        await delay(60000);
        count = (count + 1) % 360;

        dispatch(pulse1Min());
        if (count % 10 === 0) {
            dispatch(pulse10Min());
        }
        if (count % 360 === 0) {
            dispatch(pulse6H());
        }
    }
}
