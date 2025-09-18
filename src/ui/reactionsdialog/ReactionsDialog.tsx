import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ReactDOM from 'react-dom';

import { ClientState } from "state/state";
import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { isReactionsDialogPermitted } from "state/reactionsdialog/selectors";
import { PopoverContext } from "ui/control";
import { useOverlay } from "ui/overlays/overlays";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import "./ReactionsDialog.css";

export default function ReactionsDialog() {
    const viewReactions = useSelector((state: ClientState) =>
        isReactionsDialogPermitted("viewReactions", "public", state)
    );
    const modalDialog = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const onClose = useCallback(() => dispatch(closeReactionsDialog()), [dispatch]);

    const [zIndex, overlayId] = useOverlay(modalDialog, {onClose});

    const itemsRef = useRef<HTMLDivElement>(null);
    const [chartView, setChartView] = useState<boolean>(false);

    useEffect(() => {
        if (itemsRef.current) {
            itemsRef.current.focus();
        }
    }, [itemsRef, chartView]);

    const onSwitchView = () => setChartView(!chartView);

    return ReactDOM.createPortal(
        <PopoverContext.Provider value={{hide: onClose, update: () => {}, overlayId}}>
            <div className="reactions-dialog-backdrop modal" style={{zIndex: zIndex?.shadow}}>
                <div className="reactions-dialog popover show" style={{zIndex: zIndex?.widget}} ref={modalDialog}>
                    <div className="popover-body">
                        {chartView || !viewReactions ?
                            <ReactionsChartView itemsRef={itemsRef}
                                                onSwitchView={viewReactions ? onSwitchView : undefined}/>
                        :
                            <ReactionsListView itemsRef={itemsRef} onSwitchView={onSwitchView}/>
                        }
                    </div>
                </div>
            </div>
        </PopoverContext.Provider>,
        document.getElementById("modal-root")!
    );
}
