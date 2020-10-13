import React from 'react';
import { connect } from 'react-redux';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { isPermitted } from "state/node/selectors";
import { getPosting } from "state/postings/selectors";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import ReactionsChartView from "ui/reactionsdialog/ReactionsChartView";
import "./ReactionsDialog.css";

class ReactionsDialog extends React.PureComponent {
    #itemsDom;

    constructor(props, context) {
        super(props, context);

        this.state = {chartView: false};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (((!prevProps.show && this.props.show)
            || prevProps.activeTab !== this.props.activeTab
            || prevState.chartView !== this.state.chartView)
            && this.#itemsDom) {

            this.#itemsDom.focus();
        }
    }

    onSwitchView = () => {
        this.setState(prev => ({chartView: !prev.chartView}));
    };

    render() {
        const {show, posting, reactionsVisible, closeReactionsDialog} = this.props;

        if (!show) {
            return null;
        }
        const chartView = this.state.chartView || !reactionsVisible
            || (!posting.reactionsVisible && posting.receiverName != null);
        return (
            <ModalDialog onClose={closeReactionsDialog}>
                <div className="reactions-dialog modal-body">
                    {chartView ?
                        <ReactionsChartView itemsRef={dom => {this.#itemsDom = dom}}
                                            onSwitchView={reactionsVisible ? this.onSwitchView : null}/>
                    :
                        <ReactionsListView itemsRef={dom => {this.#itemsDom = dom}}
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
        posting: getPosting(state, state.reactionsDialog.postingId),
        reactionsVisible: isPermitted("reactions", getPosting(state, state.reactionsDialog.postingId), state)
    }),
    { closeReactionsDialog }
)(ReactionsDialog);
