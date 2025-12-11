import { useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useDrag } from '@use-gesture/react';
import cx from 'classnames';

import { Icon, msMenu } from "ui/material-symbols";
import { useOverlay } from "ui/overlays/overlays";
import { CloseButton } from "ui/control";
import { ParentContext } from "ui/hook";
import SandwichMenu from "ui/mainmenu/sandwich/SandwichMenu";
import "./Sandwich.css";

const EDGE_HOTZONE = 70;
const GESTURE_TIMEOUT = 3000;
const GESTURE_DISTANCE = 50;

export default function Sandwich() {
    const [open, setOpen] = useState<boolean>(false);
    const offcanvasRef = useRef<HTMLDivElement>(null);

    const onClick = () => setOpen(open => !open);

    const onClose = () => setOpen(false);

    const [zIndex, overlayId] = useOverlay(offcanvasRef, {visible: open, onClose});

    useDrag(
        ({first, last, movement: [mx], initial: [ix], cancel, tap, elapsedTime}) => {
            if (!window.overlays.isEmpty() && !open) {
                cancel();
                return;
            }
            if (tap) {
                cancel();
                return;
            }
            if (first && ix > EDGE_HOTZONE && !open) {
                cancel();
                return;
            }
            if (elapsedTime > GESTURE_TIMEOUT) {
                cancel();
                return;
            }
            if (last) {
                if (!open && mx >= GESTURE_DISTANCE) {
                    setOpen(true);
                    return;
                }
                if (open && mx <= -GESTURE_DISTANCE) {
                    setOpen(false);
                }
            }
        },
        {
            axis: "x",
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

    return (
        <>
            <button id="sandwich" onClick={onClick}>
                <Icon icon={msMenu} size={24}/>
            </button>
            {ReactDOM.createPortal(
                <ParentContext.Provider value={{hide: onClose, overlayId}}>
                    <div className={cx("offcanvas", "offcanvas-start", {"show": open})} tabIndex={-1}
                         style={{zIndex: zIndex?.widget}}>
                        <div className="offcanvas-header">
                            <CloseButton onClick={onClose}/>
                        </div>
                        <SandwichMenu ref={offcanvasRef}/>
                    </div>
                    <div className={cx("offcanvas-backdrop", "fade", {"show": open})} style={{zIndex: zIndex?.shadow}}/>
                </ParentContext.Provider>,
                document.getElementById("modal-root")!
            )}
        </>
    );
}
