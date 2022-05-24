import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { isPermitted } from "state/node/selectors";
import { getPosting } from "state/postings/selectors";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";
import "./ReactionsDialog.css";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

interface State {
    chartView: boolean;
}

class ReactionsDialog extends React.PureComponent<Props, State> {

    #itemsDom: HTMLDivElement | null = null;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {chartView: false};
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (((!prevProps.show && this.props.show)
            || prevState.chartView !== this.state.chartView)
            && this.#itemsDom) {

            this.#itemsDom.focus();
        }
    }

    onSwitchView = () => {
        this.setState(prev => ({chartView: !prev.chartView}));
    };

    render() {
        const {show, viewReactions, closeReactionsDialog} = this.props;

        if (!show) {
            return null;
        }

        const chartView = this.state.chartView || !viewReactions;
        return (
            <ModalDialog onClose={closeReactionsDialog}>
                <div className="reactions-dialog modal-body">
                    {chartView ?
                        <ReactionsChartView itemsRef={dom => {this.#itemsDom = dom}}
                                            onSwitchView={viewReactions ? this.onSwitchView : undefined}/>
                    :
                        <ReactionsListView itemsRef={dom => {this.#itemsDom = dom}}
                                           onSwitchView={this.onSwitchView}/>
                    }
                </div>
            </ModalDialog>
        );
    }

}

const connector = connect(
    (state: ClientState) => {
        const posting = getPosting(state, state.reactionsDialog.postingId);
        return {
            show: state.reactionsDialog.show,
            viewReactions: isPermitted("viewReactions", posting, state)
        }
    },
    { closeReactionsDialog }
);

export default connector(ReactionsDialog);
