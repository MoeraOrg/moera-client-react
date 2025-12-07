import React, { Suspense, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modifier, usePopper } from 'react-popper';
import cx from 'classnames';

import { ClientState } from "state/state";
import { closeInstantsPopover, openInstantsPopover } from "state/instants/actions";
import { PopoverContext } from "ui/control";
import { ParentContext } from "ui/hook";
import { useOverlay } from "ui/overlays/overlays";
import InstantBell from "ui/instant/InstantBell";

const InstantsPopover = React.lazy(() => import("ui/instant/InstantsPopover"));

export default function InstantButton() {
    const [buttonRef, setButtonRef] = useState<Element | null>(null);
    const [popperRef, setPopperRef] = useState<HTMLElement | null>(null);
    const modifiers: Modifier<any>[] = [{name: "offset", options: {offset: [0, 15]}}];
    const {styles, attributes, forceUpdate} = usePopper(buttonRef, popperRef, {placement: "bottom-end", modifiers});

    const visible = useSelector((state: ClientState) => state.instants.showPopover);
    const dispatch = useDispatch();

    const onClick = () => dispatch(!visible ? openInstantsPopover() : closeInstantsPopover());

    const hide = () => setTimeout(() => dispatch(closeInstantsPopover()));

    const [zIndex, overlayId] = useOverlay(popperRef, {visible, onClose: hide});

    return (
        <Suspense fallback={<InstantBell/>}>
            <ParentContext.Provider value={{hide, overlayId}}>
                <PopoverContext.Provider value={{update: forceUpdate ?? (() => {})}}>
                    <span className={cx({"active": visible})} ref={setButtonRef}><InstantBell onClick={onClick}/></span>
                    {ReactDOM.createPortal(
                        visible &&
                            <div
                                ref={setPopperRef}
                                style={{...styles.popper, zIndex: zIndex?.widget}}
                                {...attributes.popper}
                                className={cx(
                                    "popover",
                                    "fade",
                                    {"show": visible},
                                    "instant-popover"
                                )}
                            >
                                <div className="popover-body">
                                    <InstantsPopover/>
                                </div>
                            </div>,
                        document.getElementById("modal-root")!
                    )}
                </PopoverContext.Provider>
            </ParentContext.Provider>
        </Suspense>
    );
}
