import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { isReactionsDialogPermitted } from "state/reactionsdialog/selectors";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";
import "./ReactionsDialog.css";

export default function ReactionsDialog() {
    const viewReactions = useSelector((state: ClientState) =>
        isReactionsDialogPermitted("viewReactions", "public", state));
    const dispatch = useDispatch();

    const itemsRef = useRef<HTMLDivElement>(null);
    const [chartView, setChartView] = useState<boolean>(false);

    useEffect(() => {
        if (itemsRef.current) {
            itemsRef.current.focus();
        }
    }, [itemsRef, chartView]);

    const onSwitchView = () => setChartView(!chartView);

    return (
        <ModalDialog onClose={() => dispatch(closeReactionsDialog())}>
            <div className="reactions-dialog modal-body">
                {chartView || !viewReactions ?
                    <ReactionsChartView itemsRef={itemsRef} onSwitchView={viewReactions ? onSwitchView : undefined}/>
                :
                    <ReactionsListView itemsRef={itemsRef} onSwitchView={onSwitchView}/>
                }
            </div>
        </ModalDialog>
    );
}
