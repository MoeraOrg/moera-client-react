import React, { useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { isReactionsDialogPermitted } from "state/reactionsdialog/selectors";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";
import "./ReactionsDialog.css";

type Props = ConnectedProps<typeof connector>;

function ReactionsDialog({show, viewReactions, closeReactionsDialog}: Props) {
    const itemsRef = useRef<HTMLDivElement>(null);
    const [chartView, setChartView] = useState<boolean>(false);

    useEffect(() => {
        if (itemsRef.current) {
            itemsRef.current.focus();
        }
    }, [itemsRef, show, chartView]);

    const onSwitchView = () => setChartView(!chartView);

    if (!show) {
        return null;
    }

    return (
        <ModalDialog onClose={closeReactionsDialog}>
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

const connector = connect(
    (state: ClientState) => ({
        show: state.reactionsDialog.show,
        viewReactions: isReactionsDialogPermitted("viewReactions", "public", state)
    }),
    { closeReactionsDialog }
);

export default connector(ReactionsDialog);
