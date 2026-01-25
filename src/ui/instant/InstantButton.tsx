import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { offset, useFloating } from '@floating-ui/react';
import cx from 'classnames';

import { ClientState } from "state/state";
import { closeInstantsPopover, openInstantsPopover } from "state/instants/actions";
import { PopoverContext } from "ui/control";
import { ParentContext } from "ui/hook";
import { useOverlay } from "ui/overlays/overlays";
import InstantBell from "ui/instant/InstantBell";

const InstantsPopover = React.lazy(() => import("ui/instant/InstantsPopover"));

export default function InstantButton() {
    const {refs, floatingStyles, update} = useFloating({
        placement: "bottom-end", strategy: "fixed", middleware: [offset(15)]
    });

    const componentLoaded = useSelector((state: ClientState) => state.instants.componentLoaded);
    const visible = useSelector((state: ClientState) => state.instants.showPopover);
    const dispatch = useDispatch();

    const onClick = () => dispatch(!visible ? openInstantsPopover() : closeInstantsPopover());

    const hide = () => setTimeout(() => dispatch(closeInstantsPopover()));

    const [zIndex, overlayId] = useOverlay(refs.floating, {visible, onClose: hide});

    return (
        <Suspense fallback={<InstantBell/>}>
            <ParentContext.Provider value={{hide, overlayId}}>
                <PopoverContext.Provider value={{update}}>
                    <span className={cx({"active": visible})} ref={refs.setReference}>
                        <InstantBell onClick={onClick}/>
                    </span>
                    {ReactDOM.createPortal(
                        componentLoaded &&
                            <div
                                ref={refs.setFloating}
                                style={{...floatingStyles, zIndex: zIndex?.widget}}
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
