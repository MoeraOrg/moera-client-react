import React from 'react';
import { connect } from 'react-redux';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import "./ReactionsDialog.css";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";

class ReactionsDialog extends React.PureComponent {
    #itemsDom;

    constructor(props, context) {
        super(props, context);

        this.state = {chartView: false};
        this.onSwitchView = this.onSwitchView.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (((!prevProps.show && this.props.show)
            || prevProps.activeTab !== this.props.activeTab
            || prevState.chartView !== this.state.chartView)
            && this.#itemsDom) {

            this.#itemsDom.focus();
        }
    }

    onSwitchView() {
        this.setState(prev => ({chartView: !prev.chartView}));
    }

    render() {
        const {show, postingId, closeReactionsDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog onClose={closeReactionsDialog}>
                <div className="reactions-dialog modal-body">
                    {this.state.chartView ?
                        <ReactionsChartView itemsRef={dom => {this.#itemsDom = dom}} onSwitchView={this.onSwitchView}/>
                    :
                        <ReactionsListView postingId={postingId} itemsRef={dom => {this.#itemsDom = dom}}
                                           onSwitchView={this.onSwitchView}/>
                    }
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.reactionsDialog.show,
        postingId: state.reactionsDialog.postingId
    }),
    { closeReactionsDialog }
)(ReactionsDialog);
