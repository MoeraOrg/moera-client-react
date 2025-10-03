import { useDrag } from "@use-gesture/react";
import { useDispatch } from "react-redux";
import { boot } from "state/navigation/actions";
import { useIsTinyScreen } from "ui/hook/media-query";

const EDGE_HOTZONE = 50;
const GESTURE_TIMEOUT = 1000;
const GESTURE_DISTANCE = 50;

export function useReload() {
    const dispatch = useDispatch();
    const tinyScreen = useIsTinyScreen();

    useDrag(
        ({first, last, movement: [, my], initial: [, iy], cancel, tap, elapsedTime}) => {
            if (!tinyScreen) {
                cancel();
                return;
            }
            if (tap) {
                return;
            }
            if (first && iy > EDGE_HOTZONE) {
                cancel();
                return;
            }
            if (elapsedTime > GESTURE_TIMEOUT) {
                cancel();
                return;
            }
            if (last && my >= GESTURE_DISTANCE) {
                dispatch(boot());
            }
        },
        {
            axis: "y",
            eventOptions: {
                capture: true
            },
            filterTaps: true,
            pointer: {
                touch: true
            },
            target: document.body
        }
    );
}
